import { buildAmazonLink, type Region } from "@/config/monetization";

export function getAmazonUrl(query: string, region: Region): string {
  return buildAmazonLink(query, region);
}
