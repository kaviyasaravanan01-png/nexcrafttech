import { buildWaCrmMetadata } from "@/lib/whatsapp-crm/seo";

export const metadata = buildWaCrmMetadata({
  title: "Login — WhatsApp CRM",
  description:
    "Sign in to NexCraft WhatsApp CRM. Send bulk WhatsApp campaigns, manage contacts, track delivery logs, and upgrade your plan. Free tier with 50 messages/day.",
  path: "/login",
});

export default function LoginLayout({ children }) {
  return children;
}
