import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Contact from "@/components/Contact";
import ProjectVisual from "@/components/ProjectVisual";
import { projects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects by Oguz Tozkoparan — web experiences, interactive experiments and tooling.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <main className="px-6 pt-32 md:px-10 md:pt-40">
        <p className="label text-dim">
          <span className="text-acid">Work</span> /{" "}
          {String(projects.length).padStart(2, "0")} projects
        </p>
        <h1 className="display mt-6 text-6xl text-ink md:text-8xl">
          Selected
          <br />
          <span className="text-acid">Work</span>
        </h1>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {projects.map((project) => {
            const inner = (
              <>
                <div className="relative aspect-[3/2] overflow-hidden">
                  {project.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.image}
                      alt={`${project.title} artwork`}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <ProjectVisual id={project.id} />
                  )}
                  <span className="label absolute left-4 top-4 rounded-full border border-line bg-void/60 px-3 py-1.5 text-ink backdrop-blur-sm">
                    {project.status}
                  </span>
                </div>
                <div className="flex grow flex-col gap-4 border-t border-line p-6 md:p-7">
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="display text-3xl text-ink md:text-4xl">
                      {project.title}
                    </h2>
                    <span className="label text-acid">{project.index}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-ink/75 md:text-base">
                    {project.description}
                  </p>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="label rounded-full border border-line px-3 py-1.5 text-dim"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {project.href && (
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-6 w-6 shrink-0 text-acid transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      />
                    )}
                  </div>
                </div>
              </>
            );

            const className =
              "group flex flex-col overflow-hidden rounded-2xl border border-line bg-card transition-colors duration-300 hover:border-acid/50";

            const external = project.href?.startsWith("http");

            return project.href ? (
              <a
                key={project.id}
                href={project.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className={className}
              >
                {inner}
              </a>
            ) : (
              <div key={project.id} className={className}>
                {inner}
              </div>
            );
          })}
        </div>
      </main>
      <Contact />
    </>
  );
}
