import { getAllBlogPosts } from "@/lib/blogData";
import BlogPageClient from "./BlogPageClient";

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata = {
  title: "Blog & Insights — Web Development, AI & SEO Articles",
  description: "Expert articles on web development, AI chatbots, SEO strategies, CamToCode, design trends, and digital growth for businesses in India and worldwide.",
  keywords: [
    "web development blog",
    "AI automation",
    "SEO strategies",
    "CamToCode",
    "developer tools",
    "NexCraft blog",
  ],
  alternates: { canonical: "https://nexcrafttech.com/blog" },
  openGraph: {
    title: "Blog & Insights — NexCraft Technologies",
    description: "Expert articles on web development, AI, SEO, CamToCode, and business growth strategies.",
    url: "https://nexcrafttech.com/blog",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "NexCraft Technologies Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog & Insights — NexCraft Technologies",
    description: "Web development, AI, SEO, and product insights from NexCraft Technologies.",
    images: ["/twitter-image"],
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  return <BlogPageClient posts={posts} />;
}
