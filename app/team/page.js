import TeamPageClient from "./TeamPageClient";

export const metadata = {
  title: "Our Team — Meet the Developers & Designers",
  description: "Meet the talented team behind NexCraft Technologies. Expert designers, full-stack developers, and digital strategists building modern web experiences in Chennai, India.",
  alternates: { canonical: "https://nexcrafttech.com/team" },
  openGraph: {
    title: "Our Team — NexCraft Technologies",
    description: "Meet the talented team behind NexCraft Technologies. Expert developers and designers.",
    url: "https://nexcrafttech.com/team",
    type: "website",
  },
};

export default function TeamPage() {
  return <TeamPageClient />;
}
