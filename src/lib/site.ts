export const siteName = "bunediyola";
export const siteDescription =
  "Gundemden mizaha, teknolojiden yasama kadar kolay gezilen, sade ve modern icerik platformu.";

export function getSiteUrl() {
  const rawUrl =
    process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

  return rawUrl.replace(/\/$/, "");
}

export function getAbsoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${getSiteUrl()}${normalizedPath}`;
}

export function getAbsoluteImageUrl(imagePath: string | null | undefined) {
  if (!imagePath) {
    return getAbsoluteUrl("/images/posts/gundem-gunluk.svg");
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  return getAbsoluteUrl(imagePath);
}
