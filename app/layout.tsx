import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import CookieConsent from "@/components/CookieConsent";
import AdSenseScript from "@/components/AdSenseScript";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RigPulse — PC Bottleneck, PSU & Frame-Gen Calculator",
    template: "%s | RigPulse",
  },
  description:
    "Free PC bottleneck calculator. Find CPU/GPU bottlenecks instantly, see estimated FPS, Frame Generation gains, PSU wattage recommendations, and best upgrade paths for your gaming rig.",
  keywords: [
    "PC bottleneck calculator",
    "CPU GPU bottleneck",
    "FPS calculator",
    "PSU calculator",
    "frame generation",
    "DLSS FSR",
    "gaming PC upgrade",
    "bottleneck checker",
  ],
  authors: [{ name: "RigPulse" }],
  creator: "RigPulse",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "RigPulse",
    title: "RigPulse — PC Bottleneck, PSU & Frame-Gen Calculator",
    description:
      "Free PC bottleneck calculator with estimated FPS, Frame Gen simulation, PSU wattage, and upgrade recommendations.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RigPulse — PC Bottleneck Calculator",
    description:
      "Does your CPU bottleneck your GPU? Find out instantly with real FPS data and Frame Gen projections.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen antialiased flex flex-col justify-between`}>
        <AdSenseScript />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
