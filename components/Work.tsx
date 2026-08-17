"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsapConfig";
import { projects, type Project } from "@/lib/data";
import ProjectVisual from "@/components/ProjectVisual";

function ProjectCard({ project }: { project: Project }) {
  const inner = (
    <>
      <div className="relative aspect-[3/2] overflow-hidden">
        {project.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={`${project.title} artwork`}
            loading="lazy"
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
          <h3 className="display text-3xl text-ink md:text-4xl">
            {project.title}
          </h3>
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
            <span
              aria-hidden="true"
              className="display text-2xl text-acid transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            >
              ↗
            </span>
          )}
        </div>
      </div>
    </>
  );

  const className =
    "group flex h-full w-[85vw] shrink-0 flex-col overflow-hidden rounded-2xl border border-line bg-card transition-colors duration-300 hover:border-acid/50 sm:w-[70vw] lg:w-[42vw] lg:max-w-[640px]";

  const external = project.href?.startsWith("http");

  return project.href ? (
    <a
      href={project.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={className}
      data-work-card
    >
      {inner}
    </a>
  ) : (
    <div className={className} data-work-card>
      {inner}
    </div>
  );
}

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const mm = gsap.matchMedia();

      // desktop: pinned horizontal scroll
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const getDistance = () => track.scrollWidth - window.innerWidth;

          gsap.to(track, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => "+=" + getDistance(),
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              anticipatePin: 1,
              onUpdate: (self) => {
                if (progressRef.current) {
                  progressRef.current.style.transform = `scaleX(${self.progress})`;
                }
              },
            },
          });
        }
      );

      // mobile / reduced motion: simple card reveals
      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.utils.toArray<HTMLElement>("[data-work-card]").forEach((card) => {
            gsap.from(card, {
              y: 48,
              autoAlpha: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                once: true,
              },
            });
          });
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative overflow-hidden py-24 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0"
    >
      <div
        ref={trackRef}
        className="flex w-full flex-col gap-6 px-6 lg:w-max lg:flex-row lg:items-stretch lg:gap-8 lg:px-[6vw] lg:[&>*]:h-[72vh] lg:[&>*]:max-h-[720px]"
      >
        <div className="flex shrink-0 flex-col justify-between pb-10 lg:w-[36vw] lg:pb-0">
          <p className="label text-dim">
            <span className="text-acid">02</span> / Selected work
          </p>
          <div>
            <h2 className="display text-6xl text-ink md:text-8xl lg:text-[7.5vw]">
              Selected
              <br />
              <span className="text-acid">Work</span>
            </h2>
            <p className="label mt-6 text-dim">
              ({String(projects.length).padStart(2, "0")}) projects
              <span className="hidden lg:inline"> — drag your scroll</span>
            </p>
          </div>
        </div>

        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <div className="absolute inset-x-6 bottom-8 hidden h-px bg-line lg:block">
        <div
          ref={progressRef}
          className="h-full origin-left scale-x-0 bg-acid"
        />
      </div>
    </section>
  );
}
