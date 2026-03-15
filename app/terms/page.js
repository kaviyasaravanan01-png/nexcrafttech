import TermsClient from "./TermsClient";

export const metadata = {
  title: "Terms of Service — NexCraft Technologies",
  description: "Read the terms of service for NexCraft Technologies. Understand our policies for web development, AI chatbot, and SEO services.",
  alternates: { canonical: "https://nexcrafttech.com/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return <TermsClient />;
}
