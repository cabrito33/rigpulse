import { MetadataRoute } from "next";
import { getAllPlausibleCombos } from "@/lib/combos";
import { SITE_URL, DATA_LAST_REVIEWED } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(DATA_LAST_REVIEWED);

  const urls: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/methodology`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/affiliate-disclosure`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // Plausible combinations (same list used for generateStaticParams)
  const plausibleCombos = getAllPlausibleCombos();
  for (const combo of plausibleCombos) {
    urls.push({
      url: `${SITE_URL}/combo/${combo.slug}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return urls;
}
