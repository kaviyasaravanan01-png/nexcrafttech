"use client";

import { useState, useEffect, useCallback } from "react";
import SearchModal from "./SearchModal";

// Import blog and portfolio data directly for the client-side search
const blogPosts = [
  { slug: "why-nextjs-best-framework-2026", title: "Why Next.js Is the Best Framework for Business Websites in 2026", excerpt: "From server components to built-in SEO — here's why Next.js dominates modern web development.", category: "Web Development" },
  { slug: "ai-chatbots-small-business-guide", title: "AI Chatbots for Small Businesses: A Practical Guide", excerpt: "How AI chatbots can automate 70% of customer queries and generate leads.", category: "AI & Automation" },
  { slug: "seo-strategies-that-actually-work-2026", title: "SEO Strategies That Actually Work in 2026", excerpt: "Actionable SEO strategies for ranking higher on Google.", category: "SEO" },
  { slug: "website-vs-social-media-presence", title: "Website vs Social Media: Why You Need Both", excerpt: "Why a website is essential even if you have strong social media.", category: "Business" },
  { slug: "react-native-vs-flutter-2026", title: "React Native vs Flutter in 2026: Which Should You Choose?", excerpt: "A detailed comparison of the two leading cross-platform frameworks.", category: "App Development" },
  { slug: "web-design-trends-2026", title: "Web Design Trends Dominating 2026", excerpt: "The design trends shaping the future of the web.", category: "Design" },
];

const portfolioProjects = [
  { slug: "spacecrafts", title: "SpaceCrafts", tagline: "Premium space-themed craft marketplace" },
  { slug: "living-fire-australia", title: "Living Fire Australia", tagline: "Luxury fireplace eCommerce" },
  { slug: "blendora-collections", title: "Blendora Collections", tagline: "Fashion & lifestyle brand" },
  { slug: "spark-metal-fabrications", title: "Spark Metal Fabrications", tagline: "Industrial fabrication showcase" },
  { slug: "deliverease", title: "DeliverEase", tagline: "Smart delivery management platform" },
  { slug: "pixelforge-studio", title: "PixelForge Studio", tagline: "Creative agency portfolio" },
];

export default function SearchProvider() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = useCallback(() => setIsOpen(false), []);

  // Global keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Expose a global function so the Navbar search button can trigger it
  useEffect(() => {
    window.__openSearch = () => setIsOpen(true);
    return () => { delete window.__openSearch; };
  }, []);

  return (
    <SearchModal
      isOpen={isOpen}
      onClose={handleClose}
      blogPosts={blogPosts}
      portfolioProjects={portfolioProjects}
    />
  );
}
