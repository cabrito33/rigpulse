"use client";

import { cn } from "@/lib/utils";
import type { BottleneckResult } from "@/lib/calculator";
import { TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface BottleneckGaugeProps {
  result: BottleneckResult;
}

export default function BottleneckGauge({ result }: BottleneckGaugeProps) {
  const { bottleneckPercent, bottleneckType, bottleneckSeverity } = result;

  const severityConfig = {
    optimal: {
      color: "text-emerald-400",
      barColor: "bg-emerald-500",
      glowClass: "glow-emerald",
      bgClass: "bg-emerald-500/10 border-emerald-500/30",
      icon: CheckCircle,
      label: "Balanced Sweet Spot",
      badge: "✓ Balanced (<10%)",
    },
    "gpu-limited": {
      color: "text-emerald-400",
      barColor: "bg-emerald-500",
      glowClass: "glow-emerald",
      bgClass: "bg-emerald-500/10 border-emerald-500/30",
      icon: CheckCircle,
      label: "GPU-limited (normal for gaming)",
      badge: "✓ GPU-Limited (Normal for Gaming)",
    },
    moderate: {
      color: "text-amber-400",
      barColor: "bg-amber-500",
      glowClass: "glow-amber",
      bgClass: "bg-amber-500/10 border-amber-500/30",
      icon: AlertTriangle,
      label: "Moderate CPU Bottleneck",
      badge: "⚠ Moderate CPU Bottleneck (10–20%)",
    },
    severe: {
      color: "text-rose-400",
      barColor: "bg-rose-500",
      glowClass: "glow-rose",
      bgClass: "bg-rose-500/10 border-rose-500/30",
      icon: AlertTriangle,
      label: "Severe CPU Bottleneck",
      badge: "✗ Severe CPU Bottleneck (>20%)",
    },
  };

  const config = severityConfig[bottleneckSeverity];
  const Icon = config.icon;
  // Visual bar: scale 0-90% bottleneck to 0-100% bar width
  const barWidth = Math.min((bottleneckPercent / 90) * 100, 100);

  return (
    <div className={cn("glass-card p-6 border", config.bgClass, config.glowClass)}>
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Icon className={cn("w-6 h-6 flex-shrink-0", config.color)} aria-hidden="true" />
          <div>
            <p className={cn("font-bold text-lg", config.color)}>
              {config.label}
            </p>
            <p className="text-sm text-slate-400">{bottleneckType}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={cn("text-4xl font-black font-mono", config.color)}>
            {bottleneckPercent.toFixed(1)}
            <span className="text-2xl">%</span>
          </p>
          <p className="text-xs text-slate-500 mt-0.5">estimated bottleneck</p>
        </div>
      </div>

      {/* Badge for non-color accessibility */}
      <div className="mb-3">
        <span
          className={cn(
            "inline-block text-xs font-semibold px-2 py-0.5 rounded-full border",
            config.bgClass,
            config.color
          )}
        >
          {config.badge}
        </span>
      </div>

      {/* Gauge bar */}
      <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden mb-3" role="progressbar"
        aria-valuenow={bottleneckPercent} aria-valuemin={0} aria-valuemax={90}
        aria-label={`Bottleneck: ${bottleneckPercent.toFixed(1)}%`}>
        {/* Zone markers */}
        <div className="absolute inset-y-0 left-0 w-[11.1%] bg-emerald-500/20 border-r border-emerald-500/30" />
        <div className="absolute inset-y-0 left-[11.1%] w-[11.1%] bg-amber-500/20 border-r border-amber-500/30" />
        {/* Active bar */}
        <div
          className={cn("h-full rounded-full bar-animate", config.barColor)}
          style={{ "--target-width": `${barWidth}%` } as React.CSSProperties}
        />
      </div>

      {/* Legend */}
      <div className="flex justify-between text-xs text-slate-500 mb-4">
        <span className="text-emerald-400 font-medium">&lt;10% Optimal</span>
        <span className="text-amber-400 font-medium">10–20% Moderate</span>
        <span className="text-rose-400 font-medium">&gt;20% Severe</span>
      </div>

      {/* Average cap FPS comparison (replaces raw tier scores) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900/60 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
            <span className="text-xs text-slate-400 uppercase tracking-wide">CPU avg cap</span>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100">
            {result.avgCpuCapFps} <span className="text-sm font-normal text-slate-500">fps</span>
          </p>
          <div className="mt-1.5 h-1.5 bg-slate-800 rounded-full">
            <div
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${Math.min((result.avgCpuCapFps / 300) * 100, 100)}%` }}
            />
          </div>
        </div>
        <div className="bg-slate-900/60 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span className="text-xs text-slate-400 uppercase tracking-wide">GPU avg cap</span>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100">
            {result.avgGpuCapFps} <span className="text-sm font-normal text-slate-500">fps</span>
          </p>
          <div className="mt-1.5 h-1.5 bg-slate-800 rounded-full">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${Math.min((result.avgGpuCapFps / 300) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
