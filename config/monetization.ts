// =========================================
// MONETIZATION CONFIG — Add your tags here!
// =========================================

export const AMAZON_TAG_GLOBAL = "rigpulse-20"; // amazon.com
export const AMAZON_TAG_IBERIA = "rigpulse-21"; // amazon.es (Portugal / Spain)

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
