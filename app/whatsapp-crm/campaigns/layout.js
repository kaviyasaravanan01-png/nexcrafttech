import { buildWaCrmMetadata } from "@/lib/whatsapp-crm/seo";

export const metadata = buildWaCrmMetadata({
  title: "Bulk Messenger",
  description: "Create and manage WhatsApp bulk messaging campaigns with live progress.",
  path: "/campaigns",
  index: false,
});

export default function CampaignsLayout({ children }) {
  return children;
}
