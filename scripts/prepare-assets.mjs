import { copyFile, mkdir } from "node:fs/promises";

// Preserve the earlier site's public logo URL alongside the approved new logo.
await mkdir("public", { recursive: true });
await copyFile("src/logo-icon.png", "public/logo-icon.png");
