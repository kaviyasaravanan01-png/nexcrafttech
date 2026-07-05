import { getAllPortfolioSlugs } from "@/lib/portfolioData";
import { getAllBlogSlugs } from "@/lib/blogData";
import { getAllProductSlugs } from "@/lib/productsData";

export const SITE_URL = "https://nexcrafttech.com";

/** All indexable public URLs for sitemap.xml and Search Console. */
export function getAllPublicUrls() {
  const paths = [
    "/",
    "/products",
    "/blog",
    "/team",
    "/terms",
    "/privacy",
    "/sitemap-page",
    "/whatsapp-crm/login",
    "/whatsapp-crm/register",
    "/whatsapp-crm/docs",
    "/whatsapp-crm/support",
    ...getAllProductSlugs().map((slug) => `/products/${slug}`),
    ...getAllPortfolioSlugs().map((slug) => `/portfolio/${slug}`),
    ...getAllBlogSlugs().map((slug) => `/blog/${slug}`),
  ];

  const seen = new Set();
  return paths
    .map((path) => (path === "/" ? SITE_URL : `${SITE_URL}${path}`))
    .filter((url) => {
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    });
}
