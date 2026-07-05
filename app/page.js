import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import ServiceShowcaseClient from "@/components/ServiceShowcaseClient";
import Process from "@/components/Process";
import Products from "@/components/Products";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Map from "@/components/Map";

export const metadata = {
  title: "NexCraft Tech — Web Dev, AI Chatbots & SEO | Chennai, India",
  description:
    "Web development, AI chatbots & SEO agency in Chennai, India. Fast Next.js sites, WhatsApp CRM, PDF AI & CamToCode. Pricing from ₹6,999. Free consultation.",
  keywords: [
    "NexCraft Technologies",
    "web development Chennai",
    "web development India",
    "AI chatbot development",
    "SEO services India",
    "CamToCode",
    "WhatsApp CRM",
    "PDF AI",
    "WhatsApp bulk messenger",
    "bulk WhatsApp sender India",
    "camera to code",
    "AI OCR scanner",
    "developer tools",
  ],
  alternates: { canonical: "https://nexcrafttech.com" },
  openGraph: {
    title: "NexCraft Technologies — Web Dev, AI & SEO | Chennai, India",
    description:
      "Web development, AI chatbots & SEO in Chennai, India — plus SaaS products like CamToCode, WhatsApp CRM, and PDF AI.",
    url: "https://nexcrafttech.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexCraft Technologies — Web Dev, AI & SEO | Chennai, India",
    description:
      "Web development, AI chatbots & SEO in Chennai, India. CamToCode, WhatsApp CRM, PDF AI & more.",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <ServiceShowcaseClient />
      <Process />
      <Products />
      <Portfolio />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Contact />
      <Map />
    </>
  );
}
