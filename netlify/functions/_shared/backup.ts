import { createHash, randomUUID } from "node:crypto";
import type { Context } from "@netlify/functions";
import type { Inquiry, SiteContent } from "../../../src/content/model";
import {
  BACKUP_SCHEMA,
  BACKUP_VERSION,
  type BackupMail,
  type BackupManifest,
  type BackupMedia,
  type BackupPayload,
  type RestorePreview,
} from "../../../src/content/backup";
import {
  email,
  text,
  validateContent,
  validateMail,
  ValidationError,
} from "../../../src/content/validation";
import { unseal } from "./secrets";
import { readContent, storeFor } from "./store";

const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
const SHA256 = /^[a-f0-9]{64}$/;
const SESSION_PREFIX = "restore-sessions/";
const SESSION_LIFETIME = 30 * 60 * 1000;
const MAX_INQUIRIES = 10000;
const MAX_MEDIA = 1000;
const CONTENT_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;
type ContentType = keyof typeof CONTENT_TYPES;
type Store = ReturnType<typeof storeFor>;

interface RestoreSession {
  owner: string;
  expiresAt: string;
  fingerprint: string;
  contentEtag: string;
  backup: BackupPayload;
}

export class RestoreConflict extends Error {}

function record(value: unknown, message = "The backup file is invalid.") {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new ValidationError(message);
  return value as Record<string, unknown>;
}

