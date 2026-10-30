"use client";

import Link from "next/link";
import { Cpu, ShieldCheck, HeartHandshake } from "lucide-react";

export default function Footer() {
  const openCookieSettings = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("open-cookie-settings"));
    }
  };

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 mt-20 pt-12 pb-16 text-slate-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 text-slate-100 font-bold text-base">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <span>RigPulse</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deterministic PC bottleneck modeling, realistic FPS simulations, Frame Generation analysis, and power supply sizing.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Independent &amp; Free Hardware Tools</span>
            </div>
          </div>

          {/* Core Tools & Pages */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Hardware Tools
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Bottleneck Calculator
                </Link>
              </li>
              <li>
                <Link href="/#popular" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Popular Combinations
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Calculation Methodology
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Trust &amp; Legal
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/affiliate-disclosure" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Affiliate Disclosure
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openCookieSettings}
                  className="text-slate-400 hover:text-emerald-400 transition-colors text-left"
                >
                  Cookie Preferences
                </button>
              </li>
            </ul>
          </div>

          {/* About & Contact */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Company &amp; Contact
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  About RigPulse
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Affiliate & Legal Disclosures */}
        <div className="pt-6 border-t border-slate-800/60 space-y-3 text-xs text-slate-500">
          <div className="flex items-start gap-2">
            <HeartHandshake className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Affiliate Disclosure:</strong> As an Amazon Associate I earn from qualifying purchases. RigPulse is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon. Product prices and availability are accurate as of the date/time indicated and are subject to change.
            </p>
          </div>
          <p className="leading-relaxed">
            <strong>Benchmark Disclaimer:</strong> All bottleneck percentages, framerate estimates, and power calculations are produced by our deterministic hardware index model. They represent theoretical projections under typical gaming conditions and are not physical laboratory measurements. Actual performance varies with system drivers, memory configuration, ambient temperatures, and specific game patches.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-[11px] text-slate-600">
            <p>
              &copy; {new Date().getFullYear()} RigPulse. All rights reserved.
            </p>
            <p>
              Hardware specifications last reviewed: 2026-10-30
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
