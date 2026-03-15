"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });
const WhatsAppButton = dynamic(() => import("@/components/WhatsAppButton"), { ssr: false });
const Chatbot = dynamic(() => import("@/components/Chatbot"), { ssr: false });
const SplashScreen = dynamic(() => import("@/components/SplashScreen"), { ssr: false });

export default function ClientExtras() {
  return (
    <>
      <CustomCursor />
      <SplashScreen />
      <WhatsAppButton />
      <Chatbot />
    </>
  );
}
