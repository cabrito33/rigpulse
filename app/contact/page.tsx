import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Mail, MessageSquare, Bug, Cpu, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us — RigPulse",
  description: "Get in touch with the RigPulse team for hardware suggestions, calculation feedback, or technical bug reports.",
};

export default function ContactPage() {
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
          <span className="text-slate-300">Contact</span>
        </nav>

        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <Mail className="w-3.5 h-3.5" />
            Support &amp; Feedback
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
            Contact RigPulse
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Have feedback on our bottleneck modeling, want to suggest new CPU/GPU models, or encountered an issue?
            We welcome direct communication from PC builders and enthusiasts.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-6 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
              <MessageSquare className="w-4 h-4" />
              <span>General Inquiries</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Questions regarding our calculation model, press inquiries, or general suggestions.
            </p>
          </div>

          <div className="glass-card p-6 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <Cpu className="w-4 h-4" />
              <span>Hardware Requests</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Suggest newly announced or legacy processors and graphics cards for database inclusion.
            </p>
          </div>

          <div className="glass-card p-6 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <Bug className="w-4 h-4" />
              <span>Bug Reports</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Report layout glitches, formula discrepancies, or broken links across the platform.
            </p>
          </div>
        </div>

        <section className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-100">Direct Email Contact</h2>
          <p className="text-sm leading-relaxed text-slate-300">
            You can reach the site maintainer, <strong>[YOUR NAME]</strong>, directly via email:
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <span className="font-mono text-sm sm:text-base text-emerald-400">
              [YOUR EMAIL]
            </span>
            <a
              href="mailto:[YOUR EMAIL]"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors"
            >
              Send Email
            </a>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            We aim to reply to all legitimate technical questions and hardware suggestions within 2–3 business days.
          </p>
        </section>
      </main>
    </>
  );
}
