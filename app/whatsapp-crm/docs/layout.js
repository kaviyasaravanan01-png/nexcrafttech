import { buildWaCrmMetadata } from "@/lib/whatsapp-crm/seo";

export const metadata = buildWaCrmMetadata({
  title: "Documentation — WhatsApp CRM",
  description:
    "Learn how to use NexCraft WhatsApp CRM: connect WhatsApp, import contacts, create campaigns, schedule messages, use anti-ban features, and manage billing.",
  path: "/docs",
});

export default function DocsLayout({ children }) {
  return children;
}
