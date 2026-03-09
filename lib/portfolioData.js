const portfolioData = {
  spacecrafts: {
      spacecrafts: {
        title: "SpaceCrafts",
        tagline: "Interactive website with modern animations & bold visual identity.",
        url: "https://spacecraftswebsite.vercel.app/",
        color: "#6366f1",
        tags: ["Next.js", "Framer Motion", "Tailwind CSS", "Three.js"],
        category: "Web Development",
        duration: "3 weeks",
        year: "2025",
        challenge:
          "SpaceCrafts needed a website that matched their innovative brand — something visually bold with smooth animations that would captivate visitors and differentiate them in a competitive market. The existing site was static and failed to communicate their cutting-edge approach.",
        solution:
          "We built a fully interactive experience using Next.js and Three.js for immersive 3D elements. Framer Motion powers page transitions and scroll-triggered animations. Every interaction was designed to feel premium — from hover states to loading sequences.",
        results: [
          { label: "Page Load Speed", value: "1.2s", desc: "Lighthouse performance score 96+" },
          { label: "Bounce Rate", value: "-42%", desc: "Reduced through engaging interactions" },
          { label: "Session Duration", value: "+65%", desc: "Users exploring interactive elements" },
          { label: "Mobile Score", value: "98", desc: "Perfect responsive implementation" },
        ],
        features: [
          "Three.js 3D background animations",
          "Scroll-triggered reveal effects",
          "Dark theme with neon accent palette",
          "Optimized WebGL performance",
          "SEO-friendly server-side rendering",
          "Responsive down to 320px",
        ],
      },
      "living-fire-australia": {
        title: "Living Fire Australia",
        tagline: "Premium eCommerce for a leading Australian fireplace brand.",
        url: "https://www.livingfire.com.au/",
        color: "#f97316",
        tags: ["eCommerce", "Custom CMS", "SEO", "Payment Gateway"],
        category: "eCommerce",
        duration: "6 weeks",
        year: "2025",
        challenge:
          "Living Fire Australia had an outdated WooCommerce store with slow loading times and poor mobile experience. Product discovery was difficult, leading to high cart abandonment rates and lost revenue.",
        solution:
          "We rebuilt their entire platform with a headless architecture — a fast Next.js frontend paired with a custom CMS for product management. Advanced filtering, zoom-able product galleries, and a streamlined checkout flow transformed the shopping experience.",
        results: [
          { label: "Load Time", value: "0.9s", desc: "Down from 4.2s on the old site" },
          { label: "Conversions", value: "+38%", desc: "Improved checkout flow & UX" },
          { label: "Organic Traffic", value: "+55%", desc: "SEO optimization with schema markup" },
          { label: "Cart Abandonment", value: "-31%", desc: "Streamlined purchase journey" },
        ],
        features: [
          "Headless CMS product management",
          "Advanced product filtering & search",
          "Secure payment gateway integration",
          "Automated inventory tracking",
          "Customer review system",
          "Structured data for Google Shopping",
        ],
      },
      "blendora-collections": {
        title: "Blendora Collections",
        tagline: "Elegant fashion storefront with smooth browsing experience.",
        url: "https://blendoracollections.com/",
        color: "#ec4899",
        tags: ["Next.js", "Supabase", "Responsive Design", "Fashion"],
        category: "eCommerce",
        duration: "4 weeks",
        year: "2025",
        challenge:
          "Blendora Collections wanted a digital storefront that captured the elegance of their fashion line. Their Instagram-only presence limited sales potential, and they needed a proper eCommerce platform with brand consistency.",
        solution:
          "We designed a visually rich, minimalist storefront powered by Next.js and Supabase. High-quality imagery takes center stage with careful typography and whitespace. The result feels like a digital boutique rather than a generic online store.",
        results: [
          { label: "Online Sales", value: "+280%", desc: "vs Instagram-only sales" },
          { label: "Avg Order Value", value: "+22%", desc: "Through curated collections" },
          { label: "Return Visitors", value: "45%", desc: "Strong brand loyalty" },
          { label: "Page Speed", value: "95+", desc: "Lighthouse performance score" },
        ],
        features: [
          "Curated collection pages",
          "Supabase real-time inventory",
          "Wishlist functionality",
          "Size guide integration",
          "Instagram feed embed",
          "Mobile-first responsive design",
        ],
      },
      previzz: {
        title: "Previzz",
        tagline: "SaaS platform for pre-visualization & project planning.",
        url: "https://www.previzz.com/",
        color: "#06b6d4",
        tags: ["React", "Cloud", "Real-time", "SaaS"],
        category: "SaaS Platform",
        duration: "8 weeks",
        year: "2024",
        challenge:
          "Previzz needed a collaborative SaaS platform where creative teams could pre-visualize projects in real-time. The existing workflow involved scattered tools — emails, PDFs, and video calls — leading to miscommunication and project delays.",
        solution:
          "We engineered a real-time collaborative platform with cloud-based rendering. Teams can upload assets, arrange scenes, and share previews instantly. Real-time syncing ensures everyone sees the same view, powered by WebSocket connections and cloud infrastructure.",
        results: [
          { label: "Project Time", value: "-40%", desc: "Faster pre-production workflows" },
          { label: "Revisions", value: "-55%", desc: "Real-time collaboration reduces back-and-forth" },
          { label: "User Retention", value: "78%", desc: "Monthly active users returning" },
          { label: "Uptime", value: "99.9%", desc: "Enterprise-grade reliability" },
        ],
        features: [
          "Real-time collaborative workspace",
          "Cloud-based asset management",
          "WebSocket live synchronization",
          "Role-based access control",
          "Export to multiple formats",
          "API integrations with design tools",
        ],
      },
      "spark-metal-fabrications": {
        title: "Spark Metal Fabrications",
        tagline: "Industrial services website with portfolio & enquiry system.",
        url: "https://sparkmetalfabrications.com.au/",
        color: "#eab308",
        tags: ["Custom Build", "SEO", "Lead Generation", "Portfolio"],
        category: "Business Website",
        duration: "3 weeks",
        year: "2025",
        challenge:
          "Spark Metal Fabrications relied entirely on word-of-mouth and had zero online presence. They needed a professional website to showcase their work, generate inbound leads, and rank locally in Google searches for metal fabrication services.",
        solution:
          "We built a fast, SEO-optimized business website with a visual project portfolio, service pages, and an integrated enquiry form. Local SEO strategies were implemented including Google Business Profile optimization and location-based schema markup.",
        results: [
          { label: "Leads/month", value: "35+", desc: "From zero online inquiries" },
          { label: "Google Ranking", value: "Top 3", desc: "For local metal fabrication keywords" },
          { label: "Site Speed", value: "97", desc: "Lighthouse performance score" },
          { label: "Mobile Traffic", value: "68%", desc: "Majority from mobile devices" },
        ],
        features: [
          "Visual project gallery with categories",
          "Multi-step enquiry form",
          "Google Maps integration",
          "Local SEO schema markup",
          "Google Business Profile sync",
          "Mobile-optimized touch interactions",
        ],
      },
      "able-interiors-digital": {
        title: "Able Interiors Digital",
        tagline: "Interior design studio with immersive visual storytelling.",
        url: "https://ableinteriorsdigitalwebsite.vercel.app/",
        color: "#22c55e",
        tags: ["Next.js", "Tailwind CSS", "Visual Design", "Animations"],
        category: "Design Portfolio",
        duration: "3 weeks",
        year: "2025",
        challenge:
          "Able Interiors needed a digital portfolio that matched the quality of their physical interior designs. Their outdated website didn't showcase their aesthetic properly and failed to convert visitors into consultation bookings.",
        solution:
          "We created an immersive visual experience — full-bleed imagery, smooth scroll transitions, and a warm color palette that reflects their design philosophy. A consultation booking system was integrated to convert admiration into action.",
        results: [
          { label: "Consultations", value: "+120%", desc: "Booking rate increase" },
          { label: "Avg. Time on Site", value: "4.2m", desc: "Deep engagement with portfolio" },
          { label: "Portfolio Views", value: "+85%", desc: "Per session average" },
          { label: "Mobile UX Score", value: "96", desc: "Premium mobile experience" },
        ],
        features: [
          "Full-bleed image galleries",
          "Project before/after sliders",
          "Consultation booking system",
          "Subtle parallax scroll effects",
          "Category-based portfolio filtering",
          "Testimonial carousel integration",
        ],
      },
      "prompt-library": {
        title: "Prompt Library",
        tagline: "AI prompt marketplace for Midjourney, ChatGPT, Veo, Gemini & more.",
        url: "https://promptslibrary-nine.vercel.app/",
        color: "#4f46e5",
        tags: ["Marketplace", "AI Prompts", "Video Tutorials", "Next.js", "SEO"],
        category: "Web Platform",
        duration: "Ongoing",
        year: "2026",
        challenge:
          "Prompt Library needed a scalable platform to host and sell high-quality AI prompts and tutorials for a global audience. The challenge was to create a trusted, user-friendly marketplace with robust search, filtering, and content management, while supporting rapid growth and SEO.",
        solution:
          "We built a modern web platform using Next.js, optimized for performance and SEO. The site features advanced filtering, user reviews, favorites, and a seamless prompt browsing experience. Secure authentication and scalable infrastructure support 400,000+ users and 240k+ prompts.",
        results: [
          { label: "User Base", value: "400,000+", desc: "Global users accessing prompts & tutorials" },
          { label: "Prompt Count", value: "240k+", desc: "High-quality, tested prompts available" },
          { label: "Reviews", value: "33,000+", desc: "Average rating 4.9/5" },
          { label: "SEO Traffic", value: "+120%", desc: "Organic growth via optimized content" },
        ],
        features: [
          "Marketplace for AI prompts & tutorials",
          "Advanced search & filtering",
          "User reviews & ratings",
          "Favorites & collections",
          "Secure Google authentication",
          "Responsive design for all devices",
          "SEO-optimized pages",
        ],
      },
    title: "SpaceCrafts",
    tagline: "Interactive website with modern animations & bold visual identity.",
    url: "https://spacecraftswebsite.vercel.app/",
    color: "#6366f1",
    tags: ["Next.js", "Framer Motion", "Tailwind CSS", "Three.js"],
    category: "Web Development",
    duration: "3 weeks",
    year: "2025",
    challenge:
      "SpaceCrafts needed a website that matched their innovative brand — something visually bold with smooth animations that would captivate visitors and differentiate them in a competitive market. The existing site was static and failed to communicate their cutting-edge approach.",
    solution:
      "We built a fully interactive experience using Next.js and Three.js for immersive 3D elements. Framer Motion powers page transitions and scroll-triggered animations. Every interaction was designed to feel premium — from hover states to loading sequences.",
    results: [
      { label: "Page Load Speed", value: "1.2s", desc: "Lighthouse performance score 96+" },
      { label: "Bounce Rate", value: "-42%", desc: "Reduced through engaging interactions" },
      { label: "Session Duration", value: "+65%", desc: "Users exploring interactive elements" },
      { label: "Mobile Score", value: "98", desc: "Perfect responsive implementation" },
    ],
    features: [
      "Three.js 3D background animations",
      "Scroll-triggered reveal effects",
      "Dark theme with neon accent palette",
      "Optimized WebGL performance",
      "SEO-friendly server-side rendering",
      "Responsive down to 320px",
    ],
  },
  "living-fire-australia": {
    title: "Living Fire Australia",
    tagline: "Premium eCommerce for a leading Australian fireplace brand.",
    url: "https://www.livingfire.com.au/",
    color: "#f97316",
    tags: ["eCommerce", "Custom CMS", "SEO", "Payment Gateway"],
    category: "eCommerce",
    duration: "6 weeks",
    year: "2025",
    challenge:
      "Living Fire Australia had an outdated WooCommerce store with slow loading times and poor mobile experience. Product discovery was difficult, leading to high cart abandonment rates and lost revenue.",
    solution:
      "We rebuilt their entire platform with a headless architecture — a fast Next.js frontend paired with a custom CMS for product management. Advanced filtering, zoom-able product galleries, and a streamlined checkout flow transformed the shopping experience.",
    results: [
      { label: "Load Time", value: "0.9s", desc: "Down from 4.2s on the old site" },
      { label: "Conversions", value: "+38%", desc: "Improved checkout flow & UX" },
      { label: "Organic Traffic", value: "+55%", desc: "SEO optimization with schema markup" },
      { label: "Cart Abandonment", value: "-31%", desc: "Streamlined purchase journey" },
    ],
    features: [
      "Headless CMS product management",
      "Advanced product filtering & search",
      "Secure payment gateway integration",
      "Automated inventory tracking",
      "Customer review system",
      "Structured data for Google Shopping",
    ],
  },
  "blendora-collections": {
    title: "Blendora Collections",
    tagline: "Elegant fashion storefront with smooth browsing experience.",
    url: "https://blendoracollections.com/",
    color: "#ec4899",
    tags: ["Next.js", "Supabase", "Responsive Design", "Fashion"],
    category: "eCommerce",
    duration: "4 weeks",
    year: "2025",
    challenge:
      "Blendora Collections wanted a digital storefront that captured the elegance of their fashion line. Their Instagram-only presence limited sales potential, and they needed a proper eCommerce platform with brand consistency.",
    solution:
      "We designed a visually rich, minimalist storefront powered by Next.js and Supabase. High-quality imagery takes center stage with careful typography and whitespace. The result feels like a digital boutique rather than a generic online store.",
    results: [
      { label: "Online Sales", value: "+280%", desc: "vs Instagram-only sales" },
      { label: "Avg Order Value", value: "+22%", desc: "Through curated collections" },
      { label: "Return Visitors", value: "45%", desc: "Strong brand loyalty" },
      { label: "Page Speed", value: "95+", desc: "Lighthouse performance score" },
    ],
    features: [
      "Curated collection pages",
      "Supabase real-time inventory",
      "Wishlist functionality",
      "Size guide integration",
      "Instagram feed embed",
      "Mobile-first responsive design",
    ],
  },
  previzz: {
    title: "Previzz",
    tagline: "SaaS platform for pre-visualization & project planning.",
    url: "https://www.previzz.com/",
    color: "#06b6d4",
    tags: ["React", "Cloud", "Real-time", "SaaS"],
    category: "SaaS Platform",
    duration: "8 weeks",
    year: "2024",
    challenge:
      "Previzz needed a collaborative SaaS platform where creative teams could pre-visualize projects in real-time. The existing workflow involved scattered tools — emails, PDFs, and video calls — leading to miscommunication and project delays.",
    solution:
      "We engineered a real-time collaborative platform with cloud-based rendering. Teams can upload assets, arrange scenes, and share previews instantly. Real-time syncing ensures everyone sees the same view, powered by WebSocket connections and cloud infrastructure.",
    results: [
      { label: "Project Time", value: "-40%", desc: "Faster pre-production workflows" },
      { label: "Revisions", value: "-55%", desc: "Real-time collaboration reduces back-and-forth" },
      { label: "User Retention", value: "78%", desc: "Monthly active users returning" },
      { label: "Uptime", value: "99.9%", desc: "Enterprise-grade reliability" },
    ],
    features: [
      "Real-time collaborative workspace",
      "Cloud-based asset management",
      "WebSocket live synchronization",
      "Role-based access control",
      "Export to multiple formats",
      "API integrations with design tools",
    ],
  },
  "spark-metal-fabrications": {
    title: "Spark Metal Fabrications",
    tagline: "Industrial services website with portfolio & enquiry system.",
    url: "https://sparkmetalfabrications.com.au/",
    color: "#eab308",
    tags: ["Custom Build", "SEO", "Lead Generation", "Portfolio"],
    category: "Business Website",
    duration: "3 weeks",
    year: "2025",
    challenge:
      "Spark Metal Fabrications relied entirely on word-of-mouth and had zero online presence. They needed a professional website to showcase their work, generate inbound leads, and rank locally in Google searches for metal fabrication services.",
    solution:
      "We built a fast, SEO-optimized business website with a visual project portfolio, service pages, and an integrated enquiry form. Local SEO strategies were implemented including Google Business Profile optimization and location-based schema markup.",
    results: [
      { label: "Leads/month", value: "35+", desc: "From zero online inquiries" },
      { label: "Google Ranking", value: "Top 3", desc: "For local metal fabrication keywords" },
      { label: "Site Speed", value: "97", desc: "Lighthouse performance score" },
      { label: "Mobile Traffic", value: "68%", desc: "Majority from mobile devices" },
    ],
    features: [
      "Visual project gallery with categories",
      "Multi-step enquiry form",
      "Google Maps integration",
      "Local SEO schema markup",
      "Google Business Profile sync",
      "Mobile-optimized touch interactions",
    ],
  },
  "able-interiors-digital": {
    title: "Able Interiors Digital",
    tagline: "Interior design studio with immersive visual storytelling.",
    url: "https://ableinteriorsdigitalwebsite.vercel.app/",
    color: "#22c55e",
    tags: ["Next.js", "Tailwind CSS", "Visual Design", "Animations"],
    category: "Design Portfolio",
    duration: "3 weeks",
    year: "2025",
    challenge:
      "Able Interiors needed a digital portfolio that matched the quality of their physical interior designs. Their outdated website didn't showcase their aesthetic properly and failed to convert visitors into consultation bookings.",
    solution:
      "We created an immersive visual experience — full-bleed imagery, smooth scroll transitions, and a warm color palette that reflects their design philosophy. A consultation booking system was integrated to convert admiration into action.",
    results: [
      { label: "Consultations", value: "+120%", desc: "Booking rate increase" },
      { label: "Avg. Time on Site", value: "4.2m", desc: "Deep engagement with portfolio" },
      { label: "Portfolio Views", value: "+85%", desc: "Per session average" },
      { label: "Mobile UX Score", value: "96", desc: "Premium mobile experience" },
    ],
    features: [
      "Full-bleed image galleries",
      "Project before/after sliders",
      "Consultation booking system",
      "Subtle parallax scroll effects",
      "Category-based portfolio filtering",
      "Testimonial carousel integration",
    ],
  },
};

export function getAllPortfolioSlugs() {
  return Object.keys(portfolioData);
}

export function getPortfolioBySlug(slug) {
  return portfolioData[slug] || null;
}

export default portfolioData;
