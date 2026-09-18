import type { Inquiry, SiteContent } from "./model";

export const BACKUP_SCHEMA = "sixteen-oaks-admin-backup";
export const BACKUP_VERSION = 1;

export interface BackupMail {
  enabled: boolean;
  host: string;
  port: 465 | 587;
  username: string;
  from: string;
  encryptedPassword: string;
}

export interface BackupMedia {
  id: string;
  file: string;
  contentType: "image/jpeg" | "image/png" | "image/webp";
  size: number;
  sha256: string;
}

export interface BackupManifest {
  schema: typeof BACKUP_SCHEMA;
  version: typeof BACKUP_VERSION;
  createdAt: string;
  site: "sixteenoaks";
  environment: "production" | "preview";
  files: {
    content: "content.json";
    mail: "mail.json";
    inquiries: "inquiries.json";
  };
  counts: {
    projects: number;
    inquiries: number;
    media: number;
  };
  media: BackupMedia[];
}

export interface BackupPayload {
  manifest: BackupManifest;
  content: SiteContent;
  mail: BackupMail | null;
  inquiries: Inquiry[];
}

export interface RestorePreview {
  session: string;
  expiresAt: string;
  environment: "production" | "preview";
  backupCreatedAt: string;
  current: BackupManifest["counts"];
  incoming: BackupManifest["counts"];
  emailConnectionIncluded: boolean;
}
