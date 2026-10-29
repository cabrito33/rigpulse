"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Calculator from "@/components/Calculator";
import BottleneckGauge from "@/components/BottleneckGauge";
import FpsChart from "@/components/FpsChart";
import AffiliateCards from "@/components/AffiliateCards";
import AdSlot from "@/components/AdSlot";
import { type Region } from "@/config/monetization";
import { type BottleneckResult } from "@/lib/calculator";
import { type CPU, type GPU } from "@/lib/hardware";
import { ArrowLeft, Cpu } from "lucide-react";

interface ComboPageClientProps {
  cpuId: string;
  gpuId: string;
  initialResult: BottleneckResult;
  cpu: CPU;
  gpu: GPU;
}

export default function ComboPageClient({
  cpuId,
  gpuId,
  initialResult,
  cpu,
  gpu,
}: ComboPageClientProps) {
  const [region, setRegion] = useState<Region>("global");

  const severityLabel = {
    optimal: "Balanced",
    moderate: "Moderate Bottleneck",
    severe: "Severe Bottleneck",
  }[initialResult.bottleneckSeverity];

  return (
    <>
      <Navbar region={region} onRegionChange={setRegion} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Calculator
          </Link>
          <span>/</span>
          <span className="text-slate-300">{cpu.name} + {gpu.name}</span>
        </nav>

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono">
              {cpu.brand} CPU
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              {gpu.brand} GPU
            </span>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-mono ${
                initialResult.bottleneckSeverity === "optimal"
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : initialResult.bottleneckSeverity === "moderate"
                  ? "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                  : "bg-rose-500/10 border border-rose-500/20 text-rose-400"
              }`}
            >
              {severityLabel} · {initialResult.bottleneckPercent.toFixed(1)}%
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {cpu.name}{" "}
            <span className="text-slate-500">+</span>{" "}
            {gpu.name}
          </h1>
          <p className="text-slate-400">
            Bottleneck Analysis, FPS Benchmarks &amp; PSU Calculator (2026)
          </p>
        </div>

        <AdSlot slot="banner-top" />

        {/* Results Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <BottleneckGauge result={initialResult} />
            <FpsChart games={initialResult.games} supportsFrameGen={gpu.supportsFrameGen} />
          </div>
          <div className="xl:col-span-1 space-y-4">
            <AffiliateCards result={initialResult} region={region} />
            <AdSlot slot="sidebar" />
          </div>
        </div>

        {/* Interactive calculator below */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 mb-6">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold">Try a Different Configuration</h2>
          </div>
          <Calculator initialCpuId={cpuId} initialGpuId={gpuId} region={region} />
        </div>

        <AdSlot slot="banner-bottom" />
      </main>

      <footer className="border-t border-slate-800 mt-16 py-8 text-center text-xs text-slate-600">
        <p>
          RigPulse &copy; {new Date().getFullYear()} · {cpu.name} + {gpu.name} benchmark
          estimates based on relative performance indices.
        </p>
      </footer>
    </>
  );
}
