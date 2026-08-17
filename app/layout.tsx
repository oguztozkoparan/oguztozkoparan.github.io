import type { Metadata, Viewport } from "next";
import { Anton, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const jbmono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://oguztozkoparan.com"),
  title: "Oguz Tozkoparan — Software Engineer",
  description:
    "Software engineer in Ankara building games and web experiences at Orion's Gate Studio. React, Next.js, GSAP, Web3.",
  openGraph: {
    title: "Oguz Tozkoparan — Software Engineer",
    description:
      "Software engineer in Ankara building games and web experiences at Orion's Gate Studio.",
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
      "Software engineer in Ankara building games and web experiences at Orion's Gate Studio.",
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
      className={`${anton.variable} ${grotesk.variable} ${jbmono.variable}`}
    >
      <body className="grain">{children}</body>
    </html>
  );
}
