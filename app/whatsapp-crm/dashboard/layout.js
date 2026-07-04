import { buildWaCrmMetadata } from "@/lib/whatsapp-crm/seo";

export const metadata = buildWaCrmMetadata({
  title: "Dashboard",
  description: "WhatsApp CRM dashboard — manage campaigns, contacts, and daily usage.",
  path: "/dashboard",
  index: false,
});

export default function DashboardLayout({ children }) {
  return children;
}