function imageType(bytes: Uint8Array): ContentType | null {
  const signature = Buffer.from(bytes);
  if (
    signature.length >= 8 &&
    signature
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    return "image/png";
  if (
    signature.length >= 3 &&
    signature[0] === 255 &&
    signature[1] === 216 &&
    signature[2] === 255
  )
    return "image/jpeg";
  if (
    signature.length >= 12 &&
    signature.toString("ascii", 0, 4) === "RIFF" &&
    signature.toString("ascii", 8, 12) === "WEBP"
  )
    return "image/webp";
  return null;
}

function digest(bytes: Uint8Array) {
  return createHash("sha256").update(bytes).digest("hex");
}

function validateStoredMail(value: unknown): BackupMail | null {
  if (value === null || value === undefined) return null;
  const source = record(value);
  const encryptedPassword = text(
    source.encryptedPassword ?? "",
    "Encrypted mail password",
    4096,
  );
  const checked = validateMail({ ...source, password: "" });
  if (checked.enabled && !encryptedPassword)
    throw new ValidationError(
      "The backup is missing the encrypted email password.",
    );
  if (encryptedPassword) {
    try {
      unseal(encryptedPassword);
    } catch {
      throw new ValidationError(
        "This backup's email connection cannot be restored with this site's encryption key.",
      );
    }
  }
  return {
    enabled: checked.enabled,
    host: checked.host,
    port: checked.port,
    username: checked.username,
    from: checked.from,
    encryptedPassword,
  };
}

function validateInquiry(value: unknown): Inquiry {
  const source = record(value);
  const id = text(source.id, "Inquiry ID", 36, true);
  if (!UUID.test(id)) throw new ValidationError("An inquiry ID is invalid.");
  const createdAt = text(source.createdAt, "Inquiry date", 40, true);
  if (!Number.isFinite(Date.parse(createdAt)))
    throw new ValidationError("An inquiry date is invalid.");
  if (![
    "new",
    "read",
    "archived",
  ].includes(String(source.status)))
    throw new ValidationError("An inquiry status is invalid.");
  if (![
    "sent",
    "failed",
    "not-configured",
  ].includes(String(source.notification)))
    throw new ValidationError("An inquiry notification status is invalid.");
  return {
    id,
    createdAt: new Date(createdAt).toISOString(),
    name: text(source.name, "Inquiry name", 120, true),
    email: email(source.email, "Inquiry email"),
    phone: text(source.phone ?? "", "Inquiry phone", 40),
    business: text(source.business ?? "", "Inquiry business", 160),
    service: text(source.service ?? "", "Inquiry service", 80),
    message: text(source.message, "Inquiry message", 5000, true),
    page: text(source.page ?? "", "Inquiry page", 200),
    status: source.status as Inquiry["status"],
    notification: source.notification as Inquiry["notification"],
  };
}

function validateMedia(value: unknown): BackupMedia {
  const source = record(value);
  const id = text(source.id, "Media ID", 36, true);
  if (!UUID.test(id)) throw new ValidationError("A media ID is invalid.");
  const contentType = text(
    source.contentType,
    "Media type",
    40,
    true,
  ) as ContentType;
  if (!(contentType in CONTENT_TYPES))
    throw new ValidationError("A backup image type is invalid.");
  if (
    typeof source.size !== "number" ||
    !Number.isInteger(source.size) ||
    source.size < 12 ||
    source.size > 2000000
  )
    throw new ValidationError("A backup image size is invalid.");
  const sha256 = text(source.sha256, "Media checksum", 64, true);
  if (!SHA256.test(sha256))
    throw new ValidationError("A backup image checksum is invalid.");
  const file = text(source.file, "Media file", 120, true);
  if (file !== `media/${id}.${CONTENT_TYPES[contentType]}`)
    throw new ValidationError("A backup image filename is invalid.");
  return { id, file, contentType, size: source.size, sha256 };
}

export function validateBackup(value: unknown): BackupPayload {
  const source = record(value);
  const manifestSource = record(source.manifest);
  if (
    manifestSource.schema !== BACKUP_SCHEMA ||
    manifestSource.version !== BACKUP_VERSION ||
    manifestSource.site !== "sixteenoaks"
  )
    throw new ValidationError(
      "Choose a supported Sixteen Oaks website backup.",
    );
  if (![
    "production",
    "preview",
  ].includes(String(manifestSource.environment)))
    throw new ValidationError("The backup environment is invalid.");
  const createdAt = text(
    manifestSource.createdAt,
    "Backup date",
    40,
    true,
  );
  if (!Number.isFinite(Date.parse(createdAt)))
    throw new ValidationError("The backup date is invalid.");
  const files = record(manifestSource.files);
  if (
    files.content !== "content.json" ||
    files.mail !== "mail.json" ||
    files.inquiries !== "inquiries.json"
  )
    throw new ValidationError("The backup file list is invalid.");
  if (!Array.isArray(manifestSource.media) || manifestSource.media.length > MAX_MEDIA)
    throw new ValidationError(`Up to ${MAX_MEDIA} backup images are supported.`);
  const media = manifestSource.media.map(validateMedia);
  if (new Set(media.map((item) => item.id)).size !== media.length)
    throw new ValidationError("The backup contains duplicate images.");
  if (!Array.isArray(source.inquiries) || source.inquiries.length > MAX_INQUIRIES)
    throw new ValidationError(`Up to ${MAX_INQUIRIES} inquiries are supported.`);
  const inquiries = source.inquiries.map(validateInquiry);
  if (new Set(inquiries.map((item) => item.id)).size !== inquiries.length)
    throw new ValidationError("The backup contains duplicate inquiries.");
  const content = validateContent(source.content);
  const mail = validateStoredMail(source.mail);
  const counts = record(manifestSource.counts);
  if (
    counts.projects !== content.projects.length ||
    counts.inquiries !== inquiries.length ||
    counts.media !== media.length
  )
    throw new ValidationError("The backup counts do not match its contents.");
  const mediaIds = new Set(media.map((item) => item.id));
  const images = content.projects.flatMap((project) => [
    project.cover,
    ...project.gallery,
  ]);
  if (content.homepage)
    images.push(
      content.homepage.heroImage,
      content.homepage.communityImage,
      content.homepage.closingImage,
    );
  for (const image of images) {
    const match = image.src.match(/^\/api\/media\/([a-f0-9-]{36})$/);
    if (match && !mediaIds.has(match[1]))
      throw new ValidationError("The backup is missing a website image.");
  }
  const manifest: BackupManifest = {
    schema: BACKUP_SCHEMA,
    version: BACKUP_VERSION,
    createdAt: new Date(createdAt).toISOString(),
    site: "sixteenoaks",
    environment: manifestSource.environment as BackupManifest["environment"],
    files: {
      content: "content.json",
      mail: "mail.json",
      inquiries: "inquiries.json",
    },
    counts: {
      projects: content.projects.length,
      inquiries: inquiries.length,
      media: media.length,
    },
    media,
  };
  return { manifest, content, mail, inquiries };
}

async function valuesForPrefix<T>(store: Store, prefix: string) {
  const entries = await store.list({ prefix });
  const values: T[] = [];
  for (let offset = 0; offset < entries.blobs.length; offset += 20) {
    const batch = await Promise.all(
      entries.blobs
        .slice(offset, offset + 20)
        .map((entry) => store.get(entry.key, { type: "json" })),
    );
    values.push(...batch.filter((value): value is T => !!value));
  }
  return values;
}

async function mediaForStore(store: Store) {
  const entries = await store.list({ prefix: "media/" });
  const media: BackupMedia[] = [];
  for (let offset = 0; offset < entries.blobs.length; offset += 4) {
    const batch = await Promise.all(
      entries.blobs.slice(offset, offset + 4).map(async (entry) => {
        const match = entry.key.match(/^media\/([a-f0-9-]{36})$/);
        if (!match) throw new ValidationError("A stored image key is invalid.");
        const stored = await store.getWithMetadata(entry.key, {
          type: "arrayBuffer",
        });
        if (!stored) throw new ValidationError("A stored image is unavailable.");
        const bytes = new Uint8Array(stored.data);
        const contentType = String(stored.metadata.contentType) as ContentType;
        if (
          !(contentType in CONTENT_TYPES) ||
          imageType(bytes) !== contentType ||
          bytes.length > 2000000
        )
          throw new ValidationError("A stored image is invalid.");
        return {
          id: match[1],
          file: `media/${match[1]}.${CONTENT_TYPES[contentType]}`,
          contentType,
          size: bytes.length,
          sha256: digest(bytes),
        } satisfies BackupMedia;
      }),
    );
    media.push(...batch);
  }
  return media.sort((a, b) => a.id.localeCompare(b.id));
}

export async function createBackup(context: Context): Promise<BackupPayload> {
  const store = storeFor(context);
  const [{ content }, mailValue, inquiries, media] = await Promise.all([
    readContent(context),
    store.get("mail", { type: "json" }),
    valuesForPrefix<Inquiry>(store, "inquiries/"),
    mediaForStore(store),
  ]);
  const checkedContent = validateContent(content);
  const checkedMail = validateStoredMail(mailValue);
  const checkedInquiries = inquiries
    .map(validateInquiry)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  return {
    manifest: {
      schema: BACKUP_SCHEMA,
      version: BACKUP_VERSION,
      createdAt: new Date().toISOString(),
      site: "sixteenoaks",
      environment:
        context.deploy.context === "production" ? "production" : "preview",
      files: {
        content: "content.json",
        mail: "mail.json",
        inquiries: "inquiries.json",
      },
      counts: {
        projects: checkedContent.projects.length,
        inquiries: checkedInquiries.length,
        media: media.length,
      },
      media,
    },
    content: checkedContent,
    mail: checkedMail,
    inquiries: checkedInquiries,
  };
}

export async function backupMedia(store: Store, id: string) {
  if (!UUID.test(id)) throw new ValidationError("Invalid image address.");
  const image = await store.getWithMetadata(`media/${id}`, {
    type: "arrayBuffer",
  });
  if (!image) throw new ValidationError("Backup image not found.");
  const bytes = new Uint8Array(image.data);
  const contentType = String(image.metadata.contentType) as ContentType;
  if (!(contentType in CONTENT_TYPES) || imageType(bytes) !== contentType)
    throw new ValidationError("Backup image is invalid.");
  return { bytes, contentType };
}

async function workspaceFingerprint(store: Store) {
  const entries: { key: string; etag: string }[] = [];
  for (const key of ["content", "mail"]) {
    const item = await store.getMetadata(key);
    entries.push({ key, etag: item?.etag ?? "missing" });
  }
  for (const prefix of ["inquiries/", "media/"]) {
    const listed = await store.list({ prefix });
    entries.push(
      ...listed.blobs.map((item) => ({ key: item.key, etag: item.etag })),
    );
  }
  entries.sort((a, b) => a.key.localeCompare(b.key));
  return digest(Buffer.from(JSON.stringify(entries)));
}

async function workspaceCounts(store: Store, content: SiteContent) {
  const [inquiries, media] = await Promise.all([
    store.list({ prefix: "inquiries/" }),
    store.list({ prefix: "media/" }),
  ]);
  return {
    projects: content.projects.length,
    inquiries: inquiries.blobs.length,
    media: media.blobs.length,
  };
}

async function removeRestoreSession(store: Store, session: string) {
  const staged = await store.list({
    prefix: `${SESSION_PREFIX}${session}/media/`,
  });
  await Promise.all(staged.blobs.map((item) => store.delete(item.key)));
  await store.delete(`${SESSION_PREFIX}${session}`);
}

async function cleanupExpiredRestoreSessions(store: Store) {
  const entries = await store.list({ prefix: SESSION_PREFIX });
  const roots = entries.blobs.filter((entry) =>
    /^restore-sessions\/[a-f0-9-]{36}$/.test(entry.key),
  );
  for (const entry of roots) {
    const value = (await store.get(entry.key, {
      type: "json",
    })) as RestoreSession | null;
    if (!value || Date.parse(value.expiresAt) <= Date.now())
      await removeRestoreSession(store, entry.key.slice(SESSION_PREFIX.length));
  }
}

export async function previewRestore(
  context: Context,
  owner: string,
  value: unknown,
): Promise<RestorePreview> {
  const backup = validateBackup(value);
  const store = storeFor(context);
  await cleanupExpiredRestoreSessions(store);
  const { content: current, etag } = await readContent(context);
  const session = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_LIFETIME).toISOString();
  const data: RestoreSession = {
    owner: owner.toLowerCase(),
    expiresAt,
    fingerprint: await workspaceFingerprint(store),
    contentEtag: etag,
    backup,
  };
  await store.setJSON(`${SESSION_PREFIX}${session}`, data, {
    onlyIfNew: true,
  });
  return {
    session,
    expiresAt,
    environment:
      context.deploy.context === "production" ? "production" : "preview",
    backupCreatedAt: backup.manifest.createdAt,
    current: await workspaceCounts(store, current),
    incoming: backup.manifest.counts,
    emailConnectionIncluded: !!backup.mail,
  };
}

