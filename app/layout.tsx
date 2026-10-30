import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RigPulse — PC Bottleneck, PSU & Frame-Gen Calculator",
    template: "%s | RigPulse",
  },
  description:
    "Free PC bottleneck calculator. Find CPU/GPU bottlenecks instantly, see FPS benchmarks, Frame Generation gains, PSU wattage recommendations, and best upgrade paths for your gaming rig.",
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
      "Free PC bottleneck calculator with FPS benchmarks, Frame Gen simulation, PSU wattage, and upgrade recommendations.",
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
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
