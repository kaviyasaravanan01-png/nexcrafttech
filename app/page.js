import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import ServiceShowcaseClient from "@/components/ServiceShowcaseClient";
import Process from "@/components/Process";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Map from "@/components/Map";

export const metadata = {
  title: "NexCraft Tech — Web Dev, AI Chatbots & SEO | Chennai",
  description:
    "Fast Next.js websites, AI chatbots & SEO for startups. Transparent pricing from ₹6,999. Free consultation.",
  alternates: { canonical: "https://nexcrafttech.com" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <ServiceShowcaseClient />
      <Process />
      <Portfolio />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Contact />
      <Map />
    </>
  );
}
