"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COMPANY_INFO = {
  name: "NexCraft Technologies",
  email: "nexcrafttech@gmail.com",
  website: "nexcrafttech.com",
  location: "India (Remote-first)",
  response_time: "4 hours average",
  whatsapp: "+91 98765 43210",
};

const SERVICES = [
  { name: "Website Development", price: "From ₹6,000", desc: "Fast, responsive websites — landing pages to full eCommerce." },
  { name: "SEO & Marketing", price: "From ₹3,000/mo", desc: "Get found on Google. Ads, SEO, and content that drives traffic." },
  { name: "AI Chatbots", price: "From ₹5,000", desc: "WhatsApp & website bots that automate support and generate leads." },
  { name: "Cloud & AI Solutions", price: "From ₹40,000", desc: "Cloud infra, data pipelines, and AI-powered workflows." },
  { name: "App Development", price: "From ₹10,000", desc: "Cross-platform mobile apps with modern UI/UX." },
  { name: "Maintenance & Support", price: "From ₹2,000/mo", desc: "Monthly updates, security patches, and performance monitoring." },
];

const PRICING = [
  { name: "Starter", price: "₹6,000 (one-time)", features: "Up to 5 pages, mobile responsive, basic SEO, contact form, 1 month support" },
  { name: "Growth", price: "₹14,000 (one-time)", features: "Up to 15 pages, custom design & animations, CMS, advanced SEO, 3 months support, WhatsApp integration" },
  { name: "Enterprise", price: "₹29,000+ (project-based)", features: "Unlimited pages, AI chatbot, custom cloud backend, eCommerce/SaaS, 12 months priority support, dedicated PM" },
];

const QUICK_REPLIES = [
  "What services do you offer?",
  "What are your pricing plans?",
  "How can I contact you?",
  "Tell me about your company",
];

