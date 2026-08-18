import type { Metadata } from "next";
import About from "@/components/About";
import AboutVideo from "@/components/AboutVideo";
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
              <AboutVideo
                src="/videos/about-loop.mp4"
                poster={about.image}
                alt="Ambient dark-fantasy scene of a hooded figure at a desk of glowing monitors"
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
