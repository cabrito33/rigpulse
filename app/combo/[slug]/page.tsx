import { getCpuById, getGpuById } from "@/lib/hardware";
import { calculate, parseComboSlug } from "@/lib/calculator";
import { getAllPlausibleCombos, isPlausiblePair } from "@/lib/combos";
import { buildVerdict } from "@/lib/verdict";
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
  const title = `${cpu.name} + ${gpu.name} Bottleneck, Estimated FPS & PSU Calculator (2026)`;
  const description = `Does the ${cpu.name} bottleneck the ${gpu.name} at 1080p, 1440p or 4K? View estimated FPS, Frame Generation gains, recommended PSU wattage, and best upgrades.`;

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

  const verdict = buildVerdict(cpu, gpu);

  // JSON-LD structured data: WebApplication + BreadcrumbList + FAQPage
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
          "Free PC bottleneck calculator with estimated FPS, Frame Generation simulation, and PSU wattage recommendations.",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: `${cpu.name} + ${gpu.name}`,
            item: `${SITE_URL}/combo/${slug}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: verdict.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
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
        verdict={verdict}
      />
    </>
  );
}
