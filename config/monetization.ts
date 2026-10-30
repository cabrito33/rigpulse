// =========================================
// MONETIZATION CONFIG — Environment-driven tags
// =========================================

const DEFAULT_GLOBAL_TAG = "rigpulse-20"; // amazon.com fallback placeholder
const DEFAULT_IBERIA_TAG = "rigpulse-21"; // amazon.es fallback placeholder

const envGlobal = process.env.NEXT_PUBLIC_AMAZON_TAG_GLOBAL?.trim();
const envIberia = process.env.NEXT_PUBLIC_AMAZON_TAG_IBERIA?.trim();

let hasWarnedInProduction = false;

function checkProductionTags() {
  if (
    typeof process !== "undefined" &&
    process.env.NODE_ENV === "production" &&
    !hasWarnedInProduction
  ) {
    const isGlobalMissingOrPlaceholder = !envGlobal || envGlobal === DEFAULT_GLOBAL_TAG;
    const isIberiaMissingOrPlaceholder = !envIberia || envIberia === DEFAULT_IBERIA_TAG;

    if (isGlobalMissingOrPlaceholder || isIberiaMissingOrPlaceholder) {
      console.warn(
        `[RigPulse Build Warning] Production Amazon affiliate tags are missing or using placeholders. ` +
        `Global: "${envGlobal || 'empty'}", Iberia: "${envIberia || 'empty'}". ` +
        `Configure NEXT_PUBLIC_AMAZON_TAG_GLOBAL and NEXT_PUBLIC_AMAZON_TAG_IBERIA in your production environment.`
      );
      hasWarnedInProduction = true;
    }
  }
}

// Check once on module load
checkProductionTags();

export const AMAZON_TAG_GLOBAL = envGlobal || DEFAULT_GLOBAL_TAG;
export const AMAZON_TAG_IBERIA = envIberia || DEFAULT_IBERIA_TAG;

export type Region = "global" | "iberia";

export function getAmazonBaseUrl(region: Region): string {
  return region === "iberia" ? "https://www.amazon.es" : "https://www.amazon.com";
}

export function getAmazonTag(region: Region): string {
  return region === "iberia" ? AMAZON_TAG_IBERIA : AMAZON_TAG_GLOBAL;
}

export function buildAmazonLink(query: string, region: Region): string {
  const base = getAmazonBaseUrl(region);
  const tag = getAmazonTag(region);
  const encoded = encodeURIComponent(query);
  return `${base}/s?k=${encoded}&tag=${tag}`;
}

// Preset thermal / accessories affiliate queries
export const THERMAL_PASTE_QUERY = "ARCTIC MX-6 thermal paste";
export const BUDGET_COOLER_QUERY = "be quiet Pure Rock 2 CPU cooler";
export const SSD_QUERY = "1TB NVMe SSD PCIe 4.0 Samsung 980 Pro";

export function getPsuQuery(wattage: number): string {
  return `${wattage}W 80+ Gold Modular PSU power supply`;
}
