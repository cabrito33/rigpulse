"use client";

import { ExternalLink, TrendingUp, Thermometer, Zap, Cpu, AlertTriangle } from "lucide-react";
import {
  buildAmazonLink,
  THERMAL_PASTE_QUERY,
  BUDGET_COOLER_QUERY,
  SSD_QUERY,
  getPsuQuery,
  type Region,
} from "@/config/monetization";
import {
  getCpuById,
  getGpuById,
  getCpuUpgrade,
  getGpuUpgrade,
  platformChangeRequired,
} from "@/lib/hardware";
import type { BottleneckResult } from "@/lib/calculator";
import { cn } from "@/lib/utils";

interface AffiliateCardsProps {
  result: BottleneckResult;
  region: Region;
}

function AmazonButton({
  href,
  label,
  variant = "default",
}: {
  href: string;
  label: string;
  variant?: "default" | "amber" | "indigo";
}) {
  const variantClass = {
    default:
      "bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white",
    amber:
      "bg-amber-600 hover:bg-amber-500 border-amber-500 text-white",
    indigo:
      "bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white",
  }[variant];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-all",
        variantClass
      )}
    >
      <ExternalLink className="w-3.5 h-3.5" />
      {label}
    </a>
  );
}

export default function AffiliateCards({
  result,
  region,
}: AffiliateCardsProps) {
  const cpu = getCpuById(result.cpuId);
  const gpu = getGpuById(result.gpuId);
  const cpuUpgrade = cpu ? getCpuUpgrade(cpu) : undefined;
  const gpuUpgrade = gpu ? getGpuUpgrade(gpu) : undefined;

  const isCpuBottleneck = result.bottleneckType === "CPU Bottleneck";
  const isGpuBottleneck = result.bottleneckType === "GPU Bottleneck";

  // Check if CPU upgrade requires motherboard platform change
  const needsPlatformChange =
    cpu && cpuUpgrade ? platformChangeRequired(cpu, cpuUpgrade) : false;

  // Check if GPU upgrade requires a higher PSU wattage
  const upgradedPsuWatts =
    cpu && gpuUpgrade
      ? Math.ceil(((cpu.tdpWatts + gpuUpgrade.tdpWatts + 75) * 1.35) / 50) * 50
      : 0;
  const needsPsuUpgrade = upgradedPsuWatts > result.psu.recommendedWatts;

  // FPS gain estimate from upgrade
  const upgradeGainPct =
    result.bottleneckSeverity === "severe"
      ? 30
      : result.bottleneckSeverity === "moderate"
      ? 18
      : 10;

  return (
    <div className="space-y-4">
      {/* === CARD 1: Upgrade Recommendation === */}
      {(isCpuBottleneck && cpuUpgrade) || (isGpuBottleneck && gpuUpgrade) ? (
        <div className="glass-card p-5 border border-indigo-500/30 bg-indigo-500/5">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">
                {isCpuBottleneck ? "Eliminate Your Bottleneck" : "Recommended GPU Upgrade"}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Projected +{upgradeGainPct}% FPS gain
              </p>
            </div>
          </div>

          {isCpuBottleneck && cpuUpgrade && (
            <div className="space-y-2">
              <p className="text-sm text-slate-300">
                Your <span className="text-rose-400 font-medium">{cpu?.name}</span>{" "}
                is bottlenecking your GPU. Upgrade to the{" "}
                <span className="text-emerald-400 font-medium">{cpuUpgrade.name}</span>{" "}
                for a smooth, balanced rig.
              </p>
              {needsPlatformChange && (
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Requires new motherboard (and DDR5 if applicable)</span>
                </div>
              )}
              <AmazonButton
                href={buildAmazonLink(cpuUpgrade.amazonQuery, region)}
                label={`Check ${cpuUpgrade.name} Price`}
                variant="indigo"
              />
            </div>
          )}

          {isGpuBottleneck && gpuUpgrade && (
            <div className="space-y-2">
              <p className="text-sm text-slate-300">
                Your rig is currently <span className="text-emerald-400 font-medium">GPU-limited</span> (normal and ideal for gaming). Upgrading to the{" "}
                <span className="text-emerald-400 font-medium">{gpuUpgrade.name}</span>{" "}
                will push your graphical fidelity and framerates even higher.
              </p>
              {needsPsuUpgrade && (
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 flex-shrink-0 text-amber-400" />
                  <span>
                    Warning: Recommended PSU increases from {result.psu.recommendedWatts}W to {upgradedPsuWatts}W with this GPU.
                  </span>
                </div>
              )}
              <AmazonButton
                href={buildAmazonLink(gpuUpgrade.amazonQuery, region)}
                label={`Check ${gpuUpgrade.name} Price`}
                variant="indigo"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card p-5 border border-emerald-500/30 bg-emerald-500/5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Cpu className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-emerald-400">Balanced Build!</h3>
              <p className="text-sm text-slate-400 mt-0.5">
                Your CPU and GPU are well-matched. Focus on RAM speed, NVMe SSD,
                or a quality monitor for the biggest real-world gains.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* === CARD 2: Thermal & FPS Rescue Kit === */}
      <div className="glass-card p-5 border border-amber-500/30 bg-amber-500/5">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Thermometer className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100">
              Thermal &amp; FPS Rescue Kit
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Thermal throttling worsens bottlenecks by up to 15%
            </p>
          </div>
        </div>
        <p className="text-sm text-slate-300 mb-3">
          Degraded thermal paste and a cheap cooler can cost you{" "}
          <span className="text-amber-400 font-medium">10–15% FPS</span> due to
          throttling. Fresh paste + a quality cooler is the cheapest FPS upgrade.
        </p>
        <div className="flex flex-wrap gap-2">
          <AmazonButton
            href={buildAmazonLink(THERMAL_PASTE_QUERY, region)}
            label="ARCTIC MX-6 Paste"
            variant="amber"
          />
          <AmazonButton
            href={buildAmazonLink(BUDGET_COOLER_QUERY, region)}
            label="Tower Cooler"
            variant="amber"
          />
          <AmazonButton
            href={buildAmazonLink(SSD_QUERY, region)}
            label="1TB NVMe SSD"
            variant="amber"
          />
        </div>
      </div>

      {/* === CARD 3: PSU Recommendation === */}
      <div className="glass-card p-5 border border-slate-700">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
            <Zap className="w-5 h-5 text-slate-300" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100">Recommended PSU</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              For this exact CPU + GPU combo
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-3 text-center">
          <div className="bg-slate-900 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">System Peak</p>
            <p className="text-lg font-bold font-mono text-slate-100">
              {result.psu.peakDrawWatts}W
            </p>
          </div>
          <div className="bg-slate-900 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">Safe PSU Min.</p>
            <p className="text-lg font-bold font-mono text-emerald-400">
              {result.psu.recommendedWatts}W
            </p>
          </div>
          <div className="bg-slate-900 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">~Monthly Cost</p>
            <p className="text-lg font-bold font-mono text-amber-400">
              ${result.psu.monthlyCostUsd}
            </p>
          </div>
        </div>
        <AmazonButton
          href={buildAmazonLink(getPsuQuery(result.psu.recommendedWatts), region)}
          label={`Find ${result.psu.recommendedWatts}W 80+ Gold PSU`}
        />
      </div>
    </div>
  );
}
