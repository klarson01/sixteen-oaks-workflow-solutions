import type { Context, Config } from "@netlify/functions";
import { storeFor } from "./_shared/store";
export default async function (_request: Request, context: Context) {
  const id = context.params.id;
  if (!/^[a-f0-9-]{36}$/.test(id))
    return new Response("Not found", { status: 404 });
  const result = await storeFor(context).getWithMetadata(`media/${id}`, {
    type: "arrayBuffer",
  });
  if (!result) return new Response("Not found", { status: 404 });
  return new Response(result.data, {
    headers: {
      "Content-Type": String(result.metadata.contentType),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
export const config: Config = { path: "/api/media/:id", method: ["GET"] };
