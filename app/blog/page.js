import { getAllBlogPosts } from "@/lib/blogData";
import BlogPageClient from "./BlogPageClient";

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata = {
  title: "Blog & Insights — Web Development, AI & SEO Articles",
  description: "Expert articles on web development, AI chatbots, SEO strategies, design trends, and digital growth strategies for businesses in India and worldwide.",
  alternates: { canonical: "https://nexcrafttech.com/blog" },
  openGraph: {
    title: "Blog & Insights — NexCraft Technologies",
    description: "Expert articles on web development, AI, SEO, and business growth strategies.",
    url: "https://nexcrafttech.com/blog",
    type: "website",
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  return <BlogPageClient posts={posts} />;
}
