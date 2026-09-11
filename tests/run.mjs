import { build } from "esbuild";
import { mkdir, readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { resolve } from "node:path";
await mkdir(".build/tests", { recursive: true });
await build({
  entryPoints: [
    "netlify/functions/admin.ts",
    "netlify/functions/inquiries.ts",
    "netlify/functions/_shared/auth.ts",
    "netlify/functions/_shared/secrets.ts",
    "netlify/functions/_shared/form-key.ts",
    "src/content/validation.ts",
    "src/entry-server.tsx",
  ],
  outdir: ".build/tests",
  outbase: ".",
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  splitting: true,
  jsx: "automatic",
  alias: { "@netlify/blobs": resolve("tests/blobs-fixture.mjs") },
});
const { default: admin } =
  await import("../.build/tests/netlify/functions/admin.js");
const { default: submit } =
  await import("../.build/tests/netlify/functions/inquiries.js");
const { formKey } =
  await import("../.build/tests/netlify/functions/_shared/form-key.js");
const { canAdmin } =
  await import("../.build/tests/netlify/functions/_shared/auth.js");
const { seal, unseal, formToken, verifyFormToken } =
  await import("../.build/tests/netlify/functions/_shared/secrets.js");
const { validateContent } =
  await import("../.build/tests/src/content/validation.js");
const { render } = await import("../.build/tests/src/entry-server.js");
const seed = JSON.parse(await readFile("src/content/seed.json", "utf8"));
const key = randomBytes(32).toString("base64");
const env = {
  SIXTEEN_OAKS_SECRET_KEY: key,
  SIXTEEN_OAKS_ADMIN_EMAILS: "owner@example.com",
};
globalThis.Netlify = {
  env: { get: (name) => env[name] },
  context: { url: "https://example.test", cookies: { get: () => null } },
};
const context = {
  deploy: { context: "deploy-preview", id: "test-deploy" },
  site: { url: "https://example.test" },
};
const owner = {
  id: "owner",
  email: "owner@example.com",
  confirmedAt: new Date().toISOString(),
};
assert.equal(canAdmin(owner, ""), false);
assert.equal(
  canAdmin({ ...owner, confirmedAt: undefined }, env.SIXTEEN_OAKS_ADMIN_EMAILS),
  false,
);
assert.equal(
  canAdmin(
    { ...owner, email: "other@example.com" },
    env.SIXTEEN_OAKS_ADMIN_EMAILS,
  ),
  false,
);
assert.equal(canAdmin(owner, env.SIXTEEN_OAKS_ADMIN_EMAILS), true);
function request(path, method = "GET", body, origin = "https://example.test") {
  return new Request("https://example.test/api/admin/" + path, {
    method,
    headers: { Origin: origin, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
assert.equal((await admin(request("content"), context)).status, 401);
assert.equal(
  (await admin(request("content", "PUT", {}, "https://attacker.test"), context))
    .status,
  403,
);
// Identity getUser verifies the presented session at the Identity user endpoint.
globalThis.netlifyIdentityContext = {
  url: "https://example.test/.netlify/identity",
  token: "test-session",
};
globalThis.fetch = async () =>
  Response.json({
    id: owner.id,
    email: owner.email,
    confirmed_at: owner.confirmedAt,
    app_metadata: {},
    user_metadata: {},
  });
let response = await admin(request("content"), context);
assert.equal(response.status, 200);
let initial = await response.json();
assert.equal(initial.etag, "seed");
const content = structuredClone(initial.content);
const draft = {
  ...content.projects[0],
  id: "second-project",
  slug: "second-project",
  title: "Second project",
  status: "draft",
};
content.projects.push(draft);
assert.equal(validateContent(content).projects.length, 2);
assert.equal(render("/work/second-project/", content).notFound, true);
assert.ok(!render("/work/", content).html.includes("Second project"));
content.projects[1].status = "published";
assert.equal(render("/work/second-project/", content).notFound, false);
assert.ok(render("/work/", content).html.includes("Second project"));
response = await admin(
  request("content", "PUT", { content, etag: "seed" }),
  context,
);
assert.equal(response.status, 200);
const saved = await response.json();
assert.equal(
  (await admin(request("content", "PUT", { content, etag: "seed" }), context))
    .status,
  409,
);
const unsafe = structuredClone(content);
unsafe.projects[0].website = "javascript:alert(1)";
assert.throws(() => validateContent(unsafe));
unsafe.projects[0].website = "https://safe.test";
unsafe.projects[0].cover.src = "/assets/../secret.png";
assert.throws(() => validateContent(unsafe));
const renamed = structuredClone(content);
renamed.projects[0].slug = "changed";
assert.equal(
  (
    await admin(
      request("content", "PUT", { content: renamed, etag: saved.etag }),
      context,
    )
  ).status,
  400,
);
const secret = " password with spaces ";
assert.equal(unseal(seal(secret)), secret);
assert.throws(() => unseal(seal(secret) + "bad"));
const now = Date.now();
const token = formToken(undefined, now - 2000);
assert.ok(verifyFormToken(token));
assert.equal(verifyFormToken(token + "tamper"), null);
assert.equal(
  verifyFormToken(formToken(undefined, now - 3 * 60 * 60 * 1000)),
  null,
);
assert.equal(verifyFormToken(formToken(undefined, now + 10000)), null);
const form = new URLSearchParams({
  formToken: formToken(await formKey(context), now - 2000),
  name: "Test inquiry",
  email: "visitor@example.com",
  message: "Please tell me more about your services.",
});
function submission(body) {
  return new Request("https://example.test/api/inquiries", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
}
assert.equal((await submit(submission(form), context)).status, 200);
assert.equal((await submit(submission(form), context)).status, 200);
let inbox = await (await admin(request("inbox"), context)).json();
assert.equal(inbox.length, 1);
assert.equal(inbox[0].notification, "not-configured");
assert.equal(
  (
    await admin(
      request("inbox/" + inbox[0].id, "PATCH", { status: "read" }),
      context,
    )
  ).status,
  200,
);
assert.equal(
  (await (await admin(request("inbox"), context)).json())[0].status,
  "read",
);
assert.equal(
  (
    await submit(
      submission(
        new URLSearchParams({ ...Object.fromEntries(form), formToken: "bad" }),
      ),
      context,
    )
  ).status,
  400,
);
const mail = {
  enabled: true,
  host: "smtp.example.com",
  port: 587,
  username: "owner@example.com",
  from: "owner@example.com",
  password: secret,
  etag: "seed",
};
response = await admin(request("mail", "PUT", mail), context);
assert.equal(response.status, 200);
const mailResult = await response.json();
assert.equal(mailResult.passwordConfigured, true);
assert.equal(mailResult.password, undefined);
assert.equal(mailResult.encryptedPassword, undefined);
const publicMail = await (await admin(request("mail"), context)).json();
assert.equal(publicMail.password, undefined);
assert.equal(publicMail.encryptedPassword, undefined);
assert.equal(
  (
    await admin(
      request("mail", "PUT", { ...mail, password: "", etag: "seed" }),
      context,
    )
  ).status,
  409,
);
const isolated = {
  ...context,
  deploy: { context: "production", id: "live-deploy" },
};
assert.equal(
  (await (await admin(request("content"), isolated)).json()).content.projects
    .length,
  1,
);
assert.equal(
  (await (await admin(request("inbox"), isolated)).json()).length,
  0,
);
console.log(
  "Passed: admin authorization, CSRF, project visibility, persistence, save conflicts, safe links/images, encryption, signed form tokens, duplicate submission protection, inbox status, email credential redaction, preview isolation.",
);
