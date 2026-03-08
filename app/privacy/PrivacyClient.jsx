"use client";

import { motion } from "framer-motion";

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly, including your name, email address, phone number, and project details when you fill out our contact form or engage our services. We also collect usage data such as browser type, pages visited, and time spent on our website through analytics tools.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `Your information is used to respond to inquiries, deliver services, communicate project updates, send relevant marketing communications (with your consent), improve our website experience, and comply with legal obligations.`,
  },
  {
    title: "3. Data Storage & Security",
    content: `We use Supabase for secure data storage, which employs industry-standard encryption and security protocols. All data transmissions are encrypted via SSL/TLS. We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, or destruction.`,
  },
  {
    title: "4. Third-Party Services",
    content: `We may use third-party services for analytics (Google Analytics), hosting (Vercel), and communication (email services). These providers have their own privacy policies governing the use of your information. We do not sell, trade, or rent your personal information to third parties.`,
  },
  {
    title: "5. Cookies & Tracking",
    content: `Our website uses essential cookies for functionality and analytical cookies to understand visitor behavior. You can control cookie preferences through your browser settings. Disabling cookies may affect some features of our website.`,
  },
  {
    title: "6. Your Rights",
    content: `You have the right to access, correct, or delete your personal data. You may also request data portability or object to processing. To exercise any of these rights, contact us at nexcrafttech@gmail.com. We will respond to your request within 30 days.`,
  },
  {
    title: "7. Data Retention",
    content: `We retain personal data only as long as necessary for the purposes outlined in this policy. Project-related data is retained for 3 years after project completion for legal and business continuity purposes. Contact form submissions are retained for 1 year.`,
  },
  {
    title: "8. Children's Privacy",
    content: `Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we learn we have collected data from a child, we will delete that information promptly.`,
  },
  {
    title: "9. International Data Transfers",
    content: `As a remote-first company based in India, data may be processed in various locations. We ensure that appropriate safeguards are in place for any international data transfers to maintain the protection standards outlined in this policy.`,
  },
  {
    title: "10. Changes to This Policy",
    content: `We may update this Privacy Policy periodically. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy regularly. Continued use of our services after changes constitutes acceptance of the updated policy.`,
  },
];

export default function PrivacyClient() {
  return (
    <section style={{ minHeight: "100vh", paddingTop: "8rem", paddingBottom: "5rem", background: "#09090b" }}>
      <div style={{ maxWidth: "48rem", marginLeft: "auto", marginRight: "auto", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0, 1] }}
        >
          <h1 style={{
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "#fff", marginBottom: "0.5rem",
          }}>
            Privacy{" "}
            <span style={{ background: "linear-gradient(135deg, #c9a96e, #e8d5b0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Policy
            </span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: "0.5rem" }}>
            Last updated: March 1, 2026
          </p>
          <div style={{ width: 48, height: 2, background: "linear-gradient(90deg, #c9a96e, #d4b883)", borderRadius: 1, marginBottom: "1.5rem" }} />
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8, marginBottom: "2.5rem" }}>
            At NexCraft Technologies, we respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and safeguard your information when you interact with our website and services.
          </p>
        </motion.div>

        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
            style={{ marginBottom: "2rem" }}
          >
            <h2 style={{ fontSize: 17, fontWeight: 600, color: "#e8d5b0", marginBottom: "0.5rem" }}>
              {section.title}
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
              {section.content}
            </p>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            marginTop: "3rem", padding: "1.25rem", borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.06)", background: "rgba(17,17,20,0.5)",
          }}
        >
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
            For privacy-related inquiries, contact our Data Protection Officer at{" "}
            <a href="mailto:nexcrafttech@gmail.com" style={{ color: "#c9a96e", textDecoration: "none" }}>
              nexcrafttech@gmail.com
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
