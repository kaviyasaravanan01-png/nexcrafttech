"use client";

import { motion } from "framer-motion";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing and using NexCraft Technologies' website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree, please discontinue use of our services immediately.`,
  },
  {
    title: "2. Services Provided",
    content: `NexCraft Technologies offers website development, AI chatbot development, SEO & digital marketing, app development, and ongoing maintenance services. Specific deliverables, timelines, and pricing are outlined in individual project proposals and are subject to mutual agreement.`,
  },
  {
    title: "3. Client Responsibilities",
    content: `Clients are responsible for providing accurate information, timely feedback, and any required content (text, images, branding materials) necessary for project completion. Delays in providing materials may affect project timelines.`,
  },
  {
    title: "4. Payment Terms",
    content: `Payment terms are specified in individual project agreements. Typically, a 50% advance is required before project commencement, with the remaining balance due upon delivery. All prices are quoted in INR unless otherwise specified. Late payments may incur additional charges.`,
  },
  {
    title: "5. Intellectual Property",
    content: `Upon full payment, the client receives ownership of the final deliverables including source code, designs, and content created specifically for the project. NexCraft Technologies retains the right to showcase the project in our portfolio unless otherwise agreed in writing.`,
  },
  {
    title: "6. Revisions & Scope Changes",
    content: `Each project includes a defined number of revision rounds as specified in the proposal. Additional revisions or scope changes beyond the original agreement may incur extra charges and timeline adjustments, which will be communicated and agreed upon in advance.`,
  },
  {
    title: "7. Confidentiality",
    content: `Both parties agree to maintain confidentiality of proprietary information shared during the engagement. This includes business strategies, technical specifications, and any sensitive data. This obligation survives the termination of any agreement.`,
  },
  {
    title: "8. Limitation of Liability",
    content: `NexCraft Technologies shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid for the specific service in question.`,
  },
  {
    title: "9. Termination",
    content: `Either party may terminate a project with 14 days' written notice. In the event of early termination, the client is responsible for payment of work completed to date. Any deposits paid are non-refundable once work has commenced.`,
  },
  {
    title: "10. Governing Law",
    content: `These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in India.`,
  },
  {
    title: "11. Changes to Terms",
    content: `NexCraft Technologies reserves the right to modify these terms at any time. Changes will be effective immediately upon posting to our website. Continued use of our services constitutes acceptance of any modified terms.`,
  },
];

export default function TermsClient() {
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
            Terms of{" "}
            <span style={{ background: "linear-gradient(135deg, #c9a96e, #e8d5b0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Service
            </span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: "0.5rem" }}>
            Last updated: March 1, 2026
          </p>
          <div style={{ width: 48, height: 2, background: "linear-gradient(90deg, #c9a96e, #d4b883)", borderRadius: 1, marginBottom: "2.5rem" }} />
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
            If you have any questions about these terms, please contact us at{" "}
            <a href="mailto:nexcrafttech@gmail.com" style={{ color: "#c9a96e", textDecoration: "none" }}>
              nexcrafttech@gmail.com
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
