import { MetadataRoute } from "next";
import { cpus, TOP_CPU_IDS, TOP_GPU_IDS } from "@/lib/hardware";
import { getComboSlug } from "@/lib/calculator";

const BASE_URL = "https://rigpulse.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  // Top CPU × Top GPU combos (high priority)
  for (const cpuId of TOP_CPU_IDS) {
    for (const gpuId of TOP_GPU_IDS) {
      urls.push({
        url: `${BASE_URL}/combo/${getComboSlug(cpuId, gpuId)}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  // Remaining combos (lower priority)
  for (const cpu of cpus) {
    if (TOP_CPU_IDS.includes(cpu.id)) continue;
    for (const gpuId of TOP_GPU_IDS.slice(0, 5)) {
      urls.push({
        url: `${BASE_URL}/combo/${getComboSlug(cpu.id, gpuId)}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return urls;
}
