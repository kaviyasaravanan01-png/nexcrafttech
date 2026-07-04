import { buildWaCrmMetadata } from "@/lib/whatsapp-crm/seo";

export const metadata = buildWaCrmMetadata({
  title: "Settings",
  description: "WhatsApp CRM account settings, billing, and profile.",
  path: "/settings",
  index: false,
});

export default function SettingsLayout({ children }) {
  return children;
}
