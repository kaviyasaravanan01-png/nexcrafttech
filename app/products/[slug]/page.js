import { getProductBySlug, getAllProductSlugs } from "@/lib/productsData";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

const SITE_URL = "https://nexcrafttech.com";

/** Google VideoObject requires ISO 8601 with timezone (e.g. 2026-07-05T00:00:00+00:00). */
function formatUploadDate(date) {
  if (!date) return undefined;
  if (/T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2}|Z)/.test(date)) return date;
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return `${date}T00:00:00+00:00`;
  return date;
}

export async function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  const metaDescription = product.shortDescription || product.tagline;
  const pageUrl = `${SITE_URL}/products/${slug}`;
  const videoContentUrl = product.video ? `${SITE_URL}${product.video}` : null;

  return {
    title: `${product.name} — ${product.subtitle}`,
    description: metaDescription,
    keywords: product.seoKeywords,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${product.name} — ${product.subtitle}`,
      description: product.ogDescription || product.tagline,
      url: pageUrl,
      type: "website",
      siteName: "NexCraft Technologies",
      images: [{
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${product.name} — ${product.subtitle}`,
      }],
      ...(videoContentUrl && {
        videos: [{
          url: videoContentUrl,
          type: "video/mp4",
          alt: product.videoMeta?.title ?? `${product.name} demo video`,
        }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — ${product.subtitle}`,
      description: product.ogDescription || product.tagline,
      images: ["/twitter-image"],
    },
  };
}

function buildProductSchema(product, slug, pageUrl) {
  const appUrl = product.url?.startsWith("http")
    ? product.url
    : `${SITE_URL}${product.url || `/products/${slug}`}`;

  return {
    "@type": "SoftwareApplication",
    "@id": `${pageUrl}#software`,
    name: product.name,
    description: product.tagline,
    url: appUrl,
    applicationCategory: slug === "whatsappcrm" ? "BusinessApplication" : "DeveloperApplication",
    operatingSystem: "Web, iOS, Android",
    offers: product.pricing.map((tier) => ({
      "@type": "Offer",
      name: tier.plan,
      price: tier.price.replace(/[^0-9.]/g, "") || "0",
      priceCurrency: "USD",
      description: tier.highlights,
    })),
    featureList: product.features.map((f) => f.name),
    creator: {
      "@type": "Organization",
      name: "NexCraft Technologies",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    ...(product.video && product.videoMeta && {
      video: { "@id": `${pageUrl}#demo-video` },
    }),
  };
}

function buildVideoSchema(product, slug, pageUrl) {
  if (!product.video || !product.videoMeta) return null;

  const { videoMeta } = product;

  return {
    "@type": "VideoObject",
    "@id": `${pageUrl}#demo-video`,
    name: videoMeta.title,
    description: videoMeta.description,
    thumbnailUrl: `${SITE_URL}${videoMeta.thumbnailUrl || "/opengraph-image"}`,
    uploadDate: formatUploadDate(videoMeta.uploadDate),
    contentUrl: `${SITE_URL}${product.video}`,
    embedUrl: pageUrl,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "NexCraft Technologies",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/nct-logo.svg`,
      },
    },
    isPartOf: {
      "@type": "WebPage",
      "@id": pageUrl,
      name: `${product.name} — ${product.subtitle}`,
    },
    about: {
      "@type": "SoftwareApplication",
      "@id": `${pageUrl}#software`,
      name: product.name,
      url: product.url,
    },
  };
}

function buildStructuredData(product, slug) {
  const pageUrl = `${SITE_URL}/products/${slug}`;
  const graph = [buildProductSchema(product, slug, pageUrl)];
  const videoSchema = buildVideoSchema(product, slug, pageUrl);
  if (videoSchema) graph.push(videoSchema);

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const structuredData = buildStructuredData(product, slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ProductDetailClient product={product} slug={slug} />
    </>
  );
}
