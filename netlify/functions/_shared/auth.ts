import { getUser, verifyRequestOrigin } from "@netlify/identity";
import type { User } from "@netlify/identity";
export function canAdmin(user: User | null, allowlist: string) {
  if (!user?.confirmedAt) return false;
  const owners = allowlist
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return !!user.email && owners.includes(user.email.toLowerCase());
}
export async function requireAdmin(request: Request) {
  if (!["GET", "HEAD"].includes(request.method)) {
    try {
      verifyRequestOrigin(request);
    } catch {
      throw new Response("Request origin not allowed.", { status: 403 });
    }
  }
  const user = await getUser();
  if (!user) throw new Response("Please sign in.", { status: 401 });
  if (
    !canAdmin(
      user,
      Netlify.env.get("SIXTEEN_OAKS_ADMIN_EMAILS") ??
        "kevin.larson@sixteenoaksllc.com",
    )
  )
    throw new Response("This account does not have administrator access.", {
      status: 403,
    });
  return user;
}
