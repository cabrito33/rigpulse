import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Cpu, Target, HeartHandshake, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "About RigPulse — Independent Hardware Analysis",
  description:
    "Learn about RigPulse's mission to provide honest, transparent PC bottleneck modeling, frame generation simulations, and power calculations.",
};

export default function AboutPage() {
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
          <span className="text-slate-300">About</span>
        </nav>

        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono">
            <Cpu className="w-3.5 h-3.5" />
            About RigPulse
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
            Demystifying PC Gaming Performance
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            RigPulse was founded to give PC gamers, builders, and upgraders transparent, deterministic answers
            to essential hardware pairing questions without confusing marketing jargon.
          </p>
        </header>

        <section className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            Our Mission
          </h2>
          <p className="text-sm leading-relaxed text-slate-300">
            Every PC gamer has encountered the question: <em>&quot;If I upgrade my graphics card, will my CPU hold it back?&quot;</em>
            Existing online calculators often rely on opaque formulas, confusingly brand normal GPU-limited gaming scenarios as &quot;severe bottlenecks&quot;,
            or invent exaggerated framerates.
          </p>
          <p className="text-sm leading-relaxed text-slate-300">
            RigPulse was developed by <strong>[YOUR NAME]</strong> to solve this by building an open, deterministic mathematical engine.
            We model component throughput using verified relative performance indices, resolution-aware rendering physics, and smooth asymptotic
            minimums that mirror physical PC behavior.
          </p>
        </section>

        <section className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-indigo-400" />
            Monetization &amp; Independence
          </h2>
          <p className="text-sm leading-relaxed text-slate-300">
            RigPulse is 100% free to use, requiring no user accounts, subscriptions, or paywalls.
            To sustain our server costs and ongoing hardware research, we earn modest revenue through:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
            <li>
              <strong>Affiliate Partnerships:</strong> As an Amazon Associate, we earn from qualifying purchases when visitors follow product links to Amazon. This comes at zero additional cost to you.
            </li>
            <li>
              <strong>Contextual Advertising:</strong> When consented to, non-intrusive Google AdSense advertising may be displayed.
            </li>
          </ul>
          <p className="text-sm leading-relaxed text-slate-300">
            Crucially, our mathematical calculations and upgrade recommendations are entirely algorithmic and objective:
            no brand or retailer pays for higher tierScores or preferential placement.
          </p>
        </section>

        <section className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-100">Contact &amp; Inquiries</h2>
          <p className="text-sm leading-relaxed text-slate-300">
            Have questions about our calculation models, noticed a missing CPU/GPU, or found a bug?
            Reach out directly to <strong>[YOUR NAME]</strong> at{" "}
            <a href="mailto:[YOUR EMAIL]" className="text-emerald-400 underline font-mono text-xs sm:text-sm">
              [YOUR EMAIL]
            </a>.
          </p>
        </section>
      </main>
    </>
  );
}
