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
  title: "NexCraft Technologies — Web Development, AI Chatbots & SEO Agency in Chennai, India",
  description:
    "NexCraft Technologies builds fast Next.js websites, AI chatbots, and delivers SEO & digital marketing for startups and growing businesses. Transparent pricing from ₹6,999 ($85). Free consultation.",
  alternates: { canonical: "https://nexcrafttech.com" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long does it take to build a website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most websites are delivered within 2–4 weeks depending on complexity. Simple landing pages can be ready in 5–7 days, while full eCommerce or SaaS platforms take 4–8 weeks.",
      },
    },
    {
      "@type": "Question",
      name: "What technologies do you use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We primarily build with Next.js, React, Tailwind CSS, Node.js, and Supabase. For mobile apps we use React Native, and for AI/ML we leverage Python, TensorFlow, and OpenAI APIs.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer post-launch support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely! All our packages come with lifetime support. Bug fixes, security patches, and content guidance are always covered. SEO maintenance is included for the first 6–12 months depending on your plan, and can be extended monthly after that.",
      },
    },
    {
      "@type": "Question",
      name: "Can you redesign my existing website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. We specialize in redesigns — improving speed, SEO, mobile experience, and conversions while preserving your existing content and brand identity.",
      },
    },
    {
      "@type": "Question",
      name: "What's included in your SEO services?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our SEO package covers keyword research, on-page optimization, technical SEO audits, content strategy, Google Business Profile setup, monthly analytics reports, and backlink building.",
      },
    },
    {
      "@type": "Question",
      name: "Do you build mobile apps?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We build cross-platform mobile apps using React Native — one codebase for both iOS and Android. Native performance, 60% faster development time compared to separate native builds.",
      },
    },
    {
      "@type": "Question",
      name: "How does your pricing work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer transparent, fixed-price packages starting at ₹6,999 ($85) for websites. No hidden fees. You get a detailed quote before we start, and payment is milestone-based.",
      },
    },
    {
      "@type": "Question",
      name: "Can you integrate AI chatbots into my website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — we build custom AI chatbots for websites and WhatsApp that handle customer queries, generate leads, and automate support. Powered by GPT/Gemini with your business knowledge base.",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
