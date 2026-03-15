import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import WhatsAppButton from "@/components/WhatsAppButton";
import Chatbot from "@/components/Chatbot";
import PageTransition from "@/components/PageTransition";
import SplashScreen from "@/components/SplashScreen";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import SearchProvider from "@/components/SearchProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://nexcrafttech.com"),
  title: {
    default: "NexCraft Technologies — Web Development, AI Chatbots & SEO Agency in India",
    template: "%s | NexCraft Technologies",
  },
  description:
    "NexCraft Technologies is a full-service web development & digital agency in Chennai, India. We build fast Next.js websites, AI chatbots, SEO, and digital marketing solutions. Pricing from ₹6,999 ($85).",
  keywords: [
    "NexCraft Technologies",
    "web development India",
    "web development Chennai",
    "AI chatbot development",
    "SEO services India",
    "digital marketing agency",
    "app development",
    "website design",
    "affordable web development",
    "Next.js development",
    "React development India",
    "ecommerce website India",
    "custom website development",
    "startup web development",
    "business website design",
  ],
  authors: [{ name: "NexCraft Technologies", url: "https://nexcrafttech.com" }],
  creator: "NexCraft Technologies",
  publisher: "NexCraft Technologies",
  formatDetection: { telephone: true, email: true },
  openGraph: {
    title: "NexCraft Technologies — Web Development, AI & SEO Agency",
    description: "We build fast, modern websites, AI chatbots & handle SEO for startups and businesses. Transparent pricing from ₹6,999 ($85). Free consultation.",
    siteName: "NexCraft Technologies",
    type: "website",
    url: "https://nexcrafttech.com",
    locale: "en_IN",
    images: [{
      url: "https://nexcrafttech.com/opengraph-image",
      width: 1200,
      height: 630,
      alt: "NexCraft Technologies — Web Development, AI Chatbots & SEO Agency",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NexCraft Technologies — Web Development, AI & SEO Agency",
    description: "We build fast websites, AI chatbots & handle SEO. Transparent pricing from ₹6,999 ($85). Free consultation.",
    images: ["https://nexcrafttech.com/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: {
    canonical: "https://nexcrafttech.com",
  },
  category: "technology",
  verification: {
    google: "Z0hwStvb4-8GxS7qESjfcI4HhPbfiJNJJHBrbc1hIrg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
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
              description: "Full-service web development & digital agency in Chennai, India. We build fast websites, AI chatbots, and offer SEO & digital marketing solutions.",
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
              sameAs: [],
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
              priceRange: "₹6,999 - ₹29,999+",
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
        <CustomCursor />
        <SplashScreen />
        <ScrollProgress />
        <Navbar />
        <main><PageTransition>{children}</PageTransition></main>
        <Footer />
        <BackToTop />
        <WhatsAppButton />
        <Chatbot />
        <SearchProvider />
      </body>
    </html>
  );
}
