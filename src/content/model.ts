export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
}
export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  business: string;
  location: string;
  category: string;
  website: string;
  status: "draft" | "published";
  order: number;
  cover: ProjectImage;
  gallery: ProjectImage[];
  needTitle: string;
  need: string;
  buildTitle: string;
  build: string;
  experienceTitle: string;
  experience: string;
  delivered: string[];
}
export interface SiteSettings {
  publicEmail: string;
  phone: string;
  notificationEmail: string;
  featuredProjectId: string;
}
export interface SiteContent {
  settings: SiteSettings;
  projects: Project[];
}
export interface MailSettings {
  host: string;
  port: 465 | 587;
  username: string;
  from: string;
  enabled: boolean;
  password?: string;
}
export interface Inquiry {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  business: string;
  service: string;
  message: string;
  page: string;
  status: "new" | "read" | "archived";
  notification: "sent" | "failed" | "not-configured";
}
export function publishedProjects(content: SiteContent) {
  return content.projects
    .filter((p) => p.status === "published")
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}
export function projectUrl(project: Project) {
  return `/work/${project.slug}/` as const;
}
