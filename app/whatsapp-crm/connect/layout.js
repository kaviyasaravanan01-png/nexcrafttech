import { buildWaCrmMetadata } from "@/lib/whatsapp-crm/seo";

export const metadata = buildWaCrmMetadata({
  title: "Connect WhatsApp",
  description: "Connect your WhatsApp number to NexCraft CRM via QR code.",
  path: "/connect",
  index: false,
});

export default function ConnectLayout({ children }) {
  return children;
}
