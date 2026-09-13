import { randomBytes } from "node:crypto";
import type { Context } from "@netlify/functions";
import { storeFor } from "./store";
// A private per-workspace signing key lets forms work before SMTP is configured.
// This key is only for anti-spam tokens; it never encrypts email credentials.
export async function formKey(context: Context) {
  const store = storeFor(context);
  const existing = await store.get("form-signing-key", { type: "text" });
  if (existing) return Buffer.from(existing, "base64");
  const key = randomBytes(32).toString("base64");
  const result = await store.set("form-signing-key", key, { onlyIfNew: true });
  if (result.modified) return Buffer.from(key, "base64");
  const stored = await store.get("form-signing-key", { type: "text" });
  if (!stored) throw new Error("Form setup failed.");
  return Buffer.from(stored, "base64");
}
