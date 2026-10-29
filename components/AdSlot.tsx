// AdSlot.tsx — Google AdSense placeholder slots
// To activate: Replace the inner div with your AdSense <ins> tag

interface AdSlotProps {
  slot: "banner-top" | "banner-mid" | "banner-bottom" | "sidebar";
  className?: string;
}

export default function AdSlot({ slot, className = "" }: AdSlotProps) {
  const dimensions: Record<AdSlotProps["slot"], string> = {
    "banner-top": "h-24 w-full",
    "banner-mid": "h-28 w-full",
    "banner-bottom": "h-24 w-full",
    sidebar: "h-64 w-full",
  };

  return (
    <div
      className={`${dimensions[slot]} ${className} flex items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30`}
      data-ad-slot={slot}
      aria-label="Advertisement"
    >
      {/* 
        REPLACE THIS COMMENT WITH YOUR ADSENSE CODE:
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      */}
      <span className="text-xs text-slate-700 select-none font-mono">ad · {slot}</span>
    </div>
  );
}
