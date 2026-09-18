import type { Context, Config } from "@netlify/functions";
import { deleteExpiredAnalytics } from "./_shared/analytics";

export default async function (_request: Request, context: Context) {
  await deleteExpiredAnalytics(context);
};

export const config: Config = {
  schedule: "@daily",
};
