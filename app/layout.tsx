import type { Metadata, Viewport } from "next";
import { Anton, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Header from "@/components/Header";
import ScrollTop from "@/components/ScrollTop";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-anton",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-grotesk",
  display: "swap",
});

const jbmono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jbmono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://oguztozkoparan.com"),
  title: {
    default: "Oguz Tozkoparan — Software Engineer",
    template: "%s — Oguz Tozkoparan",
  },
  alternates: { canonical: "/" },
  description:
    "Software engineer in Ankara crafting motion-driven web experiences. React, Next.js, GSAP.",
  openGraph: {
    title: "Oguz Tozkoparan — Software Engineer",
    description:
      "Software engineer in Ankara crafting motion-driven web experiences.",
    url: "https://oguztozkoparan.com",
    siteName: "Oguz Tozkoparan",
    images: ["/og.png"],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oguz Tozkoparan — Software Engineer",
    description:
      "Software engineer in Ankara crafting motion-driven web experiences.",
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#0e0f11",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${grotesk.variable} ${jbmono.variable} dark`}
    >
      <body className="grain">
        <SmoothScroll>
          <ScrollTop />
          <Cursor />
          <Header />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
