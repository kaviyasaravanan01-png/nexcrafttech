import { getPortfolioBySlug, getAllPortfolioSlugs } from "@/lib/portfolioData";
import { notFound } from "next/navigation";
import PortfolioDetailClient from "./PortfolioDetailClient";

export async function generateStaticParams() {
  return getAllPortfolioSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getPortfolioBySlug(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} — Portfolio | NexCraft Technologies`,
    description: `${project.tagline} Built with ${project.tags?.join(", ") || "modern technologies"}.`,
    alternates: { canonical: `https://nexcrafttech.com/portfolio/${slug}` },
    openGraph: {
      title: `${project.title} — NexCraft Technologies Portfolio`,
      description: project.tagline,
      url: `https://nexcrafttech.com/portfolio/${slug}`,
      type: "article",
    },
  };
}

export default async function PortfolioDetailPage({ params }) {
  const { slug } = await params;
  const project = getPortfolioBySlug(slug);
  if (!project) notFound();
  return <PortfolioDetailClient project={project} slug={slug} />;
}
