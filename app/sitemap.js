import { getAllPortfolioSlugs } from "@/lib/portfolioData";
import { getAllBlogSlugs } from "@/lib/blogData";

const BASE_URL = "https://nexcrafttech.com";

export default function sitemap() {
  const portfolioSlugs = getAllPortfolioSlugs();
  const blogSlugs = getAllBlogSlugs();

  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/sitemap-page`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];

  const portfolioPages = portfolioSlugs.map((slug) => ({
    url: `${BASE_URL}/portfolio/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogPages = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...portfolioPages, ...blogPages];
}
