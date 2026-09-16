import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/functions";
import type { SiteContent } from "../../../src/content/model";
import { validateContent } from "../../../src/content/validation";
import type { StoredMail } from "./mail";
import { unseal } from "./secrets";

// One-time launch of Kevin's reviewed workspace, within this Netlify site only.
// This is not ongoing synchronization between preview and production.
const SITE_ID = "099715b6-036a-40b7-b269-22768604f938";
const PREVIEW_STORE = "sixteen-oaks-preview-6aa56e2f692ceb00088cc1fc";
const SNAPSHOT = "launch-2026-09-16/snapshot";
const COMPLETE = "launch-2026-09-16/complete";
type Store = ReturnType<typeof getStore>;
interface LaunchSnapshot {
  content: SiteContent;
  mail: StoredMail | null;
  sourceEtag: string;
}

export async function copyLaunchWorkspace(source: Store, live: Store) {
  if (await live.get(COMPLETE, { type: "json" })) return;
  // Never replace a workspace that has already been edited in production.
  if (await live.getWithMetadata("content", { type: "json" })) return;

  let snapshot = (await live.get(SNAPSHOT, { type: "json" })) as LaunchSnapshot | null;
  if (!snapshot) {
    const saved = await source.getWithMetadata("content", { type: "json" });
    if (!saved) throw new Error("The reviewed launch content is unavailable.");
    const content = validateContent(saved.data);
    const mail = (await source.get("mail", { type: "json" })) as StoredMail | null;
    // Check the production key without returning or logging the password.
    if (mail?.encryptedPassword) unseal(mail.encryptedPassword);
    await live.setJSON(SNAPSHOT, { content, mail, sourceEtag: saved.etag }, { onlyIfNew: true });
    // Concurrent cold starts use the same frozen snapshot.
    snapshot = (await live.get(SNAPSHOT, { type: "json" })) as LaunchSnapshot;
  }
  if (snapshot.mail?.encryptedPassword) unseal(snapshot.mail.encryptedPassword);
  const content = validateContent(snapshot.content);
  const images = content.projects.flatMap((project) => [project.cover, ...project.gallery]);
  if (content.homepage) images.push(content.homepage.heroImage, content.homepage.communityImage, content.homepage.closingImage);
  const keys = [...new Set(images.map((image) => image.src)
    .filter((src) => /^\/api\/media\/[a-f0-9-]{36}$/.test(src))
    .map((src) => src.replace("/api/", "")))];

  for (let offset = 0; offset < keys.length; offset += 4) {
    await Promise.all(keys.slice(offset, offset + 4).map(async (key) => {
      const image = await source.getWithMetadata(key, { type: "arrayBuffer" });
      if (!image || !["image/png", "image/jpeg", "image/webp"].includes(String(image.metadata.contentType)))
        throw new Error("A referenced launch image is unavailable.");
      const result = await live.set(key, image.data, { metadata: image.metadata, onlyIfNew: true });
      if (!result.modified) {
        const existing = await live.getWithMetadata(key, { type: "arrayBuffer" });
        if (!existing || existing.metadata.contentType !== image.metadata.contentType ||
          !Buffer.from(existing.data).equals(Buffer.from(image.data)))
          throw new Error("A production image conflicts with the launch snapshot.");
      }
    }));
  }
  // Keep credentials encrypted, and preserve any existing production mail settings.
  if (snapshot.mail) await live.setJSON("mail", snapshot.mail, { onlyIfNew: true });
  // Publish content only after all of its images and email settings are available.
  const result = await live.setJSON("content", content, { onlyIfNew: true });
  await live.setJSON(COMPLETE, {
    completedAt: new Date().toISOString(),
    sourceEtag: snapshot.sourceEtag,
    contentCopied: result.modified,
    projectCount: content.projects.length,
    imageCount: keys.length,
  }, { onlyIfNew: true });
  // Inquiries, request limits, AI counters, and form-signing keys are never copied.
}

let initialization: Promise<void> | undefined;
export async function ensureProductionLaunch(context: Context) {
  if (context.deploy.context !== "production" || context.site.id !== SITE_ID) return;
  initialization ??= copyLaunchWorkspace(
    getStore({ name: PREVIEW_STORE, consistency: "strong" }),
    getStore({ name: "sixteen-oaks-live", consistency: "strong" }),
  ).catch((error) => {
    initialization = undefined; // A failed or interrupted copy can safely resume.
    throw error;
  });
  await initialization;
}
