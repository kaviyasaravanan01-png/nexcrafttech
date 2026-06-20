import { getAllProducts } from "@/lib/productsData";
import ProductsPageClient from "./ProductsPageClient";

export const metadata = {
  title: "Our Products — SaaS Tools by NexCraft Technologies",
  description:
    "Explore SaaS products built by NexCraft Technologies — including CamToCode, the AI-powered camera-to-code scanner for developers.",
  alternates: { canonical: "https://nexcrafttech.com/products" },
};

export default function ProductsPage() {
  const products = getAllProducts();
  return <ProductsPageClient products={products} />;
}
