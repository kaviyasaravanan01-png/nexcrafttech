"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientExtras from "@/components/ClientExtras";
import PageTransition from "@/components/PageTransition";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import SearchProvider from "@/components/SearchProvider";

// Paths that render their own full-screen layout (no NexCraft nav/footer)
const DASHBOARD_PREFIXES = ["/whatsapp-crm"];

export default function ClientShell({ children }) {
  const pathname = usePathname();
  const isDashboard = DASHBOARD_PREFIXES.some((p) => pathname?.startsWith(p));

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <ClientExtras />
      <ScrollProgress />
      <Navbar />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <BackToTop />
      <SearchProvider />
    </>
  );
}
