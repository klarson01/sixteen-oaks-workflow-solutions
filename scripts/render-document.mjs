export function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function renderDocument(template, page) {
  if (!template.includes("<!--app-html-->"))
    throw new Error("Missing app-html marker in HTML template.");
  return template
    .replace("<!--app-html-->", () => page.html)
    .replace(
      /<title>[\s\S]*?<\/title>/,
      () => "<title>" + escapeHtml(page.title) + "</title>",
    )
    .replace(
      /<meta\b(?=[^>]*\bname="description")[^>]*>/,
      () =>
        '<meta name="description" content="' +
        escapeHtml(page.description) +
        '">',
    )
    .replace(
      /<meta\b(?=[^>]*\bproperty="og:title")[^>]*>/,
      () =>
        '<meta property="og:title" content="' + escapeHtml(page.title) + '">',
    )
    .replace(
      /<meta\b(?=[^>]*\bproperty="og:description")[^>]*>/,
      () =>
        '<meta property="og:description" content="' +
        escapeHtml(page.description) +
        '">',
    );
}
