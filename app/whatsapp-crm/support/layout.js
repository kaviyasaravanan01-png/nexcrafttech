import { buildWaCrmMetadata } from "@/lib/whatsapp-crm/seo";

export const metadata = buildWaCrmMetadata({
  title: "Help & Support — WhatsApp CRM",
  description:
    "Get help with NexCraft WhatsApp CRM. FAQs, troubleshooting, documentation links, and email support for bulk messaging, campaigns, and billing.",
  path: "/support",
});

export default function SupportLayout({ children }) {
  return children;
}
