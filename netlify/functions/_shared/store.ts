import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/functions";
import seed from "../../../src/content/seed.json";
import type { SiteContent } from "../../../src/content/model";
export function storeFor(context: Context) {
  const scope =
    context.deploy.context === "production"
      ? "live"
      : context.deploy.context === "deploy-preview"
        ? // Keep the active review workspace: Kevin has started adding real examples.
          // This is a store identifier, not a credential. Never change without migrating data.
          "preview-6aa56e2f692ceb00088cc1fc"
        : `preview-${context.deploy.id}`;
  return getStore({ name: `sixteen-oaks-${scope}`, consistency: "strong" });
}
export async function readContent(context: Context) {
  const result = await storeFor(context).getWithMetadata("content", {
    type: "json",
  });
  return {
    content: (result?.data ?? structuredClone(seed)) as SiteContent,
    etag: result?.etag ?? "seed",
  };
}
export function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
