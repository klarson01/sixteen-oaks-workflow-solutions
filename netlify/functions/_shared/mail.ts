import nodemailer from "nodemailer";
import { lookup } from "node:dns/promises";
import type { Context } from "@netlify/functions";
import type { MailSettings, Inquiry } from "../../../src/content/model";
import { storeFor } from "./store";
import { unseal } from "./secrets";
export interface StoredMail extends Omit<MailSettings, "password"> {
  encryptedPassword: string;
}
export function publicAddress(address: string) {
  if (address.includes(":"))
    return (
      /^[23][0-9a-f]{3}:/i.test(address) && !/^2001:(?:db8|0):/i.test(address)
    );
  const p = address.split(".").map(Number);
  return (
    p.length === 4 &&
    p.every((n) => Number.isInteger(n) && n >= 0 && n <= 255) &&
    ![0, 10, 127, 169, 224, 255].includes(p[0]) &&
    p[0] < 224 &&
    !(p[0] === 172 && p[1] >= 16 && p[1] <= 31) &&
    !(p[0] === 192 && p[1] === 168) &&
    !(p[0] === 100 && p[1] >= 64 && p[1] <= 127) &&
    !(p[0] === 198 && (p[1] === 18 || p[1] === 19))
  );
}
export async function deliver(
  context: Context,
  to: string,
  inquiry: Pick<
    Inquiry,
    "name" | "email" | "phone" | "business" | "service" | "message" | "page"
  >,
) {
  const config = await storeFor(context).get("mail", { type: "json" });
  if (!config?.enabled || !config.encryptedPassword)
    return "not-configured" as const;
  const addresses = await lookup(config.host, { all: true });
  if (!addresses.length || addresses.some((a) => !publicAddress(a.address)))
    throw new Error("Mail server must have a public address.");
  const transport = nodemailer.createTransport({
    host: addresses[0].address,
    port: config.port,
    secure: config.port === 465,
    requireTLS: config.port === 587,
    tls: { servername: config.host, rejectUnauthorized: true },
    auth: { user: config.username, pass: unseal(config.encryptedPassword) },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 12000,
  });
  try {
    await transport.sendMail({
      from: { name: "Sixteen Oaks Website", address: config.from },
      to,
      replyTo: inquiry.email,
      subject: "New Sixteen Oaks website inquiry",
      text: `Name: ${inquiry.name}\nEmail: ${inquiry.email}\nPhone: ${inquiry.phone}\nBusiness: ${inquiry.business}\nInterested in: ${inquiry.service}\nPage: ${inquiry.page}\n\n${inquiry.message}`,
    });
    return "sent" as const;
  } finally {
    transport.close();
  }
}
