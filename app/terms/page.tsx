import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — RigPulse",
  description: "Terms and conditions governing the use of RigPulse PC hardware analysis and bottleneck calculation tools.",
};

export default function TermsPage() {
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
          <span className="text-slate-300">Terms of Service</span>
        </nav>

        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono">
            <FileText className="w-3.5 h-3.5" />
            Legal Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-slate-400 text-sm">
            Last updated: October 30, 2026
          </p>
        </header>

        <section className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-100">1. Acceptance of Terms</h2>
          <p className="text-sm leading-relaxed text-slate-300">
            By accessing or using RigPulse (operated by <strong>[YOUR NAME]</strong>), you agree to be bound by these Terms of Service.
            If you do not agree with these terms, please discontinue using this website.
          </p>
        </section>

        <section className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-100">2. Informational &amp; Educational Purpose Only</h2>
          <p className="text-sm leading-relaxed text-slate-300">
            RigPulse is an algorithmic modeling utility intended strictly for informational, educational, and entertainment purposes.
            The bottleneck percentages, framerate estimates (FPS), and power supply (PSU) recommendations provided on this site are mathematical
            simulations derived from index data, not certified laboratory measurements or guarantees of actual physical performance.
          </p>
        </section>

        <section className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-100">3. Disclaimer of Warranties &amp; Limitation of Liability</h2>
          <p className="text-sm leading-relaxed text-slate-300">
            All content and calculations are provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, whether express or implied.
            In no event shall <strong>[YOUR NAME]</strong> or RigPulse be held liable for any direct, indirect, incidental, or consequential damages,
            including but not limited to hardware purchases, hardware incompatibilities, damage from power supply undersizing, or loss of data resulting
            from decisions made based on this site&apos;s output. Always verify compatibility with original hardware manufacturers before purchasing equipment.
          </p>
        </section>

        <section className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-100">4. Intellectual Property</h2>
          <p className="text-sm leading-relaxed text-slate-300">
            All custom text, calculation algorithms, user interface designs, and codebases comprising RigPulse are the intellectual property
            of <strong>[YOUR NAME]</strong>. Hardware model names and brand trademarks (e.g., Intel, AMD, NVIDIA, GeForce, Radeon) are the property
            of their respective trademark owners and are referenced solely for nominative fair-use identification.
          </p>
        </section>

        <section className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-100">5. Contact Information</h2>
          <p className="text-sm leading-relaxed text-slate-300">
            If you have questions regarding these Terms, contact us at{" "}
            <a href="mailto:[YOUR EMAIL]" className="text-emerald-400 underline font-mono text-xs">
              [YOUR EMAIL]
            </a>.
          </p>
        </section>
      </main>
    </>
  );
}
