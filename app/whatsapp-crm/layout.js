import WACRMLayoutClient from "@/components/whatsapp-crm/WACRMLayoutClient";
import { WA_CRM_KEYWORDS, WA_CRM_SOFTWARE_SCHEMA } from "@/lib/whatsapp-crm/seo";

const SITE_URL = "https://nexcrafttech.com";

export const metadata = {
  title: {
    default: "WhatsApp CRM — Bulk Messenger & Campaign Manager",
    template: "%s | NexCraft WhatsApp CRM",
  },
  description:
    "Send personalised bulk WhatsApp messages with human-like delays, message spinning, CSV import, scheduling, and live campaign logs. Free plan available. Built by NexCraft Technologies, India.",
  keywords: WA_CRM_KEYWORDS,
  openGraph: {
    title: "NexCraft WhatsApp CRM — Bulk Messenger & Campaign Manager",
    description:
      "Bulk WhatsApp messaging for businesses in India. CSV contacts, personalised templates, anti-ban features, and live delivery logs.",
    url: `${SITE_URL}/products/whatsappcrm`,
    type: "website",
    siteName: "NexCraft WhatsApp CRM",
    locale: "en_IN",
    images: [{
      url: `${SITE_URL}/opengraph-image`,
      width: 1200,
      height: 630,
      alt: "NexCraft WhatsApp CRM",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NexCraft WhatsApp CRM — Bulk Messenger",
    description: "Send bulk WhatsApp messages with human-like delays, scheduling, and live logs.",
    images: [`${SITE_URL}/twitter-image`],
  },
};

export default function WACRMLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WA_CRM_SOFTWARE_SCHEMA) }}
      />
      <WACRMLayoutClient>{children}</WACRMLayoutClient>
    </>
  );
}
