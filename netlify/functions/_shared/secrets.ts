import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";
export function secretKeyValue() {
  // Preserve the key already created in Netlify with mixed capitalization.
  // The documented uppercase name takes precedence when explicitly configured.
  return (
    Netlify.env.get("SIXTEEN_OAKS_SECRET_KEY") ??
    Netlify.env.get("Sixteen_Oaks_Secret_Key")
  );
}
export function secretKey() {
  const value = secretKeyValue();
  if (!value) throw new Error("Server setup is incomplete.");
  const key = Buffer.from(value, "base64");
  if (key.length !== 32) throw new Error("Invalid server key.");
  return key;
}
export function seal(value: string, key = secretKey()) {
  const iv = randomBytes(12),
    cipher = createCipheriv("aes-256-gcm", key, iv);
  const data = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), data]
    .map((b) => b.toString("base64url"))
    .join(".");
}
export function unseal(value: string, key = secretKey()) {
  const [iv, tag, data] = value
    .split(".")
    .map((s) => Buffer.from(s, "base64url"));
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString(
    "utf8",
  );
}
export function formToken(key = secretKey(), now = Date.now()) {
  const payload = `${now}.${randomUUID()}`;
  return `${payload}.${createHmac("sha256", key).update(payload).digest("base64url")}`;
}
export function verifyFormToken(
  token: string,
  key = secretKey(),
  now = Date.now(),
) {
  const parts = token.split(".");
  if (
    parts.length !== 3 ||
    !/^\d{13}$/.test(parts[0]) ||
    !/^[a-f0-9-]{36}$/.test(parts[1])
  )
    return null;
  const age = now - Number(parts[0]);
  if (age < 1500 || age > 7200000) return null;
  const expected = createHmac("sha256", key)
    .update(parts.slice(0, 2).join("."))
    .digest();
  const supplied = Buffer.from(parts[2], "base64url");
  return supplied.length === expected.length &&
    timingSafeEqual(supplied, expected)
    ? parts[1]
    : null;
}
