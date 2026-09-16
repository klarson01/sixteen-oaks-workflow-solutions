import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { join, extname, resolve } from "node:path";

const output = resolve("dist");
const routes = ["/", "/services/", "/work/", "/approach/"];
const documents = new Map();
const decode = (value) =>
  value.replaceAll("&amp;", "&").replaceAll("&quot;", '"');
const fileFor = (pathname) =>
  join(
    output,
    pathname.replace(/^\//, ""),
    pathname.endsWith("/") ? "index.html" : "",
  );

function attributes(text) {
  return Object.fromEntries(
    [...text.matchAll(/([\w:-]+)(?:="([^"]*)")?/g)].map((match) => [
      match[1],
      decode(match[2] ?? ""),
    ]),
  );
}
async function loadDocument(file) {
  if (!documents.has(file)) documents.set(file, await readFile(file, "utf8"));
  return documents.get(file);
}
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? walk(join(directory, entry.name))
          : [join(directory, entry.name)],
      ),
    )
  ).flat();
}

const titles = new Set();
for (const route of [...routes, "/work/rays-mobile-repair/", "/404.html"]) {
  const file = fileFor(route);
  const html = await loadDocument(file);
  assert.equal(
    (html.match(/<h1[\s>]/g) ?? []).length,
    1,
    route + ": exactly one heading",
  );
  assert.match(
    html,
    /<main[^>]*id="main"/,
    route + ": complete content without JavaScript",
  );
  assert.ok(!html.includes("<!--app-html-->"), route + ": rendered content");
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert.ok(title && !titles.has(title), route + ": unique page title");
  titles.add(title);
  assert.match(
    html,
    /<meta\s+name="description"\s+content="[^"]+"/,
    route + ": page description",
  );
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  if (route === "/404.html") {
    assert.match(html, /name="robots" content="noindex, nofollow"/);
    assert.ok(!html.includes('rel="canonical"'), "404 has no canonical public page");
  } else {
    assert.ok(html.includes('rel="canonical" href="https://sixteenoaksllc.com' + route + '"'), route + ": business-domain canonical");
    const schema = html.match(/<script type="application\/ld\+json" data-site-schema="">([\s\S]*?)<\/script>/)?.[1];
    assert.ok(schema, route + ": structured data");
    assert.ok(JSON.parse(schema)["@graph"].some(node => node["@type"] === "Organization"));
  }
  assert.equal(ids.length, new Set(ids).size, route + ": unique element IDs");
  for (const match of html.matchAll(/<(?:a|img|script|link)\b([^>]*)>/g)) {
    const attrs = attributes(match[1]);
    if (match[0].startsWith("<img"))
      assert.ok("alt" in attrs, route + ": image alternative");
    if (attrs.target === "_blank")
      assert.ok(
        attrs.rel?.includes("noopener"),
        route + ": safe external link",
      );
    const srcset = attrs.srcset ?? attrs.srcSet;
    if (srcset) {
      for (const candidate of srcset.split(",")) {
        const [address, descriptor] = candidate.trim().split(/\s+/);
        const imageUrl = new URL(address, "https://local.test");
        assert.equal(imageUrl.origin, "https://local.test", route + ": same-site image");
        assert.match(descriptor ?? "", /^[1-9][0-9]*w$/, route + ": image width descriptor");
        let original = imageUrl.pathname;
        if (original === "/.netlify/images") {
          assert.equal(descriptor, imageUrl.searchParams.get("w") + "w", route + ": CDN image width");
          original = imageUrl.searchParams.get("url");
        }
        assert.ok(original?.startsWith("/assets/") && !original.includes(".."), route + ": local source image");
        assert.ok((await stat(fileFor(original))).isFile(), route + ": source image exists");
      }
    }
    const ref = attrs.src ?? attrs.href;
    if (!ref || /^(?:[a-z]+:|\/\/)/i.test(ref)) continue;
    const url = new URL(ref, "https://local.test" + route);
    let target = fileFor(url.pathname);
    const info = await stat(target);
    if (info.isDirectory()) target = join(target, "index.html");
    if (url.hash) {
      const targetHtml = await loadDocument(target);
      assert.ok(
        targetHtml.includes(
          'id="' + decodeURIComponent(url.hash.slice(1)) + '"',
        ),
        route + ": anchor " + ref,
      );
    }
  }
  if (routes.includes(route)) {
    const nav =
      html.match(/<nav class="desktop-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? "";
    assert.equal(
      (nav.match(/aria-current="page"/g) ?? []).length,
      1,
      route + ": active navigation",
    );
    for (const expected of routes)
      assert.ok(
        nav.includes('href="' + expected + '"'),
        route + ": all navigation links",
      );
  }
  console.log("Validated " + route);
}

const cssFiles = (await walk(join(output, "assets"))).filter(
  (file) => extname(file) === ".css",
);
assert.ok(cssFiles.length, "Stylesheet exists");
const styles = (
  await Promise.all(cssFiles.map((file) => readFile(file, "utf8")))
).join("\n");
assert.ok(
  styles.includes("prefers-reduced-motion") &&
    styles.includes("data-motion=off"),
  "System and site motion controls",
);
assert.ok(styles.includes("focus-visible"), "Visible keyboard focus");
for (const match of styles.matchAll(/url\((?:["']?)([^"'()]+)(?:["']?)\)/g)) {
  const asset = match[1];
  if (asset.startsWith("/")) await stat(fileFor(asset));
}

// These are existing public product-update files, not marketing page routes.
const feedRoot = join("public", "orbitdesk");
const feedFiles = await walk(feedRoot);
assert.ok(
  feedFiles.some((file) => file.endsWith("latest.json")),
  "OrbitDesk manifest remains available",
);
for (const file of feedFiles) {
  const built = join("dist", file.slice("public/".length));
  assert.deepEqual(
    await readFile(built),
    await readFile(file),
    built + ": unchanged during build",
  );
}
console.log(
  "Validated styles, local assets, navigation, and OrbitDesk update files.",
);
