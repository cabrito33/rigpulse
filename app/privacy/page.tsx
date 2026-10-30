import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Shield, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — RigPulse",
  description: "RigPulse Privacy Policy explaining data protection practices, cookie usage, analytics, and advertising disclosures.",
};

export default function PrivacyPage() {
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
          <span className="text-slate-300">Privacy Policy</span>
        </nav>

        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono">
            <Shield className="w-3.5 h-3.5" />
            Legal &amp; Privacy Compliance
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-sm">
            Last updated: October 30, 2026
          </p>
        </header>

        <section className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-100">1. Data Controller</h2>
          <p className="text-sm leading-relaxed text-slate-300">
            This website (&quot;RigPulse&quot;) is operated by <strong>[YOUR NAME]</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;).
            If you have any questions regarding your personal data or this policy, you may contact us at{" "}
            <a href="mailto:[YOUR EMAIL]" className="text-emerald-400 underline font-mono text-xs">
              [YOUR EMAIL]
            </a>.
          </p>
        </section>

        <section className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-100">2. Information We Process</h2>
          <p className="text-sm leading-relaxed text-slate-300">
            RigPulse is designed as a privacy-friendly utility. We do not require registration, names, phone numbers, or passwords.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
            <li>
              <strong>Server Logs:</strong> Standard web server connection records (IP address, user-agent string, page URL, and access timestamps) are collected temporarily to diagnose network connectivity, prevent abuse, and protect site security.
            </li>
            <li>
              <strong>Client-Side Storage:</strong> Your chosen hardware selections, electricity rate parameters, and cookie preferences are saved locally on your device (<code className="text-indigo-300 font-mono text-xs">localStorage</code> and cookie).
            </li>
          </ul>
        </section>

        <section className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-100">3. Cookies &amp; Consent</h2>
          <p className="text-sm leading-relaxed text-slate-300">
            In compliance with the EU General Data Protection Regulation (GDPR) and the ePrivacy Directive, RigPulse respects your choice:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
            <li>
              <strong>Strictly Necessary:</strong> Cookies required for the site to function (such as remembering your consent preferences).
            </li>
            <li>
              <strong>Analytics &amp; Advertising:</strong> Only loaded if you explicitly provide consent via our cookie preferences banner. No third-party marketing or tracking scripts execute prior to consent.
            </li>
          </ul>
        </section>

        <section className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-100">4. Third-Party Services &amp; Advertising</h2>
          <p className="text-sm leading-relaxed text-slate-300">
            We partner with trusted third-party providers:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
            <li>
              <strong>Google AdSense:</strong> Subject to your consent, Google and its partners may use cookies to serve ads based on prior visits to our site or other websites. You may manage or opt out of personalized ads via{" "}
              <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">
                Google Ads Settings
              </a>.
            </li>
            <li>
              <strong>Amazon Associates Program:</strong> When clicking outward affiliate links to Amazon, Amazon may place cookies on your device to attribute referral commissions.
            </li>
          </ul>
        </section>

        <section className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-100">5. Your Data Protection Rights</h2>
          <p className="text-sm leading-relaxed text-slate-300">
            Under GDPR and international privacy legislation, you have the right to request access, rectification, erasure, or restriction of processing of your personal data.
            Because we do not store identifying account profiles, most interactions are completely anonymous. For inquiries, email{" "}
            <a href="mailto:[YOUR EMAIL]" className="text-emerald-400 underline font-mono text-xs">
              [YOUR EMAIL]
            </a>.
          </p>
        </section>
      </main>
    </>
  );
}
