"use client";

import { useState } from "react";
import { Zap, ToggleLeft, ToggleRight } from "lucide-react";
import type { GameBenchmark } from "@/lib/calculator";
import { cn } from "@/lib/utils";

interface FpsChartProps {
  games: GameBenchmark[];
  supportsFrameGen?: boolean;
}

const MAX_FPS_DISPLAY = 400;

function FpsBar({
  fps,
  max,
  color,
}: {
  fps: number;
  max: number;
  color: string;
}) {
  const pct = Math.min((fps / max) * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full bar-animate", color)}
          style={{ "--target-width": `${pct}%` } as React.CSSProperties}
        />
      </div>
      <span className="text-xs font-mono text-slate-300 w-12 text-right">
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

export default function FpsChart({ games, supportsFrameGen }: FpsChartProps) {
  const [frameGenOn, setFrameGenOn] = useState(false);
  const [preset, setPreset] = useState<"low" | "med" | "high">("med");

  const presetLabels = { low: "Low", med: "Medium", high: "Ultra" };

  return (
    <div className="glass-card p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-bold text-slate-100 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          FPS Benchmarks
        </h3>

        <div className="flex items-center gap-3">
          {/* Quality preset selector */}
          <div className="flex rounded-lg overflow-hidden border border-slate-700">
            {(["low", "med", "high"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPreset(p)}
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
            onClick={() => setFrameGenOn(!frameGenOn)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
              frameGenOn
                ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-100"
            )}
          >
            {frameGenOn ? (
              <ToggleRight className="w-4 h-4" />
            ) : (
              <ToggleLeft className="w-4 h-4" />
            )}
            Frame-Gen {frameGenOn ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {frameGenOn && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
          <Zap className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            <strong>Frame Generation active</strong> — FPS boosted via{" "}
            {games[0]?.upscalingTech ?? "AI frame interpolation"}. Effective
            visual FPS shown.
          </span>
        </div>
      )}

      {/* Game rows */}
      <div className="space-y-4">
        {games.map((game) => {
          const fps = frameGenOn
            ? preset === "low"
              ? game.frameGenLow
              : preset === "high"
              ? game.frameGenHigh
              : game.frameGenMed
            : preset === "low"
            ? game.nativeLow
            : preset === "high"
            ? game.nativeHigh
            : game.nativeMed;

          return (
            <div key={game.game}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-slate-300 font-medium">
                  {game.game}
                </span>
                {frameGenOn && (
                  <span className="text-xs text-amber-400 font-mono">
                    +
                    {Math.round(
                      ((fps /
                        (preset === "low"
                          ? game.nativeLow
                          : preset === "high"
                          ? game.nativeHigh
                          : game.nativeMed)) -
                        1) *
                        100
                    )}
                    % boost
                  </span>
                )}
              </div>
              <FpsBar fps={fps} max={MAX_FPS_DISPLAY} color={getFpsColor(fps)} />
            </div>
          );
        })}
      </div>

      {/* FPS legend */}
      <div className="flex gap-4 text-xs text-slate-500 pt-1 border-t border-slate-800">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
          &lt;30 fps
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
          30–60 fps
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          60–120 fps
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          120+ fps
        </span>
      </div>
    </div>
  );
}
