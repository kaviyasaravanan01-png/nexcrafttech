const products = {
  camtocode: {
    slug: "camtocode",
    name: "CamToCode",
    subtitle: "Camera to Code with AI Vision OCR",
    tagline:
      "Point your phone at code on any screen. Get clean, copy-ready source code in seconds — with AI Fix, Scan & Answer, and free Scroll Automation for office laptops.",
    shortDescription:
      "CamToCode is a web application that turns your phone camera into a code scanner built specifically for developers and students. Unlike generic OCR apps, it preserves indentation, brackets, and programming symbols using AI Vision OCR (Quick, Standard, Smart, and Precision tiers). Scan Python, JavaScript, Java, C++, and 15+ languages from laptop screens, whiteboards, or printed notes.",
    description:
      "CamToCode is a web application that turns your phone camera into a code scanner built specifically for developers and students. Unlike generic OCR apps, it preserves indentation, brackets, and programming symbols using AI Vision OCR (Quick, Standard, Smart, and Precision tiers). Scan Python, JavaScript, Java, C++, and 15+ languages from laptop screens, whiteboards, or printed notes. Auto Re-capture merges long files across multiple camera captures. Scan & Answer and Instant Answer handle MCQs and exam questions. Exports save to cloud history with view, edit, delete, and social share. Scroll Automation is a unique free tool: open a local file in the browser and auto-scroll sections while the phone captures — no install, no API, ideal for corporate laptops that block extensions. Free tier available. Paid plans from $5/month.",
    url: "https://camtocode.com",
    tryUrl: "https://camtocode.com/try",
    scrollUrl: "https://camtocode.com/scroll",
    docsUrl: "https://camtocode.com/docs",
    blogUrl: "https://camtocode.com/blog",
    privacyUrl: "https://camtocode.com/privacy",
    supportEmail: "support@camtocode.com",
    color: "#06b6d4",
    category: "SaaS · Developer Tools · AI",
    status: "Live",
    role: "Founder / Full-stack developer",
    year: "2025–2026",
    video: "/video/camtocode-demo.mp4",
    videoMeta: {
      title: "CamToCode Demo — Scan Code with Your Phone Camera",
      description:
        "See CamToCode in action: point your phone at code on a laptop screen and get clean, copy-ready source code in seconds using AI Vision OCR.",
      uploadDate: "2026-06-21",
      thumbnailUrl: "/opengraph-image",
    },
    tags: ["Next.js", "Flask", "Supabase", "Gemini", "Anthropic", "PWA"],
    features: [
      { name: "AI Vision OCR", benefit: "Accurate code from phone photos — not plain text OCR" },
      { name: "Quick / Standard / Smart / Precision OCR", benefit: "Speed vs accuracy tiers for every budget" },
      { name: "ROI crop & Enlarge mode", benefit: "Scan only the code block; fullscreen capture" },
      { name: "Auto Re-capture", benefit: "Multi-section long files without losing context" },
      { name: "Scroll Automation", benefit: "Free /scroll tool — auto-scroll local files, keyboard/timer modes" },
      { name: "Scan & Answer", benefit: "Accumulate scans → AI answers MCQs and problems" },
      { name: "Instant Answer", benefit: "One-shot MCQ/question capture" },
      { name: "AI Fix", benefit: "Syntax repair after OCR (paid tiers)" },
      { name: "Cloud History", benefit: "Save, view, edit, delete, download, share exports" },
      { name: "Guest demo", benefit: "1 free scan at /try without account" },
      { name: "PWA install", benefit: "Add to home screen on mobile" },
      { name: "Office-friendly", benefit: "Browser-only — no desktop install required" },
    ],
    audience: [
      "Software developers — capture snippets from meetings, docs, or pair sessions",
      "Students & bootcamp learners — digitize code from slides, books, or exams",
      "Interview candidates — practice on restricted office machines",
      "Corporate employees — IT blocks installs; CamToCode runs in browser",
      "Educators — demo code from physical whiteboards",
      "Freelancers & consultants — fast digitization on client sites",
    ],
    howItWorks: [
      "Open camtocode.com on your phone (or laptop for screen share mode).",
      "Point the camera at code on a screen or use Scroll Automation on laptop for long files.",
      "Crop region → Start/Stop capture (or single Photo).",
      "AI returns clean code → copy, save to history, or run AI Fix.",
      "For questions: enable Instant Answer or Scan & Answer.",
    ],
    pricing: [
      { plan: "Free", price: "$0", highlights: "3 AI scans/day, 20 scans/day, Scroll Automation, 5 Instant Answers/day" },
      { plan: "S&A Only", price: "$5/mo", highlights: "Scan & Answer focused" },
      { plan: "Starter", price: "$7/mo", highlights: "200 AI scans/day, AI Fix" },
      { plan: "Pro", price: "$18/mo", highlights: "500 AI scans/day, Precision OCR, bulk capture" },
      { plan: "Starter + S&A", price: "$10/mo", highlights: "Scanning + Scan & Answer" },
      { plan: "Pro + S&A", price: "$24/mo", highlights: "Full Pro + Scan & Answer" },
    ],
    techStack: [
      { label: "Frontend", value: "Next.js 16, TypeScript, Vercel" },
      { label: "Backend", value: "Python Flask, Socket.IO, Railway" },
      { label: "Auth & DB", value: "Supabase" },
      { label: "AI", value: "Google Gemini + Anthropic Claude" },
      { label: "Payments", value: "Razorpay" },
      { label: "Domain", value: "camtocode.com" },
    ],
    differentiators: [
      {
        vs: "Generic OCR (Lens, etc.)",
        points: ["Code-aware indentation", "Multi-frame consensus", "Scroll Automation (unique)"],
      },
      {
        vs: "Manual typing",
        points: ["10× faster", "Lower error rate", "Hands-free long files"],
      },
      {
        vs: "ChatGPT paste",
        points: ["Camera-first, no retyping", "Built for screen capture", "Structured export & history"],
      },
    ],
    links: [
      { label: "Home / App", href: "https://camtocode.com" },
      { label: "Free try (no login)", href: "https://camtocode.com/try" },
      { label: "Scroll Automation", href: "https://camtocode.com/scroll" },
      { label: "Documentation", href: "https://camtocode.com/docs" },
      { label: "Blog", href: "https://camtocode.com/blog" },
      { label: "Privacy", href: "https://camtocode.com/privacy" },
    ],
    seoKeywords:
      "CamToCode, camera to code, AI OCR scanner, scan code from phone, developer OCR, scroll automation, office laptop code capture, MCQ scanner, camtocode.com",
  },
};

export function getAllProductSlugs() {
  return Object.keys(products);
}

export function getProductBySlug(slug) {
  return products[slug] || null;
}

export function getAllProducts() {
  return Object.values(products);
}

export default products;
