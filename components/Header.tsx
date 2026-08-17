"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsapConfig";
import { onPreloaderDone } from "@/lib/preloader";
import { site, socials } from "@/lib/data";
import SoundControl from "@/components/SoundControl";

const LINKS = [
  { index: "01", label: "Home", href: "/" },
  { index: "02", label: "Work", href: "/work" },
  { index: "03", label: "About", href: "/about" },
  { index: "04", label: "Blog", href: "/blog" },
  { index: "05", label: "Contact", href: "/contact" },
];

const EXTRAS = [
  { label: "DOS Terminal", href: "/dos" },
  { label: "Mini Games", href: "/games" },
];

function useLiveClock() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Europe/Istanbul",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);
  const time = useLiveClock();
  const lenis = useLenis();

  useGSAP(() => {
    const header = headerRef.current;
    const overlay = overlayRef.current;
    if (!header || !overlay) return;

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

    // fullscreen menu: top-down wipe, staggered giant links, meta fade
    tlRef.current = gsap
      .timeline({ paused: true })
      .fromTo(
        overlay,
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.7,
          ease: "power4.inOut",
        }
      )
      .fromTo(
        "[data-menu-link]",
        { yPercent: 110 },
        { yPercent: 0, duration: 0.6, stagger: 0.06, ease: "power4.out" },
        0.28
      )
      .fromTo(
        "[data-menu-meta]",
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" },
        0.5
      );
  }, []);

  // play / reverse + scroll lock
  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (open) {
      tl.timeScale(1).play();
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      tl.timeScale(1.4).reverse();
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
  }, [open, lenis]);

  // close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* fullscreen menu overlay */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 z-40 flex flex-col justify-between bg-void/95 px-6 pb-8 pt-28 backdrop-blur-md md:px-10 md:pt-32 [clip-path:inset(0%_0%_100%_0%)] ${
          open ? "" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-0 h-[36rem] w-[36rem] rounded-full bg-acid/[0.06] blur-3xl"
        />

        <nav aria-label="Main">
          {LINKS.map((link) => (
            <div key={link.href} className="overflow-hidden">
              <Link
                href={link.href}
                data-menu-link
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-4 py-1 md:gap-8"
              >
                <span className="label text-acid">{link.index}</span>
                <span className="display text-[13vw] leading-[0.95] text-ink transition-colors duration-300 group-hover:text-acid sm:text-[9vw] lg:text-[6.5vw]">
                  {link.label}
                </span>
                <span
                  aria-hidden="true"
                  className="display hidden text-3xl text-acid opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100 md:block"
                >
                  →
                </span>
              </Link>
            </div>
          ))}
        </nav>

        <div className="flex flex-col gap-6 border-t border-line pt-6 md:flex-row md:items-end md:justify-between">
          <div data-menu-meta className="flex flex-wrap gap-x-6 gap-y-2">
            {EXTRAS.map((extra) => (
              <Link
                key={extra.href}
                href={extra.href}
                onClick={() => setOpen(false)}
                className="link-sweep label text-dim"
              >
                {extra.label} ↗
              </Link>
            ))}
          </div>
          <div data-menu-meta className="flex flex-wrap gap-x-6 gap-y-2">
            {socials.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-sweep label text-dim"
              >
                {social.label}
              </a>
            ))}
          </div>
          <a
            data-menu-meta
            href={`mailto:${site.email}`}
            className="link-sweep label w-fit text-ink"
          >
            {site.email}
          </a>
        </div>
      </div>

      {/* top bar */}
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 border-b border-transparent transition-colors duration-300 [&.header-scrolled]:border-line [&.header-scrolled]:bg-void/90"
      >
        <div className="flex items-center justify-between px-6 py-4 md:px-10">
          <Link
            id="site-brand"
            href="/"
            onClick={() => setOpen(false)}
            className="display text-lg tracking-wide text-ink"
          >
            Oguz Tozkoparan<span className="text-acid">.</span>
          </Link>

          <div className="flex items-center gap-6 md:gap-8">
            <span className="label hidden tabular-nums text-dim sm:block">
              {time}
            </span>
            <SoundControl />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="group flex items-center gap-3"
            >
              <span className="label text-ink">{open ? "Close" : "Menu"}</span>
              <span className="relative block h-3 w-6">
                <span
                  className={`absolute left-0 top-0 h-px w-full bg-acid transition-transform duration-300 ${
                    open ? "translate-y-[5.5px] rotate-45" : "group-hover:w-4/5"
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-px w-full bg-acid transition-transform duration-300 ${
                    open ? "-translate-y-[5.5px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
