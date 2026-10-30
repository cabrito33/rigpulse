"use client";

import { useState, useEffect } from "react";
import { Cookie, Shield, Check, X, Settings2 } from "lucide-react";

export interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  ads: boolean;
  timestamp: string;
}

const STORAGE_KEY = "rigpulse_consent";

export function getStoredConsent(): ConsentPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

export function saveConsent(prefs: ConsentPreferences) {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(prefs);
    localStorage.setItem(STORAGE_KEY, serialized);
    document.cookie = `${STORAGE_KEY}=${encodeURIComponent(serialized)}; path=/; max-age=31536000; SameSite=Lax`;
    window.dispatchEvent(new CustomEvent("rigpulse-consent-updated", { detail: prefs }));
  } catch {
    // ignore
  }
}

export default function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);

  useEffect(() => {
    const existing = getStoredConsent();
    if (!existing) {
      setIsOpen(true);
    } else {
      setAnalytics(existing.analytics);
      setAds(existing.ads);
    }

    const handleOpenModal = () => {
      const current = getStoredConsent();
      if (current) {
        setAnalytics(current.analytics);
        setAds(current.ads);
      }
      setShowManage(true);
      setIsOpen(true);
    };

    window.addEventListener("open-cookie-settings", handleOpenModal);
    return () => window.removeEventListener("open-cookie-settings", handleOpenModal);
  }, []);

  const handleAcceptAll = () => {
    const prefs: ConsentPreferences = {
      necessary: true,
      analytics: true,
      ads: true,
      timestamp: new Date().toISOString(),
    };
    saveConsent(prefs);
    setAnalytics(true);
    setAds(true);
    setIsOpen(false);
    setShowManage(false);
  };

  const handleRejectAll = () => {
    const prefs: ConsentPreferences = {
      necessary: true,
      analytics: false,
      ads: false,
      timestamp: new Date().toISOString(),
    };
    saveConsent(prefs);
    setAnalytics(false);
    setAds(false);
    setIsOpen(false);
    setShowManage(false);
  };

  const handleSavePreferences = () => {
    const prefs: ConsentPreferences = {
      necessary: true,
      analytics,
      ads,
      timestamp: new Date().toISOString(),
    };
    saveConsent(prefs);
    setIsOpen(false);
    setShowManage(false);
  };

  if (!isOpen) return null;

  return (
    <div
      role="region"
      aria-label="Cookie Consent"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 text-slate-200 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {!showManage ? (
          <>
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                <Cookie className="w-4 h-4" />
                <span>Privacy &amp; Cookie Preferences</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                RigPulse uses essential cookies to ensure system stability and performance calculations.
                With your consent, we also use cookies for anonymous traffic analytics and personalized
                or contextual advertising (Google AdSense). You can customize your preferences or withdraw
                consent at any time.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-end">
              <button
                type="button"
                onClick={() => setShowManage(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 transition-colors flex items-center gap-1.5"
              >
                <Settings2 className="w-3.5 h-3.5 text-slate-400" />
                Manage
              </button>
              <button
                type="button"
                onClick={handleRejectAll}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Reject All
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors shadow-lg shadow-indigo-600/20"
              >
                Accept All
              </button>
            </div>
          </>
        ) : (
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                <Shield className="w-4 h-4" />
                <span>Detailed Cookie Settings</span>
              </div>
              <button
                type="button"
                onClick={() => setShowManage(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Back to summary
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Necessary */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Strictly Necessary</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Always Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Required for essential functions such as session integrity, calculator state, and security.
                </p>
              </div>

              {/* Analytics */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Analytics Cookies</span>
                  <button
                    type="button"
                    onClick={() => setAnalytics((v) => !v)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors flex items-center gap-1 ${
                      analytics
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {analytics ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                    {analytics ? "Enabled" : "Disabled"}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Helps us understand how visitors interact with the site to optimize hardware calculation accuracy.
                </p>
              </div>

              {/* Marketing / Ads */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Advertising (AdSense)</span>
                  <button
                    type="button"
                    onClick={() => setAds((v) => !v)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors flex items-center gap-1 ${
                      ads
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {ads ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                    {ads ? "Enabled" : "Disabled"}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Allows Google AdSense to serve contextual ads to help fund free hardware benchmark modeling.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleRejectAll}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300"
              >
                Reject All
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
