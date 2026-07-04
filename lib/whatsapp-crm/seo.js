const SITE_URL = "https://nexcrafttech.com";
const WA_BASE = `${SITE_URL}/whatsapp-crm`;

export const WA_CRM_KEYWORDS = [
  "WhatsApp CRM",
  "WhatsApp bulk messenger",
  "bulk WhatsApp sender India",
  "WhatsApp campaign manager",
  "WhatsApp marketing tool",
  "send bulk messages WhatsApp",
  "WhatsApp business messaging",
  "NexCraft WhatsApp CRM",
];

export function buildWaCrmMetadata({
  title,
  description,
  path = "",
  keywords = [],
  index = true,
}) {
  const url = `${WA_BASE}${path}`;
  const fullTitle = title.includes("WhatsApp CRM") ? title : `${title} — WhatsApp CRM`;

  return {
    title: fullTitle,
    description,
    keywords: [...WA_CRM_KEYWORDS, ...keywords],
    alternates: { canonical: url },
    robots: index
      ? { index: true, follow: true, googleBot: { index: true, follow: true } }
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
    openGraph: {
      title: fullTitle,
      description,
      url,
      type: "website",
      siteName: "NexCraft WhatsApp CRM",
      locale: "en_IN",
      images: [{
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "NexCraft WhatsApp CRM — Bulk Messenger & Campaign Manager",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`${SITE_URL}/twitter-image`],
    },
  };
}

export const WA_CRM_SOFTWARE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NexCraft WhatsApp CRM",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: `${WA_BASE}/login`,
  description:
    "Bulk WhatsApp messenger with human-like delays, message spinning, CSV contacts, campaign scheduling, live logs, and Razorpay billing. Built for businesses in India.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
    description: "Free plan — 50 messages/day",
  },
  creator: {
    "@type": "Organization",
    name: "NexCraft Technologies",
    url: SITE_URL,
    logo: `${SITE_URL}/nct-logo.svg`,
  },
  featureList: [
    "Bulk WhatsApp messaging",
    "CSV contact import",
    "Message variables",
    "Campaign scheduling",
    "Anti-ban delays",
    "Live delivery logs",
  ],
};
