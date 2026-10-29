import { getCpuById, getGpuById, type CPU, type GPU } from "@/lib/hardware";

export type Resolution = "1080p" | "1440p" | "4k";
export type Purpose = "gaming" | "productivity";

export interface GameBenchmark {
  game: string;
  nativeLow: number;
  nativeMed: number;
  nativeHigh: number;
  frameGenLow: number;
  frameGenMed: number;
  frameGenHigh: number;
  upscalingTech: string;
}

export interface PSUResult {
  peakDrawWatts: number;
  recommendedWatts: number;
  monthlyCostUsd: number;
}

export interface BottleneckResult {
  cpuId: string;
  gpuId: string;
  resolution: Resolution;
  purpose: Purpose;
  cpuScore: number;
  gpuScore: number;
  bottleneckPercent: number;
  bottleneckType: "CPU Bottleneck" | "GPU Bottleneck" | "Balanced";
  bottleneckSeverity: "optimal" | "moderate" | "severe";
  games: GameBenchmark[];
  psu: PSUResult;
  cpuName: string;
  gpuName: string;
}

// Resolution multipliers: higher res shifts load to GPU
const RESOLUTION_GPU_WEIGHT: Record<Resolution, number> = {
  "1080p": 0.55,
  "1440p": 0.70,
  "4k": 0.85,
};

// Game FPS base profiles relative to GPU tier 100 at 1080p Ultra
const GAME_PROFILES: { game: string; baseMultiplier: number; cpuWeight: number }[] = [
  { game: "Cyberpunk 2077", baseMultiplier: 0.45, cpuWeight: 0.25 },
  { game: "CS2 / Rainbow Six Siege", baseMultiplier: 1.20, cpuWeight: 0.55 },
  { game: "Forza Horizon 5", baseMultiplier: 0.90, cpuWeight: 0.35 },
  { game: "GTA V / Warzone", baseMultiplier: 1.00, cpuWeight: 0.40 },
  { game: "Elden Ring / AAA Open World", baseMultiplier: 0.75, cpuWeight: 0.30 },
];

const RESOLUTION_PERF_FACTOR: Record<Resolution, number> = {
  "1080p": 1.0,
  "1440p": 0.62,
  "4k": 0.35,
};

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function calcBottleneck(
  cpu: CPU,
  gpu: GPU,
  resolution: Resolution,
  _purpose: Purpose
): { percent: number; type: "CPU Bottleneck" | "GPU Bottleneck" | "Balanced"; cpuScore: number; gpuScore: number } {
  const gpuW = RESOLUTION_GPU_WEIGHT[resolution];
  const cpuW = 1 - gpuW;

  // Weighted effective scores at this resolution
  const cpuEffective = cpu.tierScore * cpuW;
  const gpuEffective = gpu.tierScore * gpuW;

  let percent: number;
  let type: "CPU Bottleneck" | "GPU Bottleneck" | "Balanced";

  if (cpuEffective < gpuEffective) {
    // CPU is holding back the GPU
    percent = clamp(((gpuEffective - cpuEffective) / gpuEffective) * 100, 0, 65);
    type = percent < 10 ? "Balanced" : "CPU Bottleneck";
  } else {
    // GPU is the limiting factor
    percent = clamp(((cpuEffective - gpuEffective) / cpuEffective) * 100, 0, 65);
    type = percent < 10 ? "Balanced" : "GPU Bottleneck";
  }

  if (percent < 10) type = "Balanced";

  return {
    percent: Math.round(percent * 10) / 10,
    type,
    cpuScore: cpu.tierScore,
    gpuScore: gpu.tierScore,
  };
}

function calcGameFPS(
  cpu: CPU,
  gpu: GPU,
  resolution: Resolution,
  game: { game: string; baseMultiplier: number; cpuWeight: number }
): { low: number; med: number; high: number } {
  const resFactor = RESOLUTION_PERF_FACTOR[resolution];
  const gpuW = 1 - game.cpuWeight;

  // Combined effective FPS based on cpu + gpu relative contribution
  const gpuBase = (gpu.tierScore / 100) * 60 * game.baseMultiplier * resFactor * gpuW;
  const cpuBase = (cpu.tierScore / 100) * 60 * game.baseMultiplier * game.cpuWeight;
  const baseFPS = gpuBase + cpuBase;

  // Bottleneck penalty
  const gpuWRes = RESOLUTION_GPU_WEIGHT[resolution];
  const cpuWRes = 1 - gpuWRes;
  const cpuEff = cpu.tierScore * cpuWRes;
  const gpuEff = gpu.tierScore * gpuWRes;
  const minScore = Math.min(cpuEff, gpuEff);
  const maxScore = Math.max(cpuEff, gpuEff);
  const bottleneckPenalty = maxScore > 0 ? clamp(1 - (maxScore - minScore) / maxScore * 0.4, 0.6, 1.0) : 1.0;

  const med = Math.round(baseFPS * bottleneckPenalty);
  const low = Math.round(med * 1.35);  // Low settings = higher FPS
  const high = Math.round(med * 0.72); // High/Ultra settings = lower FPS

  return {
    low: Math.max(low, 5),
    med: Math.max(med, 4),
    high: Math.max(high, 3),
  };
}

