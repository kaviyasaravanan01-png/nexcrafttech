import SitemapClient from "./SitemapClient";

export const metadata = {
  title: "Sitemap — NexCraft Technologies",
  description: "Browse the complete sitemap of NexCraft Technologies. Navigate to all pages, blog posts, portfolio projects, and services.",
  alternates: { canonical: "https://nexcrafttech.com/sitemap-page" },
  robots: { index: true, follow: true },
};

export default function SitemapPage() {
  return <SitemapClient />;
}
