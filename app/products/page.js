import { getAllProducts } from "@/lib/productsData";
import ProductsPageClient from "./ProductsPageClient";

export const metadata = {
  title: "Our Products — SaaS Tools",
  description:
    "Explore SaaS products built by NexCraft Technologies — CamToCode AI code scanner and WhatsApp CRM bulk messenger for businesses in India.",
  keywords: [
    "NexCraft products",
    "CamToCode",
    "WhatsApp CRM",
    "WhatsApp bulk messenger",
    "bulk WhatsApp sender India",
    "camera to code",
    "AI OCR scanner",
    "developer tools SaaS",
    "scan code from phone",
    "scroll automation",
  ],
  alternates: { canonical: "https://nexcrafttech.com/products" },
  openGraph: {
    title: "Our Products — SaaS Tools by NexCraft",
    description:
      "SaaS products built by NexCraft — CamToCode AI code scanner and WhatsApp CRM for bulk business messaging with anti-ban features.",
    url: "https://nexcrafttech.com/products",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "NexCraft Technologies Products" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Products — NexCraft Technologies",
    description: "Explore CamToCode and other SaaS tools built by NexCraft Technologies.",
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
