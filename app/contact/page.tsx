import type { Metadata } from "next";
import Contact from "@/components/Contact";
import ContactActions from "@/components/ContactActions";
import { capabilities, site } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} — open to interesting projects and collaborations, remote or in Ankara.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <main className="px-6 pt-32 md:px-10 md:pt-40">
        <p className="label flex items-center gap-3 text-dim">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-acid" />
          Available for new projects
        </p>
        <h1 className="display mt-6 text-6xl text-ink md:text-8xl">
          Get in
          <br />
          <span className="text-acid">Touch</span>
        </h1>
        <p className="mt-6 max-w-md text-dim">
          Have an idea, a product or an experiment in mind? Tell me about it —
          I read everything and reply fast.
        </p>

        <div className="mt-10">
          <ContactActions />
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
          {[
            { k: "Response time", v: "< 24 hours" },
            { k: "Timezone", v: "UTC+3" },
            { k: "Based in", v: "Ankara, TR" },
          ].map((fact) => (
            <div key={fact.k} className="bg-panel px-6 py-6">
              <p className="label text-dim">{fact.k}</p>
              <p className="display mt-3 text-2xl text-ink md:text-3xl">
                {fact.v}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <p className="label mb-5 text-dim">What I can help with</p>
          <div className="flex flex-wrap gap-2">
            {capabilities.flatMap((cap) =>
              cap.items.map((item) => (
                <span
                  key={`${cap.index}-${item}`}
                  className="label rounded-full border border-line px-4 py-2 text-dim"
                >
                  {item}
                </span>
              ))
            )}
          </div>
        </div>
      </main>
      <Contact />
    </>
  );
}
