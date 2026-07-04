import { buildWaCrmMetadata } from "@/lib/whatsapp-crm/seo";

export const metadata = buildWaCrmMetadata({
  title: "Contacts",
  description: "Manage WhatsApp CRM contacts — import CSV, add manually, search and delete.",
  path: "/contacts",
  index: false,
});

export default function ContactsLayout({ children }) {
  return children;
}
