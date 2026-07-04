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
  title: "NexCraft Tech — Web Dev, AI Chatbots & SEO | Chennai",
  description:
    "Fast Next.js websites, AI chatbots & SEO for startups. Makers of CamToCode & WhatsApp CRM — bulk messaging for businesses. Pricing from ₹6,999. Free consultation.",
  keywords: [
    "NexCraft Technologies",
    "web development Chennai",
    "AI chatbot development",
    "SEO services India",
    "CamToCode",
    "WhatsApp CRM",
    "WhatsApp bulk messenger",
    "bulk WhatsApp sender India",
    "camera to code",
    "AI OCR scanner",
    "developer tools",
  ],
  alternates: { canonical: "https://nexcrafttech.com" },
  openGraph: {
    title: "NexCraft Technologies — Web Dev, AI & SaaS Products",
    description:
      "We build fast websites, AI chatbots & SEO — plus SaaS products like CamToCode and WhatsApp CRM for bulk business messaging.",
    url: "https://nexcrafttech.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexCraft Technologies — Web Dev, AI & SaaS Products",
    description:
      "Fast Next.js websites, AI chatbots & SEO. Explore CamToCode — scan code from any screen with your phone.",
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
