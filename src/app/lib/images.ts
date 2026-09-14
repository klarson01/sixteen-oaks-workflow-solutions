// Optimize only this site's public images. Stored/admin URLs remain unchanged.
export function imageSrcSet(src: string, sourceWidth: number, quality = 82) {
  const localAsset = /^\/assets\/[a-z0-9_./-]+\.(?:png|jpe?g|webp)$/i.test(src);
  const uploadedImage = /^\/api\/media\/[a-f0-9-]{36}$/i.test(src);
  if (
    (!localAsset && !uploadedImage) ||
    src.includes("..") ||
    !Number.isFinite(sourceWidth) ||
    sourceWidth < 1
  ) return undefined;

  const maximum = Math.min(Math.round(sourceWidth), 2048);
  const widths = [...new Set(
    [320, 480, 640, 768, 960, 1280, 1536, 1920, maximum]
      .filter((width) => width <= maximum),
  )].sort((a, b) => a - b);
  return widths.map((width) =>
    "/.netlify/images?url=" + encodeURIComponent(src) +
    "&w=" + width + "&fm=webp&q=" + quality + " " + width + "w",
  ).join(", ");
}
