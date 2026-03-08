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
    default: "NexCraft Technologies — Websites, AI Chatbots & SEO for Growing Businesses",
    template: "%s | NexCraft Technologies",
  },
  description:
    "NexCraft Technologies builds fast, modern websites, AI chatbots, and handles SEO & digital marketing for startups and growing businesses. Transparent pricing from ₹15,000.",
  keywords: [
    "NexCraft Technologies",
    "web development India",
    "AI chatbot development",
    "SEO services",
    "digital marketing agency",
    "app development",
    "website design",
    "affordable web development",
  ],
  openGraph: {
    title: "NexCraft Technologies — Websites, AI & SEO",
    description: "We build websites that grow your business. Transparent pricing, fast delivery.",
    siteName: "NexCraft Technologies",
    type: "website",
    url: "https://nexcrafttech.com",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexCraft Technologies — Websites, AI & SEO",
    description: "We build websites that grow your business. Transparent pricing, fast delivery.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: { canonical: "https://nexcrafttech.com" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
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
