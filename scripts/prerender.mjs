import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { render, getRenderPaths } from "../.build/server/entry-server.js";
import { renderDocument } from "./render-document.mjs";

const template = await readFile("dist/index.html", "utf8");
await mkdir(".build", {recursive:true});
await writeFile(".build/template.html", template);
for (const route of [...getRenderPaths(), "/404/"]) {
  const destination =
    route === "/404/"
      ? "dist/404.html"
      : join("dist", route.slice(1), "index.html");
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, renderDocument(template, render(route), {
    noIndex: process.env.CONTEXT !== "production",
  }));
  console.log("Rendered " + destination);
}
