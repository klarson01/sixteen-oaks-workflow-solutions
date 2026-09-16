import assert from "node:assert/strict";
import { readFile, mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { renderDocument } from "../scripts/render-document.mjs";
const { render } = await import("../.build/tests/src/entry-server.js");
const { searchPaths, sitemapXml, SITE_ORIGIN } = await import("../.build/tests/src/content/search.js");
const { default: search } = await import("../.build/tests/netlify/functions/search.js");
const { default: site } = await import("../.build/tests/netlify/functions/site.js");
const { storeFor } = await import("../.build/tests/netlify/functions/_shared/store.js");
const content = JSON.parse(await readFile("src/content/seed.json", "utf8"));
const template = await readFile("index.html", "utf8");
content.settings.notificationEmail = "private-notifications@example.test";
content.projects.push({ ...structuredClone(content.projects[0]), id: "private", slug: "private-project", title: "PRIVATE DRAFT", status: "draft" });
content.projects[0].title = 'A & B </script><script>alert("x")</script>';
const path = "/work/" + content.projects[0].slug + "/";
const page = render(path, content);
const html = renderDocument(template, page);
assert.equal(page.canonicalUrl, SITE_ORIGIN + path);
const schemaText = html.match(/<script type="application\/ld\+json" data-site-schema="">([\s\S]*?)<\/script>/)[1];
const schema = JSON.parse(schemaText);
assert.ok(!schemaText.includes("<"), "Saved text cannot break out of the JSON-LD element");
assert.ok(!schemaText.includes(content.settings.notificationEmail), "Private notification settings are never serialized");
assert.ok(!schemaText.includes("PRIVATE DRAFT"));
assert.equal(schema["@graph"].find(node => node["@type"] === "WebPage").name, page.title);
assert.equal(schema["@graph"].find(node => node["@type"] === "Organization").email, content.settings.publicEmail);
assert.match(html, /<meta name="robots" content="index, follow">/);
assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1);
assert.match(renderDocument(template, page, { noIndex: true }), /content="noindex, nofollow"/);
for (const missing of ["/work/private-project/", "/work/does-not-exist/", "/unknown/"]) {
  const missingPage = render(missing, content);
  const missingHtml = renderDocument(template, missingPage);
  assert.equal(missingPage.notFound, true);
  assert.match(missingHtml, /content="noindex, nofollow"/);
  assert.ok(!missingHtml.includes('rel="canonical"') && !missingHtml.includes('data-site-schema'));
}
const context = { deploy: { context: "production", id: "search-test" }, site: { id: "search-fixture" } };
const store = storeFor(context);
await store.setJSON("content", content);
const request = (path, method = "GET") => new Request(SITE_ORIGIN + path, { method });
let response = await search(request("/sitemap.xml"), context);
assert.equal(response.status, 200);
assert.match(response.headers.get("Content-Type"), /application\/xml/);
const xml = await response.text();
assert.equal(xml, sitemapXml(searchPaths(content)));
assert.ok(xml.includes(SITE_ORIGIN + path));
for (const forbidden of ["private-project", "/admin", "private-notifications", "netlify.app", "<lastmod>"])
  assert.ok(!xml.includes(forbidden));
// Publication changes are reflected on the next request, with no rebuild or stale seed list.
content.projects[1].status = "published";
await store.setJSON("content", content);
assert.ok((await (await search(request("/sitemap.xml"), context)).text()).includes("/work/private-project/"));
content.projects[1].status = "draft";
await store.setJSON("content", content);
assert.ok(!(await (await search(request("/sitemap.xml"), context)).text()).includes("/work/private-project/"));
const robots = await (await search(request("/robots.txt"), context)).text();
assert.ok(robots.includes("Sitemap: " + SITE_ORIGIN + "/sitemap.xml"));
assert.ok(!robots.includes("Disallow: /admin") && !robots.includes("Disallow: /api/\n"), "Allow admin noindex discovery and public uploaded images");
const preview = { ...context, deploy: { context: "deploy-preview", id: "preview-search" } };
for (const path of ["/robots.txt", "/sitemap.xml"]) {
  response = await search(request(path), preview);
  assert.equal(response.headers.get("X-Robots-Tag"), "noindex, nofollow");
  const body = await response.text();
  assert.ok(path === "/robots.txt" ? body.includes("Disallow: /\n") : !body.includes("<loc>"));
  assert.equal(await (await search(request(path, "HEAD"), context)).text(), "");
}
response = await site(new Request("https://sixteenoaks.netlify.app/work/?source=test"), context);
assert.equal(response.status, 301);
assert.equal(response.headers.get("Location"), SITE_ORIGIN + "/work/?source=test");
assert.equal((await search(request("/sitemap.xml", "POST"), context)).status, 405);
assert.equal((await site(request("/", "POST"), context)).status, 405);
// Run before npm build in CI without depending on, or modifying, a real build shell.
const runtimeFixture = await mkdtemp(join(tmpdir(), "sixteen-oaks-search-"));
await mkdir(join(runtimeFixture, ".build"));
await writeFile(join(runtimeFixture, ".build/template.html"), template);
const previousDirectory = process.cwd();
try {
  process.chdir(runtimeFixture);
  response = await site(new Request("https://deploy-preview-6--sixteenoaks.netlify.app/"), preview);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("X-Robots-Tag"), "noindex, nofollow");
  assert.ok((await response.text()).includes('rel="canonical" href="' + SITE_ORIGIN + '/"'));
  response = await site(request("/work/private-project/"), context);
  assert.equal(response.status, 404);
  assert.equal(response.headers.get("X-Robots-Tag"), "noindex, nofollow");
  response = await site(request("/", "HEAD"), context);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("X-Robots-Tag"), null);
  assert.equal(await response.text(), "");
} finally {
  process.chdir(previousDirectory);
  await rm(runtimeFixture, { recursive: true });
}
console.log("Passed: canonical URLs, safe public-only business schema, live sitemap publication changes, draft exclusion, preview noindex, robots image access, alias redirects, and HEAD responses.");
