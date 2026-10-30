import { getCpuById, getGpuById, type CPU, type GPU } from "@/lib/hardware";

export type Resolution = "1080p" | "1440p" | "4k";

// ─── Game base FPS tables ────────────────────────────────────────────────────
// GPU_BASE_FPS: estimated FPS a GPU at tierScore=100 produces at 1080p medium
// CPU_BASE_FPS: estimated FPS cap a CPU at tierScore=100 imposes (nearly
//   resolution-independent; CPU is the bottleneck only when cpuCap < gpuCap)
const GAMES = [
  "Cyberpunk 2077",
  "CS2 / Rainbow Six Siege",
  "Forza Horizon 5",
  "GTA V / Warzone",
  "Elden Ring / AAA Open World",
] as const;
type GameName = (typeof GAMES)[number];

const GPU_BASE_FPS: Record<GameName, number> = {
  // Calibrated so that GPU at tierScore=100 achieves these FPS at 1080p medium.
  // Cyberpunk 2077: high at 4K (RTX 5080 @4K nativeHigh ≈ 63 fps).
  // CS2: high base since competitive shooters can hit 400+ fps on fast GPUs.
  "Cyberpunk 2077": 150,
  "CS2 / Rainbow Six Siege": 450,
  "Forza Horizon 5": 250,
  "GTA V / Warzone": 280,
  "Elden Ring / AAA Open World": 200,
};

const CPU_BASE_FPS: Record<GameName, number> = {
  // CPU cap at tierScore=100; CS2/competitive titles are extremely CPU-bound.
  // Cyberpunk 2077 CPU cap slightly higher than GPU base so i5-8400 becomes
  // the bottleneck when paired with a high-end GPU.
  "Cyberpunk 2077": 160,
  "CS2 / Rainbow Six Siege": 450,
  "Forza Horizon 5": 250,
  "GTA V / Warzone": 280,
  "Elden Ring / AAA Open World": 200,
};

// Resolution scaling factor applied to GPU cap only (CPU cap stays constant)
const RES_FACTOR: Record<Resolution, number> = {
  "1080p": 1.0,
  "1440p": 0.68,
  "4k": 0.38,
};

// ─── Types ───────────────────────────────────────────────────────────────────
export interface GameBenchmark {
  game: string;
  /** Estimated FPS at Low settings (native, no frame gen) */
  nativeLow: number;
  /** Estimated FPS at Medium settings (native, no frame gen) */
  nativeMed: number;
  /** Estimated FPS at Ultra settings (native, no frame gen) */
  nativeHigh: number;
  /** Lower bound of frame-gen boosted FPS range */
  frameGenMin: number;
  /** Upper bound of frame-gen boosted FPS range */
  frameGenMax: number;
  /** Human-readable frame-gen / upscaling technology label */
  upscalingTech: string;
  /** True when base FPS < 40 — frame gen adds latency at low base FPS */
  frameGenWarning: boolean;
  /** True when GPU is the per-game limiting component at this resolution */
  gpuBound: boolean;
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
  cpuScore: number;
  gpuScore: number;
  /** Average CPU cap FPS across 5 games (for display) */
  avgCpuCapFps: number;
  /** Average GPU cap FPS across 5 games at this resolution (for display) */
  avgGpuCapFps: number;
  bottleneckPercent: number;
  bottleneckType: "CPU Bottleneck" | "GPU Bottleneck" | "Balanced";
  bottleneckSeverity: "optimal" | "moderate" | "severe";
  games: GameBenchmark[];
  psu: PSUResult;
  cpuName: string;
  gpuName: string;
}

// ─── Math helpers ─────────────────────────────────────────────────────────────
/**
 * Smooth minimum (k=6): the result is always ≤ min(a, b), and smoothly
 * approaches the lower value as the difference between a and b grows.
 * softMin(a, b, 6) ≈ min(a, b) when a ≠ b by more than ~20%.
 */
