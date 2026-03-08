import { getBlogBySlug, getAllBlogSlugs } from "@/lib/blogData";
import { notFound } from "next/navigation";
import BlogPostClient from "./BlogPostClient";

export const revalidate = 3600; // ISR: revalidate every hour

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} — NexCraft Technologies Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) notFound();
  return <BlogPostClient post={post} />;
}
