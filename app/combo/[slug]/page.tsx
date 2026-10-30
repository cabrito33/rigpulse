import { cpus, TOP_CPU_IDS, TOP_GPU_IDS, getCpuById, getGpuById } from "@/lib/hardware";
import { calculate, parseComboSlug, getComboSlug } from "@/lib/calculator";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ComboPageClient from "./ComboPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate all combinations for ISR / static rendering
export async function generateStaticParams() {
  const params: { slug: string }[] = [];

  // All top CPU × top GPU combos
  for (const cpuId of TOP_CPU_IDS) {
    for (const gpuId of TOP_GPU_IDS) {
      params.push({ slug: getComboSlug(cpuId, gpuId) });
    }
  }

  // Remaining CPUs × top GPUs (for full coverage)
  for (const cpu of cpus) {
    if (TOP_CPU_IDS.includes(cpu.id)) continue;
    for (const gpuId of TOP_GPU_IDS.slice(0, 5)) {
      params.push({ slug: getComboSlug(cpu.id, gpuId) });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseComboSlug(slug);
  if (!parsed) return { title: "Not Found" };

  const cpu = getCpuById(parsed.cpuId);
  const gpu = getGpuById(parsed.gpuId);
  if (!cpu || !gpu) return { title: "Not Found" };

  const title = `${cpu.name} + ${gpu.name} Bottleneck, FPS & PSU Calculator (2026)`;
  const description = `Does the ${cpu.name} bottleneck the ${gpu.name} at 1080p or 1440p? View estimated FPS, Frame Generation gains, recommended PSU wattage, and best upgrades.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/combo/${slug}`,
    },
  };
}

export default async function ComboPage({ params }: Props) {
  const { slug } = await params;
  const parsed = parseComboSlug(slug);
  if (!parsed) notFound();

  const cpu = getCpuById(parsed.cpuId);
  const gpu = getGpuById(parsed.gpuId);
  if (!cpu || !gpu) notFound();

  const result = calculate(parsed.cpuId, parsed.gpuId, "1080p", "gaming");
  if (!result) notFound();

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "RigPulse PC Bottleneck Calculator",
        url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        description:
          "Free PC bottleneck calculator with FPS benchmarks, Frame Generation simulation, and PSU wattage recommendations.",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `Does the ${cpu.name} bottleneck the ${gpu.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `At 1080p, the ${cpu.name} and ${gpu.name} combination shows a ${result.bottleneckPercent.toFixed(1)}% ${result.bottleneckType}. ${result.bottleneckSeverity === "optimal" ? "This is a well-balanced pairing." : `The ${result.bottleneckType === "CPU Bottleneck" ? "CPU" : "GPU"} is the limiting factor.`}`,
            },
          },
          {
            "@type": "Question",
            name: `What PSU do I need for the ${cpu.name} and ${gpu.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `The ${cpu.name} (${cpu.tdpWatts}W) and ${gpu.name} (${gpu.tdpWatts}W) draw approximately ${result.psu.peakDrawWatts}W peak. We recommend a minimum ${result.psu.recommendedWatts}W 80+ Gold PSU for safe, stable operation.`,
            },
          },
          {
            "@type": "Question",
            name: `What FPS can I expect with the ${cpu.name} and ${gpu.name} in gaming?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `With the ${cpu.name} and ${gpu.name} at 1080p medium settings, expect approximately ${result.games[0]?.nativeMed ?? 0} FPS in demanding AAA titles. With Frame Generation enabled (${result.games[0]?.upscalingTech}), effective FPS can reach ${result.games[0]?.frameGenMin ?? 0}–${result.games[0]?.frameGenMax ?? 0} FPS.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ComboPageClient
        cpuId={parsed.cpuId}
        gpuId={parsed.gpuId}
        initialResult={result}
        cpu={cpu}
        gpu={gpu}
      />
    </>
  );
}