function getResponse(input) {
  const q = input.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|hii|hola|namaste|good\s?(morning|evening|afternoon))/.test(q)) {
    return `Hello! 👋 Welcome to NexCraft Technologies. How can I help you today?\n\nYou can ask me about:\n• Our services\n• Pricing plans\n• How to contact us\n• Our portfolio`;
  }

  // Services
  if (/service|what (do|can) you (do|offer)|offerings|solutions/.test(q)) {
    let msg = "We offer these services:\n\n";
    SERVICES.forEach((s) => {
      msg += `🔹 **${s.name}** — ${s.price}\n   ${s.desc}\n\n`;
    });
    msg += "Want to know more about any specific service? Just ask!";
    return msg;
  }

  // Individual services
  if (/website|web\s?dev|landing\s?page|ecommerce|e-commerce/.test(q)) {
    return `🌐 **Website Development** — From ₹6,000\n\nWe build fast, responsive websites from landing pages to full eCommerce stores using Next.js, React, and modern tech.\n\nIncludes: Custom design, mobile responsive, SEO-ready, fast loading.\n\n👉 Want a free quote? Contact us at ${COMPANY_INFO.email}`;
  }
  if (/seo|marketing|google|ads|traffic|digital marketing/.test(q)) {
    return `📈 **SEO & Digital Marketing** — From ₹4,000/mo\n\nGet found on Google with our SEO, content marketing, and paid ads management.\n\nIncludes: Keyword research, on-page/off-page SEO, Google Ads, analytics.\n\n👉 Contact: ${COMPANY_INFO.email}`;
  }
  if (/chatbot|bot|whatsapp bot|ai bot|automation/.test(q)) {
    return `🤖 **AI Chatbots** — From ₹5,000\n\nWe build WhatsApp & website chatbots that automate customer support and generate leads 24/7.\n\nIncludes: Custom training, multi-language, CRM integration.\n\n👉 Contact: ${COMPANY_INFO.email}`;
  }
  if (/cloud|ai solution|gcp|aws|data|pipeline/.test(q)) {
    return `☁️ **Cloud & AI Solutions** — From ₹15,000\n\nCloud infrastructure, data pipelines, and AI-powered workflows on GCP/AWS.\n\n👉 Contact: ${COMPANY_INFO.email}`;
  }
  if (/app|mobile|android|ios|react native|flutter/.test(q)) {
    return `📱 **App Development** — From ₹10,000\n\nCross-platform mobile apps with modern UI/UX using React Native.\n\n👉 Contact: ${COMPANY_INFO.email}`;
  }
  if (/maintenance|support|update|bug|fix/.test(q)) {
    return `🔧 **Maintenance & Support** — From ₹2,000/mo\n\nMonthly updates, security patches, performance monitoring, and priority bug fixes.\n\n👉 Contact: ${COMPANY_INFO.email}`;
  }

  // Pricing
  if (/pric|cost|how much|rate|package|plan|budget|quote|affordable|cheap|expensive/.test(q)) {
    let msg = "💰 Our pricing plans:\n\n";
    PRICING.forEach((p) => {
      msg += `📋 **${p.name}** — ${p.price}\n   ${p.features}\n\n`;
    });
    msg += `Need a custom quote? Email us at ${COMPANY_INFO.email} or use the contact form on our website!`;
    return msg;
  }

  // Contact
  if (/contact|reach|email|phone|call|talk|connect|get in touch/.test(q)) {
    return `📬 Here's how to reach us:\n\n📧 Email: ${COMPANY_INFO.email}\n🌐 Website: ${COMPANY_INFO.website}\n📍 Location: ${COMPANY_INFO.location}\n⏱ Avg. response: ${COMPANY_INFO.response_time}\n\nYou can also fill out the contact form on our website, or click the WhatsApp icon on the left to chat directly!`;
  }

  // About / Company
  if (/about|company|who are you|tell me|nexcraft|your team|founded/.test(q)) {
    return `🏢 **NexCraft Technologies**\n\nWe're a remote-first tech agency based in India. We build websites, AI chatbots, and digital products for businesses that want to grow.\n\n✅ Transparent pricing — no hidden fees\n✅ Fast delivery\n✅ Small team, big results\n✅ 24/7 support\n\nWe've built projects for clients in Australia, India, and globally. Check out our portfolio section!`;
  }

  // Portfolio
  if (/portfolio|project|work|case study|example|client/.test(q)) {
    return `🎨 Some of our recent projects:\n\n• **SpaceCrafts** — Interactive website with modern animations\n• **Living Fire Australia** — Premium eCommerce for fireplaces\n• **Blendora Collections** — Fashion storefront\n• **Previzz** — SaaS pre-visualization platform\n• **Spark Metal Fabrications** — Industrial services website\n• **Able Interiors Digital** — Interior design studio\n\nScroll to the Portfolio section to see them, or visit our website!`;
  }

  // Process
  if (/process|how do you work|workflow|steps|how it works/.test(q)) {
    return `⚙️ Our process:\n\n1️⃣ **Discovery** — Understand your goals & requirements\n2️⃣ **Design** — Create wireframes & visual mockups\n3️⃣ **Develop** — Build with clean, modern code\n4️⃣ **Launch** — Deploy, test & go live\n\nWe keep you in the loop at every step!`;
  }

  // Timeline
  if (/time|how long|duration|deadline|delivery|timeline|days|weeks/.test(q)) {
    return `⏰ Typical timelines:\n\n• Landing page: 3-5 days\n• Full website (5 pages): 1-2 weeks\n• eCommerce / complex: 3-4 weeks\n• AI Chatbot: 1-2 weeks\n• App development: 4-8 weeks\n\nTimelines depend on project scope. Contact us for an accurate estimate!`;
  }

  // Technology
  if (/tech|stack|technology|framework|language|next\.?js|react|node/.test(q)) {
    return `💻 Our tech stack:\n\n• **Frontend:** Next.js, React, Tailwind CSS, Framer Motion\n• **Backend:** Node.js, Supabase, Firebase\n• **AI/ML:** OpenAI, LangChain, Python\n• **Cloud:** GCP, Vercel, AWS\n• **Mobile:** React Native\n\nWe pick the best tools for each project!`;
  }

  // Thank you
  if (/thank|thanks|thx|appreciate/.test(q)) {
    return `You're welcome! 😊 If you have any other questions, feel free to ask. We're here to help!\n\n👉 Or reach us at ${COMPANY_INFO.email}`;
  }

  // Bye
  if (/bye|goodbye|see you|later|cya/.test(q)) {
    return `Goodbye! 👋 Thanks for chatting with us. Feel free to come back anytime.\n\nReach us at ${COMPANY_INFO.email} if you need anything!`;
  }

  // Default
  return `I appreciate your question! While I may not have a specific answer for that, I can help you with:\n\n• Our **services** & **pricing**\n• **Contact** information\n• **Portfolio** & past work\n• **Technology** stack\n• **Project timelines**\n\nOr you can reach our team directly at ${COMPANY_INFO.email} — we respond within 4 hours! 🚀`;
}