function calcFrameGenFPS(
  baseFPS: { low: number; med: number; high: number },
  gpu: GPU
): { low: number; med: number; high: number } {
  const multiplier = gpu.supportsFrameGen ? 1.85 : gpu.dlssVersion === "2" ? 1.35 : 1.5; // Lossless Scaling estimate
  return {
    low: Math.round(baseFPS.low * multiplier),
    med: Math.round(baseFPS.med * multiplier),
    high: Math.round(baseFPS.high * multiplier),
  };
}

function getUpscalingTech(gpu: GPU): string {
  if (gpu.dlssVersion === "4") return "DLSS 4 Frame Gen";
  if (gpu.dlssVersion === "3") return "DLSS 3 Frame Gen";
  if (gpu.dlssVersion === "2") return "DLSS 2 + Lossless Scaling";
  if (gpu.supportsFrameGen) return "FSR 3 Frame Gen";
  return "Lossless Scaling 2×";
}

function calcPSU(cpu: CPU, gpu: GPU, hoursPerDay: number = 6): PSUResult {
  const overhead = 75; // MB, RAM, NVMe, fans
  const peakDraw = cpu.tdpWatts + gpu.tdpWatts + overhead;
  const recommendedWatts = Math.ceil((peakDraw * 1.35) / 50) * 50;

  // Monthly kWh: assume 60% avg load during gaming
  const avgDraw = peakDraw * 0.6;
  const kwhPerMonth = (avgDraw / 1000) * hoursPerDay * 30;
  const usdPerKwh = 0.15; // US average
  const monthlyCostUsd = Math.round(kwhPerMonth * usdPerKwh * 100) / 100;

  return { peakDrawWatts: peakDraw, recommendedWatts, monthlyCostUsd };
}

export function calculate(
  cpuId: string,
  gpuId: string,
  resolution: Resolution,
  purpose: Purpose,
  hoursPerDay: number = 6
): BottleneckResult | null {
  const cpu = getCpuById(cpuId);
  const gpu = getGpuById(gpuId);
  if (!cpu || !gpu) return null;

  const { percent, type, cpuScore, gpuScore } = calcBottleneck(cpu, gpu, resolution, purpose);

  let severity: "optimal" | "moderate" | "severe";
  if (percent < 10) severity = "optimal";
  else if (percent < 20) severity = "moderate";
  else severity = "severe";

  const games: GameBenchmark[] = GAME_PROFILES.map((profile) => {
    const native = calcGameFPS(cpu, gpu, resolution, profile);
    const fg = calcFrameGenFPS(native, gpu);
    return {
      game: profile.game,
      nativeLow: native.low,
      nativeMed: native.med,
      nativeHigh: native.high,
      frameGenLow: fg.low,
      frameGenMed: fg.med,
      frameGenHigh: fg.high,
      upscalingTech: getUpscalingTech(gpu),
    };
  });

  const psu = calcPSU(cpu, gpu, hoursPerDay);

  return {
    cpuId,
    gpuId,
    resolution,
    purpose,
    cpuScore,
    gpuScore,
    bottleneckPercent: percent,
    bottleneckType: type,
    bottleneckSeverity: severity,
    games,
    psu,
    cpuName: cpu.name,
    gpuName: gpu.name,
  };
}

export function getComboSlug(cpuId: string, gpuId: string): string {
  return `${cpuId}-with-${gpuId}`;
}

export function parseComboSlug(slug: string): { cpuId: string; gpuId: string } | null {
  const match = slug.match(/^(.+)-with-(.+)$/);
  if (!match) return null;
  return { cpuId: match[1], gpuId: match[2] };
}
