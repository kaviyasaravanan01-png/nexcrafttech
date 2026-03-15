import PrivacyClient from "./PrivacyClient";

export const metadata = {
  title: "Privacy Policy — NexCraft Technologies",
  description: "Learn how NexCraft Technologies collects, uses, and protects your personal information. Our commitment to your privacy and data security.",
  alternates: { canonical: "https://nexcrafttech.com/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
