import { defaultHomepage, homepageFieldGroups, type HomepageContent } from "./homepage";
import type { SiteContent, Project, ProjectImage, MailSettings } from "./model";
export class ValidationError extends Error {}
export const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function text(
  value: unknown,
  label: string,
  max = 500,
  required = false,
): string {
  if (
    typeof value !== "string" ||
    value.length > max ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)
  )
    throw new ValidationError(`${label} is invalid or too long.`);
  const v = value.trim();
  if (required && !v) throw new ValidationError(`${label} is required.`);
  return v;
}
export function email(value: unknown, label = "Email"): string {
  const v = text(value, label, 254, true);
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(v))
    throw new ValidationError(`${label} must be a valid email address.`);
  return v;
}
function obj(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new ValidationError("Invalid content.");
  return value as Record<string, unknown>;
}
function integer(
  value: unknown,
  min: number,
  max: number,
  label: string,
): number {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < min ||
    value > max
  )
    throw new ValidationError(`${label} is invalid.`);
  return value;
}
function image(value: unknown, required: boolean): ProjectImage {
  const v = obj(value);
  const src = text(v.src, "Image", 250, required);
  if (
    (src &&
      !/^\/(?:assets\/[a-zA-Z0-9_./-]+\.(?:jpg|jpeg|png|webp)|api\/media\/[a-f0-9-]{36})$/.test(
        src,
      )) ||
    src.includes("..")
  )
    throw new ValidationError("Upload a JPG, PNG, or WebP image.");
  return {
    src,
    alt: text(v.alt, "Image description", 400, required),
    caption: text(v.caption, "Caption", 500),
    width: integer(v.width, 1, 16000, "Image width"),
    height: integer(v.height, 1, 16000, "Image height"),
  };
}
export function validateHomepage(value: unknown): HomepageContent {
  const h = obj(value);
  const result = structuredClone(defaultHomepage);
  for (const group of homepageFieldGroups) {
    for (const [key, label, limit] of group.fields) result[key] = text(h[key], label, limit, true);
  }
  result.heroImage = image(h.heroImage, true);
  result.communityImage = image(h.communityImage, true);
  result.closingImage = image(h.closingImage, true);
  if (!Array.isArray(h.services) || h.services.length !== 4)
    throw new ValidationError("Keep all four service summaries.");
  result.services = h.services.map((value) => {
    const item = obj(value);
    return { title: text(item.title, "Service title", 50, true), description: text(item.description, "Service description", 180, true) };
  });
  return result;
}
export function validateContent(value: unknown): SiteContent {
  const v = obj(value),
    s = obj(v.settings);
  if (!Array.isArray(v.projects) || v.projects.length > 100)
    throw new ValidationError("Up to 100 projects are supported.");
  const settings = {
    publicEmail: email(s.publicEmail, "Public email"),
    phone: text(s.phone, "Phone", 40, true),
    notificationEmail: email(s.notificationEmail, "Notification email"),
    featuredProjectId: text(s.featuredProjectId, "Featured project", 80),
  };
  if (
    !/^[+\d\s().-]+$/.test(settings.phone) ||
    settings.phone.replace(/\D/g, "").length < 7
  )
    throw new ValidationError("Enter a valid phone number.");
  const projects = v.projects.map((entry): Project => {
    const p = obj(entry);
    if (p.status !== "draft" && p.status !== "published")
      throw new ValidationError("Invalid project status.");
    const published = p.status === "published";
    const id = text(p.id, "Project ID", 80, true),
      slug = text(p.slug, "Project address", 80, true);
    if (
      !SLUG.test(id) ||
      !SLUG.test(slug) ||
      ["new", "admin", "api"].includes(slug)
    )
      throw new ValidationError(
        "Use a unique project address with lowercase letters, numbers, and hyphens.",
      );
    const website = text(p.website, "Website", 500);
    if (website) {
      try {
        const u = new URL(website);
        if (u.protocol !== "https:" || u.username || u.password)
          throw new Error();
      } catch {
        throw new ValidationError("Website links must begin with https://.");
      }
    }
    if (
      !Array.isArray(p.gallery) ||
      p.gallery.length > 6 ||
      !Array.isArray(p.delivered) ||
      p.delivered.length > 20
    )
      throw new ValidationError(
        "Use up to six gallery images and twenty service items.",
      );
    return {
      id,
      slug,
      status: p.status,
      order: integer(p.order, 0, 9999, "Display order"),
      title: text(p.title, "Project name", 120, true),
      tagline: text(p.tagline, "Project introduction", 250, published),
      summary: text(p.summary, "Short description", 600, published),
      business: text(p.business, "Business type", 160, published),
      location: text(p.location, "Location", 160),
      category: text(p.category, "Project type", 120, published),
      website,
      cover: image(p.cover, published),
      gallery: p.gallery.map((i) => image(i, true)),
      needTitle: text(p.needTitle, "Need heading", 160),
      need: text(p.need, "The need", 5000),
      buildTitle: text(p.buildTitle, "Work heading", 160),
      build: text(p.build, "Our work", 5000),
      experienceTitle: text(p.experienceTitle, "Experience heading", 160),
      experience: text(p.experience, "The experience", 5000),
      delivered: p.delivered
        .map((i) => text(i, "Service item", 180))
        .filter(Boolean),
    };
  });
  if (
    new Set(projects.map((p) => p.id)).size !== projects.length ||
    new Set(projects.map((p) => p.slug)).size !== projects.length
  )
    throw new ValidationError("Project names must have unique addresses.");
  if (
    settings.featuredProjectId &&
    !projects.some(
      (p) => p.id === settings.featuredProjectId && p.status === "published",
    )
  )
    throw new ValidationError(
      "Choose a published project for the homepage, or select None.",
    );
  return { settings, projects, ...(v.homepage === undefined ? {} : { homepage: validateHomepage(v.homepage) }) };
}
export function validateMail(value: unknown): MailSettings {
  const s = obj(value);
  if (typeof s.enabled !== "boolean")
    throw new ValidationError("Invalid email setting.");
  const required = s.enabled;
  const host = text(s.host, "Mail server", 253, required);
  if (
    host &&
    (!/^[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?$/.test(host) ||
      !host.includes("."))
  )
    throw new ValidationError("Enter a valid mail server hostname.");
  if (s.port !== 465 && s.port !== 587)
    throw new ValidationError("Use secure mail port 465 or 587.");
  return {
    enabled: s.enabled,
    host,
    port: s.port,
    username: text(s.username, "Mail username", 254, required),
    from: required
      ? email(s.from, "Sender email")
      : text(s.from, "Sender email", 254),
    password: (text(s.password ?? "", "Mail password", 1024),
    s.password ?? "") as string,
  };
}