async function restoreSession(store: Store, session: string, owner: string) {
  if (!UUID.test(session)) throw new ValidationError("Restore session is invalid.");
  const value = (await store.get(`${SESSION_PREFIX}${session}`, {
    type: "json",
  })) as RestoreSession | null;
  if (!value) throw new ValidationError("Restore preview has expired. Choose the backup again.");
  if (value.owner !== owner.toLowerCase())
    throw new ValidationError("Restore preview belongs to another administrator.");
  if (Date.parse(value.expiresAt) <= Date.now()) {
    await removeRestoreSession(store, session);
    throw new ValidationError("Restore preview has expired. Choose the backup again.");
  }
  return value;
}

export async function stageRestoreMedia(
  context: Context,
  owner: string,
  session: string,
  id: string,
  bytes: Uint8Array,
) {
  const store = storeFor(context);
  const restore = await restoreSession(store, session, owner);
  const descriptor = restore.backup.manifest.media.find(
    (item) => item.id === id,
  );
  if (!descriptor) throw new ValidationError("Image is not part of this restore.");
  if (
    bytes.length !== descriptor.size ||
    imageType(bytes) !== descriptor.contentType ||
    digest(bytes) !== descriptor.sha256
  )
    throw new ValidationError("A backup image failed its integrity check.");
  await store.set(`${SESSION_PREFIX}${session}/media/${id}`, bytes, {
    metadata: {
      contentType: descriptor.contentType,
      size: descriptor.size,
      sha256: descriptor.sha256,
    },
  });
}

