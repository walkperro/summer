import type { MetadataRoute } from "next";

function siteBase() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
  try {
    return new URL(raw).origin;
  } catch {
    try {
      return new URL(`https://${raw}`).origin;
    } catch {
      return "http://localhost:3000";
    }
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteBase();
  const now = new Date();
  const paths = ["/", "/classes", "/plans", "/about", "/legal/terms", "/legal/privacy"];
  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/classes" || path === "/plans" ? 0.9 : 0.7,
  }));
}
