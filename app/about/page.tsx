import type { Metadata } from "next";
import About from "@/components/About";
import Capabilities from "@/components/Capabilities";
import Contact from "@/components/Contact";
import { about } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description: about.intro,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <main className="pt-20 md:pt-24">
        {about.image && (
          <div className="px-6 md:px-10">
            <div className="overflow-hidden rounded-2xl border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={about.image}
                alt="Isometric pixel-art developer workshop"
                className="max-h-[52vh] w-full object-cover"
              />
            </div>
          </div>
        )}
        <About />
        <Capabilities />
      </main>
      <Contact />
    </>
  );
}
