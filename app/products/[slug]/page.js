import { getProductBySlug, getAllProductSlugs } from "@/lib/productsData";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

export async function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} — ${product.subtitle} | NexCraft Technologies`,
    description: product.tagline,
    keywords: product.seoKeywords,
    alternates: { canonical: `https://nexcrafttech.com/products/${slug}` },
    openGraph: {
      title: `${product.name} — NexCraft Product`,
      description: product.tagline,
      url: `https://nexcrafttech.com/products/${slug}`,
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  return <ProductDetailClient product={product} slug={slug} />;
}
