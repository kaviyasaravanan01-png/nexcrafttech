import TeamPageClient from "./TeamPageClient";

export const metadata = {
  title: "Our Team — NexCraft Technologies",
  description: "Meet the talented team behind NexCraft Technologies. Designers, developers, and strategists building modern digital experiences.",
  openGraph: {
    title: "Our Team — NexCraft Technologies",
    description: "Meet the talented team behind NexCraft Technologies.",
  },
};

export default function TeamPage() {
  return <TeamPageClient />;
}
