import { buildWaCrmMetadata } from "@/lib/whatsapp-crm/seo";

export const metadata = buildWaCrmMetadata({
  title: "Register — WhatsApp CRM",
  description:
    "Create a free NexCraft WhatsApp CRM account. Start sending bulk WhatsApp messages with CSV import, personalised templates, and anti-ban features. No credit card required.",
  path: "/register",
});

export default function RegisterLayout({ children }) {
  return children;
}