function formatMessage(text) {
  return text.split("\n").map((line, i) => {
    const formatted = line
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
    return <span key={i} dangerouslySetInnerHTML={{ __html: formatted + (i < text.split("\n").length - 1 ? "<br/>" : "") }} />;
  });
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi there! 👋 I'm NexBot, your assistant at NexCraft Technologies. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [visible, setVisible] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (text) => {
    const msg = text || input.trim();
    if (!msg) return;

    setMessages((prev) => [...prev, { from: "user", text: msg }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(msg);
      setMessages((prev) => [...prev, { from: "bot", text: response }]);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Chat toggle button — right side */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chatbot"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 50,
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #c9a96e, #d4b883)",
          boxShadow: "0 4px 20px rgba(201,169,110,0.4)",
          transition: "transform 0.3s, box-shadow 0.3s",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#09090b" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18" /><path d="M6 6l12 12" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#09090b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <circle cx="9" cy="10" r="1" fill="#09090b" />
            <circle cx="12" cy="10" r="1" fill="#09090b" />
            <circle cx="15" cy="10" r="1" fill="#09090b" />
          </svg>
        )}
      </motion.button>

      {/* Notification dot */}
      <AnimatePresence>
        {!isOpen && messages.length <= 1 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            style={{
              position: "fixed",
              bottom: 68,
              right: 24,
              zIndex: 51,
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#ef4444",
              border: "2px solid #09090b",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0, 1] }}
            className="chatbot-window"
            style={{
              position: "fixed",
              bottom: 92,
              right: 24,
              zIndex: 50,
              width: 360,
              maxHeight: 520,
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "#0d0d10",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(201,169,110,0.06)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "14px 16px",
                background: "linear-gradient(135deg, rgba(201,169,110,0.1), rgba(201,169,110,0.03))",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(201,169,110,0.1)",
                  border: "1px solid rgba(201,169,110,0.2)",
                  flexShrink: 0,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 21 21" fill="none">
                  <path d="M2 10.5L7.5 2L13 10.5L7.5 19L2 10.5Z" fill="url(#cg1)" />
                  <path d="M9 10.5L14.5 2L20 10.5L14.5 19L9 10.5Z" fill="url(#cg2)" />
                  <defs>
                    <linearGradient id="cg1" x1="2" y1="2" x2="13" y2="19" gradientUnits="userSpaceOnUse"><stop stopColor="#e8d5b0" /><stop offset="1" stopColor="#c9a96e" /></linearGradient>
                    <linearGradient id="cg2" x1="9" y1="2" x2="20" y2="19" gradientUnits="userSpaceOnUse"><stop stopColor="#c9a96e" stopOpacity="0.6" /><stop offset="1" stopColor="#c9a96e" stopOpacity="0.18" /></linearGradient>
                  </defs>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#ffffff" }}>NexBot</div>
                <div style={{ fontSize: 10, color: "rgba(201,169,110,0.7)", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
                  Online
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.3)",
                  padding: 4,
                  display: "flex",
                  transition: "color 0.2s",
                }}
                aria-label="Close chat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                minHeight: 0,
              }}
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    display: "flex",
                    justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "85%",
                      padding: "10px 14px",
                      borderRadius: msg.from === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                      fontSize: 13,
                      lineHeight: 1.6,
                      background:
                        msg.from === "user"
                          ? "linear-gradient(135deg, #c9a96e, #d4b883)"
                          : "rgba(255,255,255,0.05)",
                      color: msg.from === "user" ? "#09090b" : "rgba(255,255,255,0.75)",
                      border: msg.from === "user" ? "none" : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {formatMessage(msg.text)}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: "flex", justifyContent: "flex-start" }}
                >
                  <div
                    style={{
                      padding: "10px 18px",
                      borderRadius: "14px 14px 14px 4px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      display: "flex",
                      gap: 5,
                      alignItems: "center",
                    }}
                  >
                    {[0, 1, 2].map((j) => (
                      <motion.span
                        key={j}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: j * 0.15 }}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "rgba(201,169,110,0.5)",
                          display: "block",
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            {messages.length <= 1 && (
              <div
                style={{
                  padding: "0 14px 8px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                }}
              >
                {QUICK_REPLIES.map((qr) => (
                  <button
                    key={qr}
                    onClick={() => handleSend(qr)}
                    className="chatbot-quick-reply"
                    style={{
                      padding: "5px 10px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 500,
                      background: "rgba(201,169,110,0.06)",
                      border: "1px solid rgba(201,169,110,0.15)",
                      color: "rgba(201,169,110,0.7)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div
              style={{
                padding: "10px 14px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexShrink: 0,
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="chatbot-input"
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.03)",
                  color: "#ffffff",
                  fontSize: 13,
                  outline: "none",
                  transition: "border-color 0.3s",
                }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  border: "none",
                  cursor: input.trim() ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: input.trim()
                    ? "linear-gradient(135deg, #c9a96e, #d4b883)"
                    : "rgba(255,255,255,0.04)",
                  transition: "all 0.3s",
                  flexShrink: 0,
                }}
                aria-label="Send message"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={input.trim() ? "#09090b" : "rgba(255,255,255,0.2)"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m22 2-7 20-4-9-9-4z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .chatbot-window::-webkit-scrollbar {
          width: 4px;
        }
        .chatbot-window::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 2px;
        }
        .chatbot-input:focus {
          border-color: rgba(201, 169, 110, 0.3) !important;
        }
        .chatbot-input::placeholder {
          color: rgba(255, 255, 255, 0.18);
        }
        .chatbot-quick-reply:hover {
          background: rgba(201, 169, 110, 0.12) !important;
          border-color: rgba(201, 169, 110, 0.3) !important;
          color: #c9a96e !important;
        }
        @media (max-width: 480px) {
          .chatbot-window {
            width: calc(100vw - 48px) !important;
            right: 24px !important;
            bottom: 84px !important;
            max-height: 70vh !important;
          }
        }
      `}</style>
    </>
  );
}
