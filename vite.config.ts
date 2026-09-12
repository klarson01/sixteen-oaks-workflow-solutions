import { defineConfig, type Plugin } from "vite";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { renderDocument } from "./scripts/render-document.mjs";

const root = fileURLToPath(new URL(".", import.meta.url));

/** Render the same React templates for local development and static builds. */
function renderDevelopmentPages(): Plugin {
  return {
    name: "sixteen-oaks-development-pages",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (
          request.method !== "GET" ||
          !request.headers.accept?.includes("text/html")
        )
          return next();
        const url = new URL(request.url ?? "/", "http://localhost");
        if (path.extname(url.pathname) && url.pathname !== "/index.html")
          return next();
        // Existing OrbitDesk update endpoints belong to public/ and are served as files.
        if (/^\/(?:orbitdesk|admin|api)(?:\/|$)/.test(url.pathname))
          return next();
        try {
          const template = await server.transformIndexHtml(
            url.pathname,
            await readFile(path.join(root, "index.html"), "utf8"),
          );
          const { render } = await server.ssrLoadModule(
            "/src/entry-server.tsx",
          );
          const page = render(
            url.pathname === "/index.html" ? "/" : url.pathname,
          );
          response.statusCode = page.notFound ? 404 : 200;
          response.setHeader("Content-Type", "text/html; charset=utf-8");
          response.end(renderDocument(template, page));
        } catch (error) {
          server.ssrFixStacktrace(error as Error);
          next(error);
        }
      });
    },
  };
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss(), renderDevelopmentPages()],
  resolve: { alias: { "@": path.resolve(root, "src") } },
  assetsInclude: [
    "**/*.svg",
    "**/*.csv",
    "**/*.png",
    "**/*.jpg",
    "**/*.jpeg",
    "**/*.webp",
  ],
  build: {
    copyPublicDir: !isSsrBuild,
    rollupOptions: isSsrBuild
      ? {}
      : {
          input: {
            main: path.join(root, "index.html"),
            admin: path.join(root, "admin/index.html"),
          },
        },
  },
}));
