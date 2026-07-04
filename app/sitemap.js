import { getAllPortfolioSlugs } from "@/lib/portfolioData";
import { getAllBlogSlugs } from "@/lib/blogData";
import { getAllProductSlugs } from "@/lib/productsData";

const BASE_URL = "https://nexcrafttech.com";

export default function sitemap() {
  const portfolioSlugs = getAllPortfolioSlugs();
  const blogSlugs = getAllBlogSlugs();
  const productSlugs = getAllProductSlugs();

  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/team`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/sitemap-page`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    // WhatsApp CRM — public landing pages
    { url: `${BASE_URL}/products/whatsappcrm`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/whatsapp-crm/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE_URL}/whatsapp-crm/register`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE_URL}/whatsapp-crm/docs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/whatsapp-crm/support`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.65 },
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

  const productPages = productSlugs.map((slug) => ({
    url: `${BASE_URL}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...productPages, ...portfolioPages, ...blogPages];
}
