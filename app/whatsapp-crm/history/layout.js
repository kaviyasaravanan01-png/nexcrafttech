import { buildWaCrmMetadata } from "@/lib/whatsapp-crm/seo";

export const metadata = buildWaCrmMetadata({
  title: "Campaign History",
  description: "View WhatsApp campaign history and per-message delivery logs.",
  path: "/history",
  index: false,
});

export default function HistoryLayout({ children }) {
  return children;
}
