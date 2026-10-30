"use client";

import { useState, useRef } from "react";
import { Zap, ToggleLeft, ToggleRight, AlertTriangle } from "lucide-react";
import type { GameBenchmark } from "@/lib/calculator";
import { cn } from "@/lib/utils";

interface FpsChartProps {
  games: GameBenchmark[];
}

const MAX_FPS_DISPLAY = 400;

function FpsBar({ fps, max, color, animKey }: { fps: number; max: number; color: string; animKey: string }) {
  const pct = Math.min((fps / max) * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          key={animKey}
          className={cn("h-full rounded-full bar-animate", color)}
          style={{ "--target-width": `${pct}%` } as React.CSSProperties}
        />
      </div>
      <span className="text-xs font-mono text-slate-300 w-14 text-right tabular-nums">
        {fps} fps
      </span>
    </div>
  );
}

function getFpsColor(fps: number): string {
  if (fps >= 120) return "bg-emerald-400";
  if (fps >= 60) return "bg-emerald-500";
  if (fps >= 30) return "bg-amber-500";
  return "bg-rose-500";
}

export default function FpsChart({ games }: FpsChartProps) {
  const [frameGenOn, setFrameGenOn] = useState(false);
  const [preset, setPreset] = useState<"low" | "med" | "high">("med");
  const toggleCount = useRef(0);

  const presetLabels = { low: "Low", med: "Medium", high: "Ultra" };
  const upscalingTech = games[0]?.upscalingTech ?? "Frame Generation";
  const hasWarning = frameGenOn && games.some((g) => g.frameGenWarning);

  function handleToggle() {
    toggleCount.current += 1;
    setFrameGenOn((v) => !v);
  }

  return (
    <div className="glass-card p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-bold text-slate-100 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          Estimated FPS
        </h3>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Quality preset */}
          <div className="flex rounded-lg overflow-hidden border border-slate-700">
            {(["low", "med", "high"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPreset(p)}
                aria-pressed={preset === p}
                className={cn(
                  "px-3 py-1 text-xs font-medium transition-colors",
                  preset === p
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-slate-100"
                )}
              >
                {presetLabels[p]}
              </button>
            ))}
          </div>

          {/* Frame-gen toggle */}
          <button
            onClick={handleToggle}
            aria-pressed={frameGenOn}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
              frameGenOn
                ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-100"
            )}
          >
            {frameGenOn ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            <span className="hidden sm:inline">Frame-Gen</span> {frameGenOn ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Frame-gen info banner */}
      {frameGenOn && (
        <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
          <Zap className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>
            <strong>{upscalingTech}</strong> active — estimated visual FPS shown as a range.
            All values are estimates.
          </span>
        </div>
      )}

      {/* Low-base-FPS latency warning */}
      {hasWarning && (
        <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Latency warning:</strong> Frame generation works best with a base of 40–60+ FPS.
            At lower base FPS, input latency increases noticeably.
          </span>
        </div>
      )}

      {/* Game rows */}
      <div className="space-y-4" aria-live="polite" aria-atomic="false">
        {games.map((game) => {
          const nativeFps =
            preset === "low" ? game.nativeLow : preset === "high" ? game.nativeHigh : game.nativeMed;
          const animKey = `${game.game}-${frameGenOn}-${preset}-${toggleCount.current}`;

          return (
            <div key={game.game}>
              <div className="flex justify-between items-center mb-1 gap-2">
                <span className="text-sm text-slate-300 font-medium truncate">{game.game}</span>
                {frameGenOn ? (
                  <span className="text-xs text-amber-400 font-mono whitespace-nowrap">
                    {game.frameGenMin}–{game.frameGenMax} fps
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 font-mono whitespace-nowrap">
                    {nativeFps} fps
                  </span>
                )}
              </div>
              <FpsBar
                fps={frameGenOn ? Math.round((game.frameGenMin + game.frameGenMax) / 2) : nativeFps}
                max={MAX_FPS_DISPLAY}
                color={getFpsColor(frameGenOn ? game.frameGenMax : nativeFps)}
                animKey={animKey}
              />
            </div>
          );
        })}
      </div>

      {/* FPS legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 pt-1 border-t border-slate-800">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />&lt;30</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />30–60</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />60–120</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />120+</span>
        <span className="ml-auto italic">All FPS values are estimates</span>
      </div>
    </div>
  );
}
