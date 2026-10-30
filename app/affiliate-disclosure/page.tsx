import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { HeartHandshake, ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Affiliate Disclosure — RigPulse",
  description: "Transparency disclosure regarding RigPulse's participation in affiliate programs including Amazon Associates.",
};

export default function AffiliateDisclosurePage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-300">
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-300">Affiliate Disclosure</span>
        </nav>

        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <HeartHandshake className="w-3.5 h-3.5" />
            Transparency &amp; FTC Compliance
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
            Affiliate Disclosure
          </h1>
          <p className="text-slate-400 text-sm">
            Last updated: October 30, 2026
          </p>
        </header>

        <section className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Amazon Associates Disclosure
          </h2>
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm sm:text-base font-medium">
            &quot;As an Amazon Associate I earn from qualifying purchases.&quot;
          </div>
          <p className="text-sm leading-relaxed text-slate-300">
            RigPulse participates in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide
            a means for sites to earn advertising fees by advertising and linking to Amazon websites (including Amazon.com and regional storefronts such as Amazon.es).
          </p>
        </section>

        <section className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-100">How Affiliate Links Work</h2>
          <p className="text-sm leading-relaxed text-slate-300">
            When you click on hardware purchase suggestions or upgrade recommendation buttons on RigPulse and make a purchase on Amazon,
            we may receive a small commission from Amazon.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
            <li>
              <strong>No Additional Cost to You:</strong> The commission is paid entirely by the retailer. You pay the exact same price as visiting the retailer directly.
            </li>
            <li>
              <strong>Editorial &amp; Algorithmic Independence:</strong> Our calculation algorithms and tierScores are strictly objective. We never boost scores, hide bottlenecks, or alter upgrade paths based on commission rates.
            </li>
            <li>
              <strong>Price &amp; Stock Availability:</strong> Hardware prices and stock availability fluctuate dynamically. Prices displayed on RigPulse are estimated guidelines; the actual final price is shown on Amazon at checkout.
            </li>
          </ul>
        </section>

        <section className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-100">Questions &amp; Contact</h2>
          <p className="text-sm leading-relaxed text-slate-300">
            If you have any questions regarding our monetization policies or affiliate relationships, please contact <strong>[YOUR NAME]</strong> at{" "}
            <a href="mailto:[YOUR EMAIL]" className="text-emerald-400 underline font-mono text-xs">
              [YOUR EMAIL]
            </a>.
          </p>
        </section>
      </main>
    </>
  );
}
