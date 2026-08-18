"use client";

import { useEffect, useState } from "react";

/**
 * Ambient looping background video for the about page. Falls back to the
 * static poster image when the user prefers reduced motion.
 */
export default function AboutVideo({
  src,
  poster,
  alt,
}: {
  src: string;
  poster: string;
  alt: string;
}) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (reducedMotion) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={poster} alt={alt} className="max-h-[52vh] w-full object-cover" />
    );
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-label={alt}
      className="max-h-[52vh] w-full object-cover"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
