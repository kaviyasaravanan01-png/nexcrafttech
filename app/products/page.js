import { getAllProducts } from "@/lib/productsData";
import ProductsPageClient from "./ProductsPageClient";

export const metadata = {
  title: "Our Products — SaaS Tools",
  description:
    "Explore SaaS products built by NexCraft Technologies — VantaHire, AI Call Assistant, CamToCode, WhatsApp CRM, PDF AI, and more.",
  keywords: [
    "NexCraft products",
    "VantaHire",
    "AI job search",
    "LinkedIn auto apply",
    "Naukri auto apply",
    "AI Call Assistant",
    "AI receptionist",
    "CamToCode",
    "WhatsApp CRM",
    "PDF AI",
    "PDF tools",
    "merge PDF",
    "PDF to Word",
    "WhatsApp bulk messenger",
    "bulk WhatsApp sender India",
    "camera to code",
    "AI OCR scanner",
    "developer tools SaaS",
    "scan code from phone",
    "scroll automation",
    "voice AI receptionist",
  ],
  alternates: { canonical: "https://nexcrafttech.com/products" },
  openGraph: {
    title: "Our Products — SaaS Tools by NexCraft",
    description:
      "SaaS products built by NexCraft — VantaHire, AI Call Assistant, CamToCode, WhatsApp CRM, PDF AI, and more.",
    url: "https://nexcrafttech.com/products",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "NexCraft Technologies Products" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Products — NexCraft Technologies",
    description: "Explore VantaHire, AI Call Assistant, CamToCode, and other SaaS tools built by NexCraft Technologies.",
    images: ["/twitter-image"],
  },
};

export default function ProductsPage() {
  const products = getAllProducts();

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "NexCraft Technologies Products",
    description: "SaaS products built by NexCraft Technologies",
    url: "https://nexcrafttech.com/products",
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: product.name,
        description: product.tagline,
        url: `https://nexcrafttech.com/products/${product.slug}`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <ProductsPageClient products={products} />
    </>
  );
}