async function deleteExcept(store: Store, prefix: string, keep: Set<string>) {
  const entries = await store.list({ prefix });
  await Promise.all(
    entries.blobs
      .filter((entry) => !keep.has(entry.key))
      .map((entry) => store.delete(entry.key)),
  );
}

export async function commitRestore(
  context: Context,
  owner: string,
  session: string,
  confirmation: unknown,
) {
  if (confirmation !== "RESTORE")
    throw new ValidationError("Type RESTORE to confirm the recovery.");
  const store = storeFor(context);
  const restore = await restoreSession(store, session, owner);
  if ((await workspaceFingerprint(store)) !== restore.fingerprint)
    throw new RestoreConflict(
      "Saved website data changed after the restore preview. Review the backup again before restoring.",
    );
  for (const descriptor of restore.backup.manifest.media) {
    const staged = await store.getMetadata(
      `${SESSION_PREFIX}${session}/media/${descriptor.id}`,
    );
    if (
      !staged ||
      staged.metadata.contentType !== descriptor.contentType ||
      staged.metadata.size !== descriptor.size ||
      staged.metadata.sha256 !== descriptor.sha256
    )
      throw new ValidationError("Upload every backup image before restoring.");
  }
  for (const descriptor of restore.backup.manifest.media) {
    const staged = await store.get(
      `${SESSION_PREFIX}${session}/media/${descriptor.id}`,
      { type: "arrayBuffer" },
    );
    if (!staged) throw new ValidationError("A staged backup image is missing.");
    await store.set(`media/${descriptor.id}`, staged, {
      metadata: { contentType: descriptor.contentType },
    });
  }
  const contentResult = await store.setJSON(
    "content",
    restore.backup.content,
    restore.contentEtag === "seed"
      ? { onlyIfNew: true }
      : { onlyIfMatch: restore.contentEtag },
  );
  if (!contentResult.modified)
    throw new RestoreConflict(
      "Saved website content changed during recovery. Review the backup again.",
    );
  if (restore.backup.mail)
    await store.setJSON("mail", restore.backup.mail);
  else await store.delete("mail");
  for (const inquiry of restore.backup.inquiries)
    await store.setJSON(`inquiries/${inquiry.id}`, inquiry);
  await deleteExcept(
    store,
    "media/",
    new Set(restore.backup.manifest.media.map((item) => `media/${item.id}`)),
  );
  await deleteExcept(
    store,
    "inquiries/",
    new Set(restore.backup.inquiries.map((item) => `inquiries/${item.id}`)),
  );
  await removeRestoreSession(store, session);
  return {
    content: restore.backup.content,
    etag: contentResult.etag,
    restored: restore.backup.manifest.counts,
  };
}
