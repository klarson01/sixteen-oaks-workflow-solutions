const productionHost = "sixteenoaks.netlify.app";
/** Accept only callback fragments from this Sixteen Oaks site, never arbitrary redirects. */
export function invitationFragment(value: string, currentOrigin: string) {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error(
      "Paste the complete link from your invitation or password reset email.",
    );
  }
  const current = new URL(currentOrigin);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    ![current.host, productionHost].includes(url.host)
  )
    throw new Error(
      "Use the invitation or password reset link for this Sixteen Oaks website.",
    );
  const params = new URLSearchParams(url.hash.slice(1));
  for (const key of ["invite_token", "recovery_token", "confirmation_token"]) {
    const token = params.get(key);
    if (token && token.length <= 4096 && !/\s/.test(token))
      return "#" + new URLSearchParams({ [key]: token }).toString();
  }
  throw new Error(
    "This link does not contain an invitation or recovery token. Use the full link from the email, or request a fresh invitation.",
  );
}
