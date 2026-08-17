import type { Metadata } from "next";
import Contact from "@/components/Contact";
import { site } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} — open to interesting projects and collaborations, remote or in Ankara.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="flex min-h-svh flex-col justify-end">
      <Contact />
    </main>
  );
}
