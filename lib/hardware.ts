import hardwareData from "@/data/hardware.json";

export interface CPU {
  id: string;
  name: string;
  brand: "Intel" | "AMD";
  tierScore: number;
  tdpWatts: number;
  cores: number;
  socket: string | null;
  recommendedUpgradeId: string;
  amazonQuery: string;
  mobile: boolean;
  lastReviewed: string;
  source: string;
}

export interface GPU {
  id: string;
  name: string;
  brand: "NVIDIA" | "AMD" | "Intel";
  tierScore: number;
  tdpWatts: number;
  vramGb: number;
  recommendedUpgradeId: string;
  amazonQuery: string;
  /** DLSS version supported: "none" for GTX/MX, "2" for RTX 20/30, "3" for RTX 40, "4" for RTX 50 */
  dlss: "none" | "2" | "3" | "4";
  /** AMD FSR 3 Frame Generation (official support required) */
  fsr3FrameGen: boolean;
  /** Intel XeSS support */
  xess: boolean;
  mobile: boolean;
  lastReviewed: string;
  source: string;
}

export const cpus: CPU[] = hardwareData.cpus as CPU[];
export const gpus: GPU[] = hardwareData.gpus as GPU[];

export function getCpuById(id: string): CPU | undefined {
  return cpus.find((c) => c.id === id);
}

export function getGpuById(id: string): GPU | undefined {
  return gpus.find((g) => g.id === id);
}

export function getCpuUpgrade(cpu: CPU): CPU | undefined {
  if (cpu.recommendedUpgradeId === cpu.id) return undefined;
  return getCpuById(cpu.recommendedUpgradeId);
}

export function getGpuUpgrade(gpu: GPU): GPU | undefined {
  if (gpu.recommendedUpgradeId === gpu.id) return undefined;
  return getGpuById(gpu.recommendedUpgradeId);
}

/** Returns true if upgrading to upgradeCpu requires a new motherboard (different socket). */
export function platformChangeRequired(cpu: CPU, upgradeCpu: CPU): boolean {
  if (cpu.socket === null || upgradeCpu.socket === null) return true;
  return cpu.socket !== upgradeCpu.socket;
}

export const TOP_CPU_IDS = [
  "i5-8400", "i7-8700k", "i5-10400f", "i5-12400f", "i5-13400f",
  "i5-13600k", "ryzen-5-3600", "ryzen-5-5600", "ryzen-5-5600x",
  "ryzen-7-5800x3d", "ryzen-7-7800x3d", "ryzen-7-9800x3d",
];

export const TOP_GPU_IDS = [
  "gtx-1650", "gtx-1660-super", "rtx-2060", "rtx-3060", "rtx-3060-ti",
  "rtx-3070", "rtx-4060", "rtx-4060-ti", "rtx-4070-super",
  "rx-6600", "rx-6700-xt", "rx-7600", "rx-7800-xt",
];
