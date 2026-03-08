import { getAllBlogPosts } from "@/lib/blogData";
import BlogPageClient from "./BlogPageClient";

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata = {
  title: "Blog & Insights — NexCraft Technologies",
  description: "Expert articles on web development, AI, SEO, design trends, and digital growth strategies for Indian businesses.",
  openGraph: {
    title: "Blog & Insights — NexCraft Technologies",
    description: "Expert articles on web development, AI, SEO, and business growth.",
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  return <BlogPageClient posts={posts} />;
}
