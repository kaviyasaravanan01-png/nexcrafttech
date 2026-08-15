import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import ClientShell from "@/components/ClientShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  metadataBase: new URL("https://nexcrafttech.com"),
  title: {
    default: "NexCraft Tech — AI, Automation & Digital Solutions | Chennai",
    template: "%s | NexCraft Technologies",
  },
  description:
    "AI solutions, automation, websites, SEO, product & prototype development, and data engineering. NexCraft Technologies, Chennai.",
  keywords: [
    "NexCraft Technologies",
    "AI solutions Chennai",
    "automation solutions India",
    "data engineering Chennai",
    "prototype development",
    "web development India",
    "web development Chennai",
    "SEO services India",
    "AI chatbot development",
    "Next.js development",
    "VantaHire",
    "AI Call Assistant",
    "CamToCode",
    "WhatsApp CRM",
    "PDF AI",
  ],
  icons: {
    icon: [{ url: "/nct-logo.svg", type: "image/svg+xml" }],
    shortcut: "/nct-logo.svg",
    apple: "/nct-logo.svg",
  },
  authors: [{ name: "NexCraft Technologies", url: "https://nexcrafttech.com" }],
  creator: "NexCraft Technologies",
  publisher: "NexCraft Technologies",
  formatDetection: { telephone: true, email: true },
  openGraph: {
    title: "NexCraft Technologies — AI, Automation & Digital Solutions | Chennai",
    description: "AI solutions, automation, websites, SEO, product development, and data engineering. Talk to NexCraft.",
    siteName: "NexCraft Technologies",
    type: "website",
    url: "https://nexcrafttech.com",
    locale: "en_IN",
    images: [{
      url: "https://nexcrafttech.com/opengraph-image",
      width: 1200,
      height: 630,
      alt: "NexCraft Technologies — AI, Automation & Digital Solutions",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NexCraft Technologies — AI, Automation & Digital Solutions",
    description: "AI, automation, websites, SEO, products, and data engineering. Talk to NexCraft.",
    images: ["https://nexcrafttech.com/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: {
    canonical: "https://nexcrafttech.com",
    languages: {
      "en": "https://nexcrafttech.com",
    },
  },
  category: "technology",
  verification: {
    google: "Z0hwStvb4-8GxS7qESjfcI4HhPbfiJNJJHBrbc1hIrg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "NexCraft Technologies",
              url: "https://nexcrafttech.com",
              logo: "https://nexcrafttech.com/nct-logo.svg",
              image: "https://nexcrafttech.com/opengraph-image",
              description: "AI, automation, websites, SEO, product, and data engineering studio in Chennai, India.",
              email: "nexcrafttech@gmail.com",
              telephone: "+918778585263",
              address: {
                "@type": "PostalAddress",
                streetAddress: "No 17 Bharathiyar Street, MGR Nagar",
                addressLocality: "Chennai",
                addressRegion: "Tamil Nadu",
                postalCode: "600078",
                addressCountry: "IN",
              },
              sameAs: [
                "https://www.facebook.com/nexcrafttech",
                "https://www.instagram.com/nexcrafttech",
                "https://www.linkedin.com/company/nexcrafttech",
                "https://x.com/nexcrafttech",
                "https://www.youtube.com/@nexcrafttech",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+918778585263",
                contactType: "sales",
                availableLanguage: ["English", "Tamil", "Hindi"],
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "NexCraft Technologies",
              url: "https://nexcrafttech.com",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://nexcrafttech.com/blog?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "NexCraft Technologies",
              image: "https://nexcrafttech.com/opengraph-image",
              url: "https://nexcrafttech.com",
              telephone: "+918778585263",
              email: "nexcrafttech@gmail.com",
              priceRange: "₹15000+",
              address: {
                "@type": "PostalAddress",
                streetAddress: "No 17 Bharathiyar Street, MGR Nagar",
                addressLocality: "Chennai",
                addressRegion: "Tamil Nadu",
                postalCode: "600078",
                addressCountry: "IN",
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                opens: "09:00",
                closes: "18:00",
              },
            }),
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JJSGBLLT8R"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-JJSGBLLT8R');`}
        </Script>
        <ClientShell>{children}</ClientShell>
        <Analytics />
      </body>
    </html>
  );
}
