"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsapConfig";
import { onPreloaderDone } from "@/lib/preloader";
import { site } from "@/lib/data";

const NAV = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

function useAnkaraTime() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Istanbul",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const time = useAnkaraTime();

  useGSAP(() => {
    const header = headerRef.current;
    if (!header) return;

    gsap.set(header, { yPercent: -100, autoAlpha: 0 });
    onPreloaderDone().then(() => {
      gsap.to(header, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.8,
        delay: 0.4,
        ease: "power3.out",
      });
    });

    ScrollTrigger.create({
      start: "top -80",
      onToggle: (self) => {
        header.classList.toggle("header-scrolled", self.isActive);
      },
    });
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 border-b border-transparent transition-colors duration-300 [&.header-scrolled]:border-line [&.header-scrolled]:bg-base/70 [&.header-scrolled]:backdrop-blur-md"
    >
      <div className="flex items-center justify-between px-6 py-4 md:px-10">
        <a
          id="site-brand"
          href="#top"
          className="display text-lg tracking-wide text-ink"
        >
          Oguz Tozkoparan<span className="text-acid">.</span>
        </a>

        <div className="label hidden text-dim md:block">
          Ankara, TR — {time}
        </div>

        <nav className="flex items-center gap-5 md:gap-7">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="link-sweep label hidden text-ink sm:inline-block"
            >
              {item.label}
            </a>
          ))}
          <a
            href={`mailto:${site.email}`}
            className="label rounded-full bg-acid px-4 py-2 text-base font-bold text-[#0e0f11] transition-transform duration-200 hover:scale-105"
          >
            Let&apos;s talk
          </a>
        </nav>
      </div>
    </header>
  );
}
