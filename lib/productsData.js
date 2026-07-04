const products = {
  whatsappcrm: {
    slug: "whatsappcrm",
    name: "WhatsApp CRM",
    subtitle: "Bulk Messenger & Campaign Manager",
    tagline:
      "Send personalised bulk WhatsApp messages like a human — random delays, message spinning, scheduling, live logs, and full campaign analytics. Built for businesses that need scale without bans.",
    shortDescription:
      "WhatsApp CRM is a SaaS tool that lets you send bulk WhatsApp messages with human-like behaviour — random delays, message variations, typing simulation, CSV contacts, campaign scheduling, and live delivery logs.",
    description:
      "WhatsApp CRM is a full SaaS bulk messenger built for businesses, agencies, and marketers. Import contacts via CSV, compose messages with variables like {{name}} and {{phone}}, attach images/PDFs/videos, and send campaigns with human-like random delays and message spinning to avoid WhatsApp bans. Schedule campaigns for specific times, set recurring sends, and monitor every message in real-time via live logs. Full campaign history, retry failed messages, and Razorpay subscription billing. Multi-provider fallback: Baileys → whatsapp-web.js → WPPConnect.",
    url: "/whatsapp-crm/dashboard",
    tryUrl: "/whatsapp-crm/login",
    color: "#25D366",
    category: "SaaS · Business Tools · Marketing",
    status: "Beta",
    role: "Founder / Full-stack developer",
    year: "2026",
    video: null,
    tags: ["Next.js", "Node.js", "Baileys", "Socket.IO", "BullMQ", "Supabase"],
    features: [
      { name: "Bulk Messaging", benefit: "Send to thousands of contacts with one campaign" },
      { name: "Human-like Delays", benefit: "Random min–max delay between messages to avoid bans" },
      { name: "Message Spinning", benefit: "Auto-varies emojis and phrasing so no two messages are identical" },
      { name: "Typing Simulation", benefit: "Sends typing status before each message like a real person" },
      { name: "CSV Import", benefit: "Upload contact lists directly from Excel or Google Sheets" },
      { name: "Variable Support", benefit: "{{name}}, {{phone}} personalise every message" },
      { name: "Attachments", benefit: "Send images, PDFs, and videos with your messages" },
      { name: "Campaign Scheduling", benefit: "Schedule campaigns for any date/time or set recurring sends" },
      { name: "Live Logs", benefit: "Real-time console shows sent, waiting, and failed per message" },
      { name: "Multi-provider Fallback", benefit: "Baileys → WWebJS → WPPConnect — auto-switches on failure" },
      { name: "Campaign History", benefit: "Full record of every campaign with stats and logs" },
      { name: "Razorpay Billing", benefit: "Subscription plans with INR/USD pricing" },
    ],
    audience: [
      "Small businesses — send offers and updates to customer lists",
      "Marketing agencies — manage multiple client WhatsApp campaigns",
      "E-commerce stores — abandoned cart, order updates, promotions",
      "Coaches & educators — batch communicate with students",
      "Event managers — bulk invites and reminders",
      "Freelancers — client outreach at scale",
    ],
    howItWorks: [
      "Connect your WhatsApp by scanning a QR code.",
      "Import contacts via CSV or add them manually.",
      "Compose your message with {{name}} variables and optional attachments.",
      "Set random delay (e.g. 2–8 seconds) and message spin rules.",
      "Start campaign — watch live logs as each message sends.",
    ],
    pricing: [
      { plan: "Free", price: "₹0", highlights: "50 messages/day, 100 contacts, basic campaigns" },
      { plan: "Starter", price: "₹499/mo", highlights: "500 messages/day, 1,000 contacts, scheduling" },
      { plan: "Pro", price: "₹1,499/mo", highlights: "5,000 messages/day, 10,000 contacts, multi-device" },
      { plan: "Business", price: "₹3,999/mo", highlights: "Unlimited messages, unlimited contacts, API access" },
    ],
    techStack: [
      { label: "Frontend", value: "Next.js 16, React, Tailwind CSS" },
      { label: "Backend", value: "Node.js, Express, Socket.IO, Railway" },
      { label: "Queue", value: "BullMQ + Redis" },
      { label: "WhatsApp", value: "Baileys + whatsapp-web.js + WPPConnect" },
      { label: "Auth & DB", value: "Supabase" },
      { label: "Payments", value: "Razorpay" },
    ],
    differentiators: [
      {
        vs: "Manual WhatsApp sending",
        points: ["100× faster", "Personalised at scale", "Scheduled & automated"],
      },
      {
        vs: "Other bulk tools",
        points: ["Human-like delays prevent bans", "Multi-provider fallback", "Live logs per message"],
      },
      {
        vs: "Official WhatsApp API",
        points: ["No approval needed", "Works immediately", "Free tier available"],
      },
    ],
    links: [
      { label: "Open Dashboard", href: "/whatsapp-crm/dashboard" },
      { label: "Get Started Free", href: "/whatsapp-crm/login" },
    ],
    seoKeywords:
      "WhatsApp bulk messenger, WhatsApp CRM, bulk WhatsApp sender, WhatsApp campaign manager, WhatsApp marketing tool, send bulk messages WhatsApp India",
  },
  "pdf-ai": {
    slug: "pdf-ai",
    name: "PDF AI",
    subtitle: "Document & Image Intelligence Platform",
    tagline:
      "61+ free document & image tools — merge, convert, AI analysis, and more. Processed in your browser when possible · Enterprise-grade AI features.",
    shortDescription:
      "PDF AI is a full-featured iLovePDF-style document intelligence platform with 61 tools for PDF editing, image processing, AI-powered document workflows, and legal metadata stripping. Most processing runs in the browser for privacy; server-side features include real AES PDF encryption and Office conversions via self-hosted Stirling-PDF.",
    description:
      "Built as a modern alternative to iLovePDF/Smallpdf, PDF AI bundles 32 PDF tools, 21 image tools, 7 AI tools, and a Legal Vault into one fast Next.js app. Users can merge, split, rotate, protect, watermark, redact, sign, and convert documents without uploading sensitive files to third-party APIs when browser processing is enough. Standout technical work includes real PDF password protect/unlock (AES-256 via cryptpdf, optional qpdf), PDF→Word/Excel/PowerPoint through a self-hosted Stirling-PDF backend on Railway (LibreOffice + Tabula — no paid conversion API), a shared tool workspace UI with drag-and-drop uploads and processing overlays, and architecture ready for Supabase auth, Stripe billing, and OpenAI-powered AI tools. Deployed on Vercel with a separate Stirling-PDF Docker service on Railway for Office conversions.",
    url: "https://pdftoimg-steel.vercel.app/",
    tryUrl: "https://github.com/Anand-Anathur-Elangovan/pdftoimg",
    primaryCtaLabel: "Visit Live Site",
    // secondaryCtaLabel: "View on GitHub",
    color: "#ef4444",
    category: "SaaS · Web App · Document Tools · AI Platform",
    status: "Live",
    role: "Founder / Full-stack developer (in-house)",
    year: "2025–2026",
    video: "/video/aipdf.mp4",
    videoMeta: {
      title: "PDF AI Demo — 61+ Document & Image Tools",
      description:
        "See PDF AI in action: merge PDFs, convert to Word, compress images, and explore 61+ browser-first document tools with AI workflows.",
      uploadDate: "2026-07-05",
      thumbnailUrl: "/opengraph-image",
    },
    tags: ["Next.js", "React", "TypeScript", "Tailwind", "PDF", "SaaS", "AI", "Vercel", "Railway", "Docker", "Supabase", "Stripe"],
    features: [
      { name: "61 Tools", benefit: "32 PDF + 21 Image + 7 AI + Legal Vault in one platform" },
      { name: "Browser-first Privacy", benefit: "pdf-lib, pdf.js, canvas — files stay local when possible" },
      { name: "Real PDF Encrypt/Decrypt", benefit: "AES-256 via cryptpdf — not fake metadata-only protection" },
      { name: "Office Conversion", benefit: "PDF → DOCX / XLSX / PPTX via open-source Stirling-PDF on Railway" },
      { name: "Shared Workspace UI", benefit: "Drag-and-drop uploads, file previews, loaders, page picker" },
      { name: "Modern Stack", benefit: "Next.js 15 + React 19 + Tailwind — production on Vercel" },
      { name: "Monetization-ready", benefit: "Stripe webhooks, AI credits, Pro tier schema (Supabase)" },
      { name: "Legal Vault", benefit: "Browser-only metadata stripper for sensitive documents" },
    ],
    toolBreakdown: [
      { category: "PDF Tools", count: 32, summary: "Merge, Split, Rotate, Protect, Unlock, Watermark, PDF→Word/Excel/PPT, OCR, Redact, Sign, and more" },
      { category: "Image Tools", count: 21, summary: "Compress, Crop, Resize, AI Upscale, QR, Favicon, Collage, Remove Background, and more" },
      { category: "AI Tools", count: 7, summary: "Chat with PDF, Multi-Doc Synthesis, Semantic Search, Smart Redaction, Translate, Smart Form Fill" },
      { category: "Legal Vault", count: 1, summary: "Metadata stripper — browser-only, no server upload" },
    ],
    audience: [
      "Students & professionals — merge, split, and convert documents daily",
      "Small businesses — watermark, protect, and batch-process PDFs without subscriptions",
      "Legal & compliance teams — metadata stripping and redaction workflows",
      "Developers — open-source stack, self-hosted Stirling-PDF, GitHub repo",
      "Privacy-conscious users — browser-first processing avoids third-party uploads",
      "Teams needing Office conversion — PDF to Word/Excel/PowerPoint without paid APIs",
    ],
    howItWorks: [
      "Open pdftoimg-steel.vercel.app and pick a tool from the homepage grid.",
      "Drag-and-drop your file into the shared workspace UI.",
      "Processing runs in-browser (pdf-lib/pdf.js) or via API routes when needed.",
      "Office conversions route to Stirling-PDF on Railway (LibreOffice + Tabula).",
      "Download the result — no account required for most free tools.",
    ],
    pricing: [
      { plan: "Free", price: "$0", highlights: "61 tools, browser PDF/image processing, protect/unlock API, Office conversion" },
      { plan: "Pro", price: "Soon", highlights: "AI credits, Chat with PDF, Stripe billing — schema & routes ready" },
    ],
    techStack: [
      { label: "Frontend", value: "Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide icons" },
      { label: "PDF (browser)", value: "pdf-lib, pdf.js, jszip" },
      { label: "PDF (server)", value: "cryptpdf, node-qpdf2, Stirling-PDF HTTP API" },
      { label: "Backend services", value: "Supabase (auth/DB/pgvector), OpenAI API, Stripe" },
      { label: "Infrastructure", value: "Vercel (Next.js app), Railway (Stirling-PDF Docker)" },
      { label: "DevOps", value: "Docker Compose for local Stirling, GitHub CI-ready structure" },
    ],
    architecture:
      "Browser → Next.js (Vercel or localhost:3000) → API routes → Stirling-PDF on Railway for Office conversion. Separate deployments: (1) Next.js app at pdftoimg-steel.vercel.app (2) Stirling at pdftoimg-production-d52d.up.railway.app",
    differentiatorsTitle: "Why PDF AI",
    differentiators: [
      {
        vs: "iLovePDF / Smallpdf",
        points: ["Browser-first privacy", "Real AES encryption", "Self-hosted Office conversion — no paid API"],
      },
      {
        vs: "Desktop PDF apps",
        points: ["No install required", "61 tools in one tab", "Free tier with full tool access"],
      },
      {
        vs: "Basic online converters",
        points: ["AI document workflows", "Legal metadata stripper", "Production architecture on Vercel + Railway"],
      },
    ],
    completionNotes: {
      shipped: [
        "61 tools UI with shared workspace",
        "Browser PDF/image processing",
        "Protect/unlock API (AES-256)",
        "Stirling-PDF Office conversion",
        "Vercel deploy + Railway Stirling backend",
      ],
      phase2: [
        "Supabase auth login (schema ready)",
        "OpenAI keys for AI tools (routes exist)",
        "Stripe live billing (webhooks ready)",
      ],
    },
    links: [
      { label: "Visit Live Site", href: "https://pdftoimg-steel.vercel.app/" },
      { label: "GitHub", href: "https://github.com/Anand-Anathur-Elangovan/pdftoimg" },
      { label: "Stirling Backend", href: "https://pdftoimg-production-d52d.up.railway.app" },
    ],
    seoKeywords:
      "PDF tools, merge PDF, PDF to Word, image compressor, AI PDF chat, document converter, free PDF editor, PDF AI, iLovePDF alternative, Smallpdf alternative",
    ogDescription: "Processed in your browser when possible · Enterprise-grade AI features",
  },
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
