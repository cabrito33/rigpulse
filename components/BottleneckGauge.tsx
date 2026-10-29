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
    },
    moderate: {
      color: "text-amber-400",
      barColor: "bg-amber-500",
      glowClass: "glow-amber",
      bgClass: "bg-amber-500/10 border-amber-500/30",
      icon: AlertTriangle,
      label: "Moderate Bottleneck",
    },
    severe: {
      color: "text-rose-400",
      barColor: "bg-rose-500",
      glowClass: "glow-rose",
      bgClass: "bg-rose-500/10 border-rose-500/30",
      icon: AlertTriangle,
      label: "Severe Bottleneck",
    },
  };

  const config = severityConfig[bottleneckSeverity];
  const Icon = config.icon;
  const barWidth = Math.min(bottleneckPercent * 1.5, 100); // scale 0-65% to 0-100% visually

  return (
    <div className={cn("glass-card p-6 border", config.bgClass, config.glowClass)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon className={cn("w-6 h-6", config.color)} />
          <div>
            <p className={cn("font-bold text-lg", config.color)}>{config.label}</p>
            <p className="text-sm text-slate-400">{bottleneckType}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={cn("text-4xl font-black font-mono", config.color)}>
            {bottleneckPercent.toFixed(1)}
            <span className="text-2xl">%</span>
          </p>
          <p className="text-xs text-slate-500 mt-0.5">bottleneck</p>
        </div>
      </div>

      {/* Gauge bar */}
      <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden mb-3">
        {/* Zone markers */}
        <div className="absolute inset-y-0 left-0 w-[15%] bg-emerald-500/20 border-r border-emerald-500/30" />
        <div className="absolute inset-y-0 left-[15%] w-[15%] bg-amber-500/20 border-r border-amber-500/30" />

        {/* Active bar */}
        <div
          className={cn("h-full rounded-full bar-animate transition-all duration-700", config.barColor)}
          style={{ "--target-width": `${barWidth}%` } as React.CSSProperties}
        />
      </div>

      {/* Legend */}
      <div className="flex justify-between text-xs text-slate-500">
        <span className="text-emerald-400 font-medium">Optimal (&lt;10%)</span>
        <span className="text-amber-400 font-medium">Moderate (10-20%)</span>
        <span className="text-rose-400 font-medium">Severe (&gt;20%)</span>
      </div>

      {/* Score comparison */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-slate-900/60 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs text-slate-400 uppercase tracking-wide">CPU Score</span>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100">{result.cpuScore}</p>
          <div className="mt-1.5 h-1.5 bg-slate-800 rounded-full">
            <div
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${Math.min((result.cpuScore / 200) * 100, 100)}%` }}
            />
          </div>
        </div>
        <div className="bg-slate-900/60 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-slate-400 uppercase tracking-wide">GPU Score</span>
          </div>
          <p className="text-2xl font-bold font-mono text-slate-100">{result.gpuScore}</p>
          <div className="mt-1.5 h-1.5 bg-slate-800 rounded-full">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${Math.min((result.gpuScore / 200) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
