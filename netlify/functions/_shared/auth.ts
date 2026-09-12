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
// Netlify's Identity context can contain only verified JWT claims, without
// confirmed_at. Read the actual user session from Identity before denying access.
export async function confirmedSession(request: Request) {
  const user = await getUser();
  if (user?.confirmedAt) return user;
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith("nf_jwt="));
  if (!cookie) return user;
  let token: string;
  try {
    token = decodeURIComponent(cookie.slice("nf_jwt=".length));
  } catch {
    return null;
  }
  if (!token || token.length > 12000) return null;
  const response = await fetch(
    new URL("/.netlify/identity/user", request.url),
    {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(8000),
      redirect: "error",
    },
  );
  if (response.status === 401 || response.status === 403) return null;
  if (!response.ok)
    throw new Response(
      "Sign-in could not be verified. Please try again shortly.",
      { status: 503 },
    );
  const identity = await response.json();
  if (typeof identity.id !== "string" || typeof identity.email !== "string")
    return null;
  return {
    id: identity.id,
    email: identity.email,
    confirmedAt:
      typeof identity.confirmed_at === "string"
        ? identity.confirmed_at
        : undefined,
  } as User;
}
export async function requireAdmin(request: Request) {
  if (!["GET", "HEAD"].includes(request.method)) {
    try {
      verifyRequestOrigin(request);
    } catch {
      throw new Response("Request origin not allowed.", { status: 403 });
    }
  }
  const user = await confirmedSession(request);
  if (!user) throw new Response("Please sign in.", { status: 401 });
  if (!user.confirmedAt)
    throw new Response(
      "Your email address has not been confirmed. Finish your invitation or password reset first.",
      { status: 403 },
    );
  if (
    !canAdmin(
      user,
      Netlify.env.get("SIXTEEN_OAKS_ADMIN_EMAILS") ??
        "kevin.larson@sixteenoaksllc.com",
    )
  )
    throw new Response(
      `You are signed in as ${user.email}. This email is not on the website admin list. A Netlify role is not required.`,
      {
        status: 403,
      },
    );
  return user;
}
