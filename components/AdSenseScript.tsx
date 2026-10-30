"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { getStoredConsent, type ConsentPreferences } from "./CookieConsent";

export default function AdSenseScript() {
  const [canLoadAds, setCanLoadAds] = useState(false);
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!client || client.trim() === "") return;

    const checkConsent = () => {
      const consent = getStoredConsent();
      setCanLoadAds(Boolean(consent?.ads));
    };

    checkConsent();

    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<ConsentPreferences>;
      setCanLoadAds(Boolean(customEvent.detail?.ads));
    };

    window.addEventListener("rigpulse-consent-updated", handler);
    return () => window.removeEventListener("rigpulse-consent-updated", handler);
  }, [client]);

  if (!client || !canLoadAds) {
    return null;
  }

  return (
    <Script
      id="google-adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
