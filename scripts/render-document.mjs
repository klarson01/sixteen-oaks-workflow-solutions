export function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function renderDocument(template, page, { noIndex = false } = {}) {
  if (!template.includes("<!--app-html-->"))
    throw new Error("Missing app-html marker in HTML template.");
  const searchHead = [
    '<meta name="robots" content="' + (noIndex || page.notFound ? "noindex, nofollow" : "index, follow") + '">',
  ];
  if (page.canonicalUrl && !page.notFound) {
    searchHead.push('<link rel="canonical" href="' + escapeHtml(page.canonicalUrl) + '">');
    searchHead.push('<meta property="og:url" content="' + escapeHtml(page.canonicalUrl) + '">');
  }
  if (page.structuredData && !page.notFound) {
    // JSON-LD is data, but a literal closing script tag would end the HTML element.
    const data = JSON.stringify(page.structuredData).replaceAll("<", "\\u003c");
    searchHead.push('<script type="application/ld+json" data-site-schema="">' + data + '</script>');
  }
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
    )
    .replace(
      /<meta\b(?=[^>]*\bname="twitter:title")[^>]*>/,
      () =>
        '<meta name="twitter:title" content="' +
        escapeHtml(page.title) +
        '">',
    )
    .replace(
      /<meta\b(?=[^>]*\bname="twitter:description")[^>]*>/,
      () =>
        '<meta name="twitter:description" content="' +
        escapeHtml(page.description) +
        '">',
    )
    .replace("</head>", () => searchHead.join("\n") + "\n</head>");
}
