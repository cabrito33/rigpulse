"use client";

import { useState, useCallback } from "react";
import { cpus, gpus } from "@/lib/hardware";
import { calculate, getComboSlug, type Resolution, type BottleneckResult } from "@/lib/calculator";
import { cn } from "@/lib/utils";
import { ChevronDown, Share2, Check } from "lucide-react";
import BottleneckGauge from "@/components/BottleneckGauge";
import FpsChart from "@/components/FpsChart";
import AffiliateCards from "@/components/AffiliateCards";
import AdSlot from "@/components/AdSlot";
import type { Region } from "@/config/monetization";

interface CalculatorProps {
  initialCpuId?: string;
  initialGpuId?: string;
  region: Region;
}

function Select({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs font-medium text-slate-400 uppercase tracking-wider"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
      </div>
    </div>
  );
}

export default function Calculator({ initialCpuId, initialGpuId, region }: CalculatorProps) {
  const [cpuId, setCpuId] = useState(initialCpuId ?? cpus[0].id);
  const [gpuId, setGpuId] = useState(initialGpuId ?? gpus[4].id);
  const [resolution, setResolution] = useState<Resolution>("1080p");
  const [hoursPerDay, setHoursPerDay] = useState(3);
  const [kwhPrice, setKwhPrice] = useState(0.20);
  const [copied, setCopied] = useState(false);

  const result: BottleneckResult | null = calculate(
    cpuId,
    gpuId,
    resolution,
    "gaming",
    hoursPerDay,
    kwhPrice
  );

  // Share URL: /combo/[slug] encodes both CPU and GPU and pre-renders at 1080p
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/combo/${getComboSlug(cpuId, gpuId)}`
      : `/combo/${getComboSlug(cpuId, gpuId)}`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — fallback is a no-op
    }
  }, [shareUrl]);

  // Exclude mobile CPUs/GPUs from desktop calculator options
  const cpuOptions = cpus
    .filter((c) => !c.mobile)
    .map((c) => ({ value: c.id, label: `${c.name} (${c.socket ?? "Mobile"})` }));

  const gpuOptions = gpus
    .filter((g) => !g.mobile)
    .map((g) => ({ value: g.id, label: `${g.name} — ${g.vramGb} GB` }));

  return (
    <div className="space-y-6">
      {/* Config Panel */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-slate-100 mb-5">Configure Your Rig</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <Select id="select-cpu" label="CPU" value={cpuId} onChange={setCpuId} options={cpuOptions} />
          <Select id="select-gpu" label="GPU" value={gpuId} onChange={setGpuId} options={gpuOptions} />
          <Select
            id="select-resolution"
            label="Resolution"
            value={resolution}
            onChange={(v) => setResolution(v as Resolution)}
            options={[
              { value: "1080p", label: "1080p (Full HD)" },
              { value: "1440p", label: "1440p (QHD)" },
              { value: "4k", label: "4K (UHD)" },
            ]}
          />

          {/* Hours slider */}
          <div className="space-y-1.5">
            <label
              htmlFor="hours-slider"
              className="block text-xs font-medium text-slate-400 uppercase tracking-wider"
            >
              Gaming Hours / Day: {hoursPerDay}h
            </label>
            <input
              id="hours-slider"
              type="range"
              min={1}
              max={12}
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-500 mt-3"
            />
          </div>

          {/* Electricity cost input */}
          <div className="space-y-1.5">
            <label
              htmlFor="kwh-input"
              className="block text-xs font-medium text-slate-400 uppercase tracking-wider"
            >
              Electricity: {kwhPrice.toFixed(2)} €/kWh
            </label>
            <div className="relative mt-1">
              <input
                id="kwh-input"
                type="number"
                step="0.01"
                min="0.05"
                max="0.80"
                value={kwhPrice}
                onChange={(e) => setKwhPrice(Math.max(0.01, Number(e.target.value)))}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">
                EUR/kWh
              </span>
            </div>
          </div>

          {/* Share button */}
          <div className="space-y-1.5">
            <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
              Share Rig Link
            </span>
            <button
              onClick={handleCopy}
              aria-label="Copy share link for this rig"
              className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all",
                copied
                  ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-400"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600 hover:text-slate-100"
              )}
            >
              {copied ? (
                <><Check className="w-4 h-4" /> Copied!</>
              ) : (
                <><Share2 className="w-4 h-4" /> Copy Link</>
              )}
            </button>
          </div>
        </div>
      </div>

      {result && (
        <>
          <AdSlot slot="banner-top" />

          <div
            className="grid grid-cols-1 xl:grid-cols-3 gap-6"
            aria-live="polite"
            aria-label="Bottleneck analysis results"
          >
            {/* Left: Gauge + FPS */}
            <div className="xl:col-span-2 space-y-6">
              <BottleneckGauge result={result} />
              <FpsChart games={result.games} />
            </div>

            {/* Right: Affiliate Cards */}
            <div className="xl:col-span-1 space-y-4">
              <AffiliateCards result={result} region={region} />
              <AdSlot slot="sidebar" />
            </div>
          </div>

          <AdSlot slot="banner-bottom" />
        </>
      )}
    </div>
  );
}
