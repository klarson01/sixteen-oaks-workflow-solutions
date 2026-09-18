import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";

const { default: admin } =
  await import("../.build/tests/netlify/functions/admin.js");
const { storeFor } =
  await import("../.build/tests/netlify/functions/_shared/store.js");
const { unseal } =
  await import("../.build/tests/netlify/functions/_shared/secrets.js");

const previousNetlify = globalThis.Netlify;
const previousIdentity = globalThis.netlifyIdentityContext;
const previousFetch = globalThis.fetch;
const key = randomBytes(32).toString("base64");
const env = {
  SIXTEEN_OAKS_SECRET_KEY: key,
  SIXTEEN_OAKS_ADMIN_EMAILS: "owner@example.com",
};
globalThis.Netlify = {
  env: { get: (name) => env[name] },
  context: { url: "https://example.test", cookies: { get: () => null } },
};
globalThis.netlifyIdentityContext = {
  url: "https://example.test/.netlify/identity",
  token: "backup-test-session",
};
globalThis.fetch = async () =>
  Response.json({
    id: "backup-owner",
    email: "owner@example.com",
    confirmed_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {},
  });

const context = {
  deploy: { context: "branch-deploy", id: "backup-test" },
  site: { url: "https://example.test" },
};
function jsonRequest(path, method = "GET", body, origin = "https://example.test") {
  return new Request("https://example.test/api/admin/" + path, {
    method,
    headers: { Origin: origin, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
function mediaRequest(path, bytes) {
  return new Request("https://example.test/api/admin/" + path, {
    method: "POST",
    headers: { Origin: "https://example.test", "Content-Type": "image/png" },
    body: bytes,
  });
}

let response = await admin(jsonRequest("content"), context);
const initial = await response.json();
const originalContent = structuredClone(initial.content);
originalContent.settings.phone = "608.555.0100";
response = await admin(
  jsonRequest("content", "PUT", {
    content: originalContent,
    etag: initial.etag,
  }),
  context,
);
assert.equal(response.status, 200);

const appPassword = "fixture-app-password";
response = await admin(
  jsonRequest("mail", "PUT", {
    enabled: true,
    host: "smtp.example.com",
    port: 587,
    username: "owner@example.com",
    from: "owner@example.com",
    password: appPassword,
    etag: "seed",
  }),
  context,
);
assert.equal(response.status, 200);

const store = storeFor(context);
const savedInquiry = {
  id: randomUUID(),
  createdAt: new Date("2026-09-18T10:00:00Z").toISOString(),
  name: "Backup customer",
  email: "customer@example.com",
  phone: "608.555.0123",
  business: "Main Street shop",
  service: "Website",
  message: "Please keep this inquiry in the recovery test.",
  page: "/services/",
  status: "read",
  notification: "sent",
};
await store.setJSON(`inquiries/${savedInquiry.id}`, savedInquiry);

const imageBytes = new Uint8Array([
  137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0,
]);
response = await admin(mediaRequest("upload", imageBytes), context);
assert.equal(response.status, 200);
const uploaded = await response.json();
const mediaId = uploaded.src.split("/").pop();

response = await admin(jsonRequest("backup"), context);
assert.equal(response.status, 200);
const backup = await response.json();
assert.equal(backup.manifest.schema, "sixteen-oaks-admin-backup");
assert.equal(backup.manifest.version, 1);
assert.equal(backup.manifest.counts.projects, originalContent.projects.length);
assert.equal(backup.manifest.counts.inquiries, 1);
assert.equal(backup.manifest.counts.media, 1);
assert.equal(backup.manifest.media[0].id, mediaId);
assert.equal(backup.inquiries[0].id, savedInquiry.id);
assert.ok(backup.mail.encryptedPassword);
const serialized = JSON.stringify(backup);
assert.equal(serialized.includes(appPassword), false);
assert.equal(serialized.includes(key), false);

response = await admin(jsonRequest("backup-media/" + mediaId), context);
assert.equal(response.status, 200);
assert.equal(response.headers.get("Content-Type"), "image/png");
assert.deepEqual(
  new Uint8Array(await response.arrayBuffer()),
  imageBytes,
);

// Make a harmless edit and add records that should disappear when the backup replaces state.
const changedRead = await (
  await admin(jsonRequest("content"), context)
).json();
const changedContent = structuredClone(changedRead.content);
changedContent.settings.phone = "608.555.9999";
assert.equal(
  (
    await admin(
      jsonRequest("content", "PUT", {
        content: changedContent,
        etag: changedRead.etag,
      }),
      context,
    )
  ).status,
  200,
);
const extraInquiryId = randomUUID();
await store.setJSON(`inquiries/${extraInquiryId}`, {
  ...savedInquiry,
  id: extraInquiryId,
  name: "Remove during restore",
});
const extraMediaId = randomUUID();
await store.set(`media/${extraMediaId}`, imageBytes, {
  metadata: { contentType: "image/png" },
});

response = await admin(
  jsonRequest("restore-preview", "POST", backup),
  context,
);
assert.equal(response.status, 200);
const preview = await response.json();
assert.equal(preview.current.inquiries, 2);
assert.equal(preview.incoming.inquiries, 1);
assert.equal(preview.current.media, 2);
assert.equal(preview.incoming.media, 1);
assert.equal(preview.emailConnectionIncluded, true);

response = await admin(
  mediaRequest(
    `restore-media/${mediaId}?session=${preview.session}`,
    imageBytes,
  ),
  context,
);
assert.equal(response.status, 200);
assert.equal(
  (
    await admin(
      jsonRequest("restore-commit", "POST", {
        session: preview.session,
        confirmation: "restore",
      }),
      context,
    )
  ).status,
  400,
);
response = await admin(
  jsonRequest("restore-commit", "POST", {
    session: preview.session,
    confirmation: "RESTORE",
  }),
  context,
);
assert.equal(response.status, 200);
const restored = await response.json();
assert.deepEqual(restored.restored, backup.manifest.counts);
assert.deepEqual(
  (await (await admin(jsonRequest("content"), context)).json()).content,
  backup.content,
);
assert.deepEqual(
  await store.get(`inquiries/${savedInquiry.id}`, { type: "json" }),
  savedInquiry,
);
assert.equal(await store.get(`inquiries/${extraInquiryId}`), null);
assert.equal(await store.get(`media/${extraMediaId}`), null);
assert.deepEqual(
  new Uint8Array(await store.get(`media/${mediaId}`, { type: "arrayBuffer" })),
  imageBytes,
);
assert.equal(
  unseal((await store.get("mail", { type: "json" })).encryptedPassword),
  appPassword,
);

// A restore preview is invalidated when saved data changes before commit.
response = await admin(
  jsonRequest("restore-preview", "POST", backup),
  context,
);
const stale = await response.json();
assert.equal(response.status, 200);
assert.equal(
  (
    await admin(
      mediaRequest(
        `restore-media/${mediaId}?session=${stale.session}`,
        imageBytes,
      ),
      context,
    )
  ).status,
  200,
);
const concurrentInquiryId = randomUUID();
await store.setJSON(`inquiries/${concurrentInquiryId}`, {
  ...savedInquiry,
  id: concurrentInquiryId,
});
assert.equal(
  (
    await admin(
      jsonRequest("restore-commit", "POST", {
        session: stale.session,
        confirmation: "RESTORE",
      }),
      context,
    )
  ).status,
  409,
);

const badVersion = structuredClone(backup);
badVersion.manifest.version = 999;
assert.equal(
  (
    await admin(jsonRequest("restore-preview", "POST", badVersion), context)
  ).status,
  400,
);
const wrongCiphertext = structuredClone(backup);
wrongCiphertext.mail.encryptedPassword += "tampered";
assert.equal(
  (
    await admin(
      jsonRequest("restore-preview", "POST", wrongCiphertext),
      context,
    )
  ).status,
  400,
);
assert.equal(
  (
    await admin(
      jsonRequest(
        "restore-preview",
        "POST",
        backup,
        "https://attacker.test",
      ),
      context,
    )
  ).status,
  403,
);

globalThis.Netlify = previousNetlify;
globalThis.netlifyIdentityContext = previousIdentity;
globalThis.fetch = previousFetch;
console.log(
  "Passed: complete backup, encrypted credential redaction, image integrity, restore preview, explicit confirmation, replacement recovery, and stale-workspace protection.",
);