function softMin(a: number, b: number, k = 6): number {
  if (a <= 0 || b <= 0) return 0;
  return Math.pow(Math.pow(a, -k) + Math.pow(b, -k), -1 / k);
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

// ─── Frame-gen helpers ────────────────────────────────────────────────────────
function getUpscalingTech(gpu: GPU): string {
  if (gpu.dlss === "4") return "DLSS 4 Frame Generation";
  if (gpu.dlss === "3") return "DLSS 3 Frame Generation";
  if (gpu.fsr3FrameGen) return "FSR 3 Frame Generation";
  if (gpu.dlss === "2") return "DLSS 2 Upscaling (no frame generation)";
  if (gpu.xess) return "Lossless Scaling (third-party, paid)";
  return "Lossless Scaling (third-party, paid)";
}

/** Frame-gen multiplier applied only to the GPU-bound portion of FPS */
function frameGenMultiplier(gpu: GPU): number {
  if (gpu.dlss === "4") return 1.85;
  if (gpu.dlss === "3") return 1.80;
  if (gpu.fsr3FrameGen) return 1.65;
  if (gpu.dlss === "2") return 1.25; // upscaling only, no frame gen
  return 1.70; // Lossless Scaling estimate
}

// ─── Core calculator ─────────────────────────────────────────────────────────
/**
 * Calculate estimated FPS for a single game.
 * The smooth minimum ensures we never simply add CPU + GPU contributions —
 * the weaker component always limits the result.
 */
function calcGame(
  cpu: CPU,
  gpu: GPU,
  resolution: Resolution,
  game: GameName
): GameBenchmark {
  const cpuCap = CPU_BASE_FPS[game] * (cpu.tierScore / 100);
  const gpuCap = GPU_BASE_FPS[game] * (gpu.tierScore / 100) * RES_FACTOR[resolution];

  const nativeMed = Math.round(softMin(cpuCap, gpuCap));
  const gpuBound = gpuCap < cpuCap;

  // Settings multipliers: GPU-bound games have wider low/high spread
  const nativeLow = Math.round(nativeMed * (gpuBound ? 1.30 : 1.05));
  const nativeHigh = Math.round(nativeMed * (gpuBound ? 0.75 : 0.97));

  const tech = getUpscalingTech(gpu);
  const mult = frameGenMultiplier(gpu);

  // Apply frame-gen to medium FPS with ±variance for a realistic range
  const fgBase = nativeMed * mult;
  const frameGenMin = Math.round(fgBase * 0.92);
  const frameGenMax = Math.round(fgBase * 1.05);
  const frameGenWarning = nativeMed < 40;

  return {
    game,
    nativeLow: Math.max(nativeLow, 3),
    nativeMed: Math.max(nativeMed, 2),
    nativeHigh: Math.max(nativeHigh, 2),
    frameGenMin: Math.max(frameGenMin, 2),
    frameGenMax: Math.max(frameGenMax, 3),
    upscalingTech: tech,
    frameGenWarning,
    gpuBound,
  };
}

function calcPSU(
  cpu: CPU,
  gpu: GPU,
  hoursPerDay: number,
  kwhPrice: number
): PSUResult {
  const overhead = 75; // motherboard, RAM, NVMe, fans
  const peakDrawWatts = cpu.tdpWatts + gpu.tdpWatts + overhead;
  const recommendedWatts = Math.ceil((peakDrawWatts * 1.35) / 50) * 50;
  // Monthly kWh: assume 60% average load during gaming sessions
  const avgDraw = peakDrawWatts * 0.6;
  const kwhPerMonth = (avgDraw / 1000) * hoursPerDay * 30;
  const monthlyCostUsd = Math.round(kwhPerMonth * kwhPrice * 100) / 100;
  return { peakDrawWatts, recommendedWatts, monthlyCostUsd };
}

// ─── Public API ───────────────────────────────────────────────────────────────
export function calculate(
  cpuId: string,
  gpuId: string,
  resolution: Resolution,
  /** Kept for API compatibility — currently unused in the gaming model */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _purpose: "gaming" | "productivity" = "gaming",
  hoursPerDay = 6,
  kwhPrice = 0.15
): BottleneckResult | null {
  const cpu = getCpuById(cpuId);
  const gpu = getGpuById(gpuId);
  if (!cpu || !gpu) return null;

  const games = GAMES.map((g) => calcGame(cpu, gpu, resolution, g));

  // ── Bottleneck calculation ──────────────────────────────────────────────────
  // Average the per-game CPU cap and GPU cap to get an overall picture.
  // The side with the lower average cap is the bottleneck.
  let sumCpuCap = 0;
  let sumGpuCap = 0;
  for (const g of GAMES) {
    sumCpuCap += CPU_BASE_FPS[g] * (cpu.tierScore / 100);
    sumGpuCap += GPU_BASE_FPS[g] * (gpu.tierScore / 100) * RES_FACTOR[resolution];
  }
  const avgCpuCapFps = Math.round(sumCpuCap / GAMES.length);
  const avgGpuCapFps = Math.round(sumGpuCap / GAMES.length);

  const lower = Math.min(avgCpuCapFps, avgGpuCapFps);
  const higher = Math.max(avgCpuCapFps, avgGpuCapFps);
  const rawPercent = higher > 0 ? ((higher - lower) / higher) * 100 : 0;
  const bottleneckPercent = Math.round(clamp(rawPercent, 0, 90) * 10) / 10;

  let bottleneckType: BottleneckResult["bottleneckType"];
  if (bottleneckPercent < 10) {
    bottleneckType = "Balanced";
  } else if (avgCpuCapFps < avgGpuCapFps) {
    bottleneckType = "CPU Bottleneck";
  } else {
    bottleneckType = "GPU Bottleneck";
  }

  const bottleneckSeverity: BottleneckResult["bottleneckSeverity"] =
    bottleneckPercent < 10 ? "optimal" : bottleneckPercent < 20 ? "moderate" : "severe";

  const psu = calcPSU(cpu, gpu, hoursPerDay, kwhPrice);

  return {
    cpuId,
    gpuId,
    resolution,
    cpuScore: cpu.tierScore,
    gpuScore: gpu.tierScore,
    avgCpuCapFps,
    avgGpuCapFps,
    bottleneckPercent,
    bottleneckType,
    bottleneckSeverity,
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
