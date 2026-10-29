"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Calculator from "@/components/Calculator";
import AdSlot from "@/components/AdSlot";
import { cpus, gpus } from "@/lib/hardware";
import { getComboSlug } from "@/lib/calculator";
import { type Region } from "@/config/monetization";
import { Cpu, Zap, Shield, BarChart3, ExternalLink } from "lucide-react";

const POPULAR_COMBOS = [
  { cpuId: "i5-8400", gpuId: "gtx-1660-super" },
  { cpuId: "ryzen-5-3600", gpuId: "rtx-3060" },
  { cpuId: "i5-12400f", gpuId: "rtx-3060-ti" },
  { cpuId: "ryzen-5-5600x", gpuId: "rtx-4060" },
  { cpuId: "i5-13600k", gpuId: "rtx-4070-super" },
  { cpuId: "ryzen-7-7800x3d", gpuId: "rtx-4080-super" },
  { cpuId: "i5-10400f", gpuId: "rtx-2060" },
  { cpuId: "ryzen-7-5800x3d", gpuId: "rx-6700-xt" },
  { cpuId: "i7-8700k", gpuId: "rtx-3070" },
  { cpuId: "ryzen-5-5600", gpuId: "rx-7600" },
  { cpuId: "i5-13400f", gpuId: "rtx-4060-ti" },
  { cpuId: "ryzen-7-9800x3d", gpuId: "rtx-5080" },
];

function ComboLink({ cpuId, gpuId }: { cpuId: string; gpuId: string }) {
  const cpu = cpus.find((c) => c.id === cpuId);
  const gpu = gpus.find((g) => g.id === gpuId);
  if (!cpu || !gpu) return null;

  return (
    <Link
      href={`/combo/${getComboSlug(cpuId, gpuId)}`}
      className="group flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-indigo-400 font-medium">{cpu.name}</span>
        <span className="text-xs text-emerald-400 font-medium">{gpu.name}</span>
      </div>
      <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" />
    </Link>
  );
}

export default function HomePage() {
  const [region, setRegion] = useState<Region>("global");

  return (
    <>
      <Navbar region={region} onRegionChange={setRegion} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Hero */}
        <section className="text-center space-y-4 py-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-2">
            <Zap className="w-3 h-3" />
            Free · Instant · No Account Needed
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
            PC Bottleneck &amp;{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">
              FPS Calculator
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto text-balance">
            Instantly discover if your CPU bottlenecks your GPU, see real-world FPS
            benchmarks, Frame Generation gains, PSU wattage requirements, and the
            best upgrade path for your gaming rig.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {[
              { icon: BarChart3, label: "Bottleneck Analysis" },
              { icon: Zap, label: "Frame-Gen Simulator" },
              { icon: Shield, label: "PSU Calculator" },
              { icon: Cpu, label: "Upgrade Advisor" },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300"
              >
                <Icon className="w-3.5 h-3.5 text-emerald-400" />
                {label}
              </span>
            ))}
          </div>
        </section>

        <AdSlot slot="banner-top" />

        {/* Calculator */}
        <section>
          <Calculator region={region} />
        </section>

        {/* Popular combos grid */}
        <section id="popular" className="scroll-mt-20">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-100">
              Popular Hardware Combinations
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Pre-calculated results for the most searched CPU + GPU pairings
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {POPULAR_COMBOS.map(({ cpuId, gpuId }) => (
              <ComboLink key={`${cpuId}-${gpuId}`} cpuId={cpuId} gpuId={gpuId} />
            ))}
          </div>
        </section>

        {/* SEO content */}
        <section className="prose prose-invert prose-slate max-w-none">
          <div className="glass-card p-6 grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-slate-100 mb-3">
                What is a CPU/GPU Bottleneck?
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                A bottleneck occurs when one component in your PC significantly limits the
                performance of another. In gaming, this usually means your CPU cannot feed
                frames fast enough for your GPU (CPU bottleneck), or your GPU cannot render
                fast enough at high resolutions (GPU bottleneck). Our calculator uses
                real-world performance indices and resolution-aware weighting to give you
                accurate bottleneck percentages.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 mb-3">
                How Does Frame Generation Help?
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                NVIDIA DLSS 3/4 Frame Generation, AMD FSR 3, and tools like Lossless
                Scaling can effectively double your frame rate by using AI to generate
                intermediate frames. This is especially powerful for GPU-bottlenecked
                systems at 1440p and 4K, turning a 45 fps experience into a smooth 90 fps.
                Toggle the Frame-Gen simulator above to see projected gains for your exact
                hardware combo.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 mt-16 py-8 text-center text-xs text-slate-600">
        <p>
          RigPulse &copy; {new Date().getFullYear()} · FPS estimates are based on relative
          performance indices and may vary from real-world benchmarks.
        </p>
        <p className="mt-1">
          Amazon affiliate links · Prices shown are estimates.{" "}
          {region === "iberia" ? "Amazon.es (PT/ES)" : "Amazon.com (Global)"}
        </p>
      </footer>
    </>
  );
}
