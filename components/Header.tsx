"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const progressRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(open);
  openRef.current = open;

  useGSAP(() => {
    const header = headerRef.current;
    const overlay = overlayRef.current;
    if (!header || !overlay) return;

    gsap.set(header, { yPercent: -120, autoAlpha: 0 });
    onPreloaderDone().then(() => {
      gsap.to(header, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.8,
        delay: 0.4,
        ease: "power3.out",
      });
    });

    // smart capsule: dives away scrolling down, resurfaces scrolling up or
    // when the pointer approaches the top edge, condenses after the fold,
    // and traces reading progress on its edge
    let shownByScroll = true;
    let nearTop = false;
    let visible = true;

    const applyVisibility = () => {
      const want = shownByScroll || nearTop || openRef.current;
      if (want === visible) return;
      visible = want;
      gsap.to(header, {
        yPercent: want ? 0 : -120,
        duration: 0.55,
        ease: want ? "power3.out" : "power3.inOut",
        overwrite: "auto",
      });
    };

    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${self.progress})`;
        }
        header.classList.toggle("nav-condensed", self.scroll() > 140);
        if (self.direction === 1 && self.scroll() > 360) shownByScroll = false;
        else if (self.direction === -1) shownByScroll = true;
        applyVisibility();
      },
    });

    // hover-to-reveal near the top edge (with hysteresis so it never flickers)
    const onPointerNear = (e: PointerEvent) => {
      const near = nearTop ? e.clientY < 150 : e.clientY < 100;
      if (near !== nearTop) {
        nearTop = near;
        applyVisibility();
      }
    };
    window.addEventListener("pointermove", onPointerNear, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerNear);
    };

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
                <ArrowRight
                  aria-hidden="true"
                  className="hidden h-8 w-8 shrink-0 self-center text-acid opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100 md:block"
                />
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
                className="link-sweep label inline-flex items-center gap-1.5 text-dim"
              >
                {extra.label}
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
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

      {/* top bar — floating capsule notch hanging from the top edge */}
      <header
        ref={headerRef}
        className="fixed left-1/2 top-0 z-50 w-max max-w-[calc(100vw-2rem)] -translate-x-1/2"
      >
        {/* gooey fillets connecting the capsule to the top edge */}
        <span
          aria-hidden="true"
          className="absolute -left-[18px] top-0 h-[18px] w-[18px] bg-[radial-gradient(circle_at_bottom_left,transparent_17.5px,#141619_18px)]"
        />
        <span
          aria-hidden="true"
          className="absolute -right-[18px] top-0 h-[18px] w-[18px] bg-[radial-gradient(circle_at_bottom_right,transparent_17.5px,#141619_18px)]"
        />

        <div className="relative flex items-center gap-5 overflow-hidden rounded-b-2xl bg-panel py-3 pl-5 pr-3 shadow-2xl shadow-black/50 transition-[padding] duration-300 md:gap-7 md:pl-6 [.nav-condensed_&]:py-2">
          {/* reading progress traced along the capsule's bottom edge */}
          <div
            ref={progressRef}
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-acid"
          />

          <Link
            id="site-brand"
            href="/"
            onClick={() => setOpen(false)}
            className="display whitespace-nowrap text-base tracking-wide text-ink md:text-lg"
          >
            Oguz Tozkoparan<span className="text-acid">.</span>
          </Link>

          {/* inline links (desktop) */}
          <nav aria-label="Primary" className="hidden items-center gap-5 md:flex">
            {LINKS.filter((l) => l.href !== "/").map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`label transition-colors duration-200 hover:text-ink ${
                  pathname.startsWith(link.href) ? "text-acid" : "text-dim"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <span className="label hidden tabular-nums text-dim lg:block">
            {time}
          </span>

          <SoundControl />

          <a
            href={`mailto:${site.email}`}
            className="label hidden whitespace-nowrap rounded-full bg-acid px-4 py-2 font-bold text-void transition-transform duration-200 hover:scale-105 sm:block"
          >
            Let&apos;s talk
          </a>

          {/* fullscreen menu toggle (mobile) */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="group flex items-center gap-3 pr-2 md:hidden"
          >
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
      </header>
    </>
  );
}
