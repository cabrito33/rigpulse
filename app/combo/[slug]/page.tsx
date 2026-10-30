import { getCpuById, getGpuById } from "@/lib/hardware";
import { calculate, parseComboSlug } from "@/lib/calculator";
import { getAllPlausibleCombos, isPlausiblePair } from "@/lib/combos";
import { SITE_URL } from "@/lib/site";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ComboPageClient from "./ComboPageClient";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate plausible desktop combinations for static rendering
export async function generateStaticParams() {
  const combos = getAllPlausibleCombos();
  return combos.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseComboSlug(slug);
  if (!parsed) return { title: "Not Found" };

  const cpu = getCpuById(parsed.cpuId);
  const gpu = getGpuById(parsed.gpuId);
  if (!cpu || !gpu) return { title: "Not Found" };

  const isPlausible = isPlausiblePair(cpu, gpu);
  const title = `${cpu.name} + ${gpu.name} Bottleneck, FPS & PSU Calculator (2026)`;
  const description = `Does the ${cpu.name} bottleneck the ${gpu.name} at 1080p or 1440p? View estimated FPS, Frame Generation gains, recommended PSU wattage, and best upgrades.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/combo/${slug}`,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/combo/${slug}`,
    },
    robots: isPlausible
      ? { index: true, follow: true }
      : { index: false, follow: true },
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

  // JSON-LD structured data with updated bottleneck semantics
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "RigPulse PC Bottleneck Calculator",
        url: SITE_URL,
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
              text: `At 1080p, the ${cpu.name} and ${gpu.name} combination shows a ${result.bottleneckPercent.toFixed(1)}% ${result.bottleneckType}. ${
                result.bottleneckType === "GPU Bottleneck"
                  ? "The GPU is the primary limiting factor, which is the expected and ideal scenario for modern gaming rigs to maximize GPU utilization."
                  : result.bottleneckSeverity === "optimal"
                  ? "This is a well-balanced pairing with minimal bottlenecking."
                  : "The CPU is the limiting factor, which may hold back GPU performance in CPU-intensive titles."
              }`,
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
