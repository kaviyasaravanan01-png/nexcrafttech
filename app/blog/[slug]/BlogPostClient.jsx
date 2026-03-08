"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

function renderMarkdown(content) {
  const lines = content.trim().split("\n");
  const elements = [];
  let inTable = false;
  let tableRows = [];
  let inList = false;
  let listItems = [];
  let listType = "ul";

  function flushTable() {
    if (tableRows.length < 2) return;
    const headers = tableRows[0];
    const dataRows = tableRows.slice(2); // skip separator row
    elements.push(
      <div key={`table-${elements.length}`} style={{ overflowX: "auto", margin: "1.25rem 0" }}>
        <table style={{
          width: "100%", borderCollapse: "collapse", fontSize: 12.5,
          border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
        }}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} style={{
                  padding: "8px 12px", textAlign: "left", fontWeight: 700,
                  color: "#c9a96e", borderBottom: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(201,169,110,0.06)", fontSize: 11,
                  letterSpacing: "0.04em", textTransform: "uppercase",
                }}>
                  {h.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{
                    padding: "7px 12px", color: "rgba(255,255,255,0.55)",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}>
                    {cell.trim()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
  }

  function flushList() {
    if (listItems.length === 0) return;
    const Tag = listType;
    elements.push(
      <Tag key={`list-${elements.length}`} style={{
        paddingLeft: "1.25rem", margin: "0.75rem 0",
        display: "flex", flexDirection: "column", gap: 6,
      }}>
        {listItems.map((item, i) => (
          <li key={i} style={{
            fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.55)",
            paddingLeft: 4,
          }}>
            {renderInline(item)}
          </li>
        ))}
      </Tag>
    );
    listItems = [];
    inList = false;
  }

  function renderInline(text) {
    // Bold, italic, inline code, links
    const parts = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Bold
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      // Inline code
      const codeMatch = remaining.match(/`(.+?)`/);
      // Links
      const linkMatch = remaining.match(/\[(.+?)\]\((.+?)\)/);

      const matches = [
        boldMatch && { type: "bold", index: boldMatch.index, match: boldMatch },
        codeMatch && { type: "code", index: codeMatch.index, match: codeMatch },
        linkMatch && { type: "link", index: linkMatch.index, match: linkMatch },
      ].filter(Boolean).sort((a, b) => a.index - b.index);

      if (matches.length === 0) {
        parts.push(remaining);
        break;
      }

      const first = matches[0];
      if (first.index > 0) {
        parts.push(remaining.substring(0, first.index));
      }

      if (first.type === "bold") {
        parts.push(<strong key={key++} style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{first.match[1]}</strong>);
        remaining = remaining.substring(first.index + first.match[0].length);
      } else if (first.type === "code") {
        parts.push(
          <code key={key++} style={{
            padding: "2px 6px", borderRadius: 4, fontSize: 12,
            background: "rgba(255,255,255,0.06)", color: "#c9a96e",
            fontFamily: "var(--font-mono)",
          }}>
            {first.match[1]}
          </code>
        );
        remaining = remaining.substring(first.index + first.match[0].length);
      } else if (first.type === "link") {
        parts.push(
          <Link key={key++} href={first.match[2]} style={{ color: "#c9a96e", textDecoration: "underline", textUnderlineOffset: 2 }}>
            {first.match[1]}
          </Link>
        );
        remaining = remaining.substring(first.index + first.match[0].length);
      }
    }

    return parts;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Table detection
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      if (!inTable) { flushList(); inTable = true; }
      const cells = trimmed.split("|").filter((c) => c.trim() !== "");
      if (cells.every((c) => /^[-:\s]+$/.test(c.trim()))) {
        tableRows.push(cells); // separator row
        continue;
      }
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // List items
    if (/^[-*]\s+/.test(trimmed)) {
      if (!inList) { inList = true; listType = "ul"; }
      listItems.push(trimmed.replace(/^[-*]\s+/, ""));
      continue;
    } else if (/^\d+\.\s+/.test(trimmed)) {
      if (!inList) { inList = true; listType = "ol"; }
      listItems.push(trimmed.replace(/^\d+\.\s+/, ""));
      continue;
    } else if (inList) {
      flushList();
    }

    // Empty line
    if (trimmed === "") continue;

    // Headings
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} style={{
          fontSize: 16, fontWeight: 700, color: "#fff",
          marginTop: "2rem", marginBottom: "0.5rem", letterSpacing: "-0.01em",
        }}>
          {renderInline(trimmed.replace("### ", ""))}
        </h3>
      );
    } else if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${i}`} style={{
          fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em",
          marginTop: "2.5rem", marginBottom: "0.75rem",
          background: "linear-gradient(135deg, #e8d5b0, #c9a96e)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          {trimmed.replace("## ", "")}
        </h2>
      );
    } else {
      // Paragraph
      elements.push(
        <p key={`p-${i}`} style={{
          fontSize: 13.5, lineHeight: 1.8, color: "rgba(255,255,255,0.55)",
          margin: "0.75rem 0",
        }}>
          {renderInline(trimmed)}
        </p>
      );
    }
  }

  flushTable();
  flushList();

  return elements;
}

export default function BlogPostClient({ post }) {
  const pageRef = useRef(null);

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".article-line", { scaleX: 0 }, {
        scaleX: 1, duration: 1.2, ease: "power2.out",
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: "NexCraft Technologies" },
    publisher: { "@type": "Organization", name: "NexCraft Technologies" },
  };

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      year: "numeric", month: "long", day: "numeric",
    });
  }

  return (
    <div ref={pageRef} style={{ minHeight: "100vh", paddingTop: "6rem", paddingBottom: "4rem" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <div style={{ maxWidth: "46rem", margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Back link */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/blog" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none",
            marginBottom: "2rem", transition: "color 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#c9a96e")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            All Articles
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0, 1] }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem", flexWrap: "wrap" }}>
            <span style={{
              padding: "4px 12px", borderRadius: 100, fontSize: 10, fontWeight: 600,
              color: post.color, background: `${post.color}15`, border: `1px solid ${post.color}30`,
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}>
              {post.category}
            </span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
              {formatDate(post.date)}
            </span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
              · {post.readTime} read
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
            fontWeight: 800, letterSpacing: "-0.03em",
            lineHeight: 1.2, marginBottom: "1rem",
          }}>
            {post.title}
          </h1>

          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            {post.excerpt}
          </p>

          <div className="article-line" style={{
            width: "100%", height: 1, transformOrigin: "left",
            background: "linear-gradient(90deg, rgba(201,169,110,0.4), transparent)",
            marginBottom: "2rem",
          }} />
        </motion.div>

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {renderMarkdown(post.content)}
        </motion.article>

        {/* Author + CTA */}
        <div style={{
          marginTop: "3rem", paddingTop: "2rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{
            padding: "1.5rem", borderRadius: 14,
            background: "linear-gradient(145deg, rgba(201,169,110,0.06), rgba(201,169,110,0.02))",
            border: "1px solid rgba(201,169,110,0.12)",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#c9a96e", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              Written by NexCraft Technologies
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: "1rem", lineHeight: 1.6 }}>
              We build fast, modern websites and AI-powered solutions for growing businesses.
            </p>
            <Link
              href="/#contact"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "10px 22px", borderRadius: 100,
                background: "linear-gradient(135deg, #c9a96e, #d4b883)",
                color: "#09090b", fontSize: 12, fontWeight: 700,
                letterSpacing: "0.06em", textTransform: "uppercase",
                textDecoration: "none", boxShadow: "0 4px 16px rgba(201,169,110,0.25)",
              }}
            >
              Start a Project
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
