import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Products from "@/components/Products";
import Portfolio from "@/components/Portfolio";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import ServiceShowcaseClient from "@/components/ServiceShowcaseClient";
import Contact from "@/components/Contact";
import Map from "@/components/Map";

export const metadata = {
  title: "NexCraft Tech — AI, Automation & Digital Solutions | Chennai",
  description:
    "AI solutions, automation, websites, SEO, product & prototype development, and data engineering. NexCraft Technologies, Chennai — from discovery to production.",
  keywords: [
    "NexCraft Technologies",
    "AI solutions Chennai",
    "automation solutions India",
    "data engineering Chennai",
    "prototype development",
    "web development Chennai",
    "SEO services India",
    "AI chatbot development",
    "VantaHire",
    "AI Call Assistant",
    "CamToCode",
    "WhatsApp CRM",
    "PDF AI",
  ],
  alternates: { canonical: "https://nexcrafttech.com" },
  openGraph: {
    title: "NexCraft Technologies — AI, Automation & Digital Solutions",
    description:
      "AI solutions, automation, websites, SEO, product development, and data engineering from Chennai, India.",
    url: "https://nexcrafttech.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexCraft Technologies — AI, Automation & Digital Solutions",
    description:
      "AI, automation, websites, SEO, products, and data engineering. Talk to NexCraft.",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Process />
      <Products />
      <Portfolio />
      <Pricing />
      <FAQ />
      <ServiceShowcaseClient />
      <Contact />
      <Map />
    </>
  );
}
