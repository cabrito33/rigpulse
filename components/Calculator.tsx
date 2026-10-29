"use client";

import { useState, useCallback } from "react";
import { cpus, gpus } from "@/lib/hardware";
import { calculate, getComboSlug, type Resolution, type Purpose, type BottleneckResult } from "@/lib/calculator";
import { cn } from "@/lib/utils";
import { ChevronDown, Share2, Copy, Check } from "lucide-react";
import BottleneckGauge from "@/components/BottleneckGauge";
import FpsChart from "@/components/FpsChart";
import AffiliateCards from "@/components/AffiliateCards";
import AdSlot from "@/components/AdSlot";
import type { Region } from "@/config/monetization";
import { getGpuById } from "@/lib/hardware";

interface CalculatorProps {
  initialCpuId?: string;
  initialGpuId?: string;
  region: Region;
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <select
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
  const [purpose, setPurpose] = useState<Purpose>("gaming");
  const [hoursPerDay, setHoursPerDay] = useState(6);
  const [copied, setCopied] = useState(false);

  const result: BottleneckResult | null = calculate(cpuId, gpuId, resolution, purpose, hoursPerDay);
  const gpu = getGpuById(gpuId);

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
      // fallback
    }
  }, [shareUrl]);

  const cpuOptions = cpus.map((c) => ({ value: c.id, label: `${c.name} (${c.socket})` }));
  const gpuOptions = gpus.map((g) => ({
    value: g.id,
    label: `${g.name} ${g.vramGb}GB VRAM`,
  }));

  return (
    <div className="space-y-6">
      {/* Config Panel */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-slate-100 mb-5">Configure Your Rig</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <Select
            label="CPU"
            value={cpuId}
            onChange={setCpuId}
            options={cpuOptions}
          />
          <Select
            label="GPU"
            value={gpuId}
            onChange={setGpuId}
            options={gpuOptions}
          />
          <Select
            label="Resolution"
            value={resolution}
            onChange={(v) => setResolution(v as Resolution)}
            options={[
              { value: "1080p", label: "1080p (Full HD)" },
              { value: "1440p", label: "1440p (QHD)" },
              { value: "4k", label: "4K (UHD)" },
            ]}
          />
          <Select
            label="Use Case"
            value={purpose}
            onChange={(v) => setPurpose(v as Purpose)}
            options={[
              { value: "gaming", label: "Gaming" },
              { value: "productivity", label: "Productivity / Streaming" },
            ]}
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
              Hours Played / Day: {hoursPerDay}h
            </label>
            <input
              type="range"
              min={1}
              max={12}
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-500 mt-3"
            />
          </div>

          {/* Share button */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
              Share Rig Link
            </label>
            <button
              onClick={handleCopy}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all",
                copied
                  ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-400"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600 hover:text-slate-100"
              )}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <Copy className="w-3.5 h-3.5" />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {result && (
        <>
          <AdSlot slot="banner-top" />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left: Gauge + FPS */}
            <div className="xl:col-span-2 space-y-6">
              <BottleneckGauge result={result} />
              <FpsChart
                games={result.games}
                supportsFrameGen={gpu?.supportsFrameGen ?? false}
              />
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
