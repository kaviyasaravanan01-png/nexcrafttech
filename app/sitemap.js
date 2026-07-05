import { getAllPublicUrls, SITE_URL } from "@/lib/siteUrls";

const PRIORITY = {
  [SITE_URL]: 1,
  [`${SITE_URL}/products`]: 0.85,
  [`${SITE_URL}/blog`]: 0.8,
};

function priorityFor(url) {
  if (PRIORITY[url] != null) return PRIORITY[url];
  if (url.includes("/products/")) return 0.8;
  if (url.includes("/whatsapp-crm/")) return 0.7;
  if (url.includes("/portfolio/")) return 0.7;
  if (url.includes("/blog/")) return 0.6;
  return 0.5;
}

function changeFrequencyFor(url) {
  if (url === SITE_URL || url.includes("/products")) return "weekly";
  if (url.includes("/blog/")) return "monthly";
  if (url.includes("/terms") || url.includes("/privacy")) return "yearly";
  return "monthly";
}

export default function sitemap() {
  const now = new Date();

  return getAllPublicUrls().map((url) => ({
    url,
    lastModified: now,
    changeFrequency: changeFrequencyFor(url),
    priority: priorityFor(url),
  }));
}
