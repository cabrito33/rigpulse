// AdSlot.tsx — Google AdSense responsive slot
// Automatically renders nothing when NEXT_PUBLIC_ADSENSE_CLIENT is not configured.

interface AdSlotProps {
  slot: "banner-top" | "banner-mid" | "banner-bottom" | "sidebar";
  className?: string;
}

export default function AdSlot({ slot, className = "" }: AdSlotProps) {
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  if (!adClient || adClient.trim() === "") {
    return null;
  }

  const dimensions: Record<AdSlotProps["slot"], string> = {
    "banner-top": "min-h-[90px] w-full",
    "banner-mid": "min-h-[100px] w-full",
    "banner-bottom": "min-h-[90px] w-full",
    sidebar: "min-h-[250px] w-full",
  };

  return (
    <div
      className={`${dimensions[slot]} ${className} flex items-center justify-center overflow-hidden`}
      data-ad-slot={slot}
      aria-label="Advertisement"
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adClient}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
