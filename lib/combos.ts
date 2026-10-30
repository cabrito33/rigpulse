import { cpus, gpus, getCpuById, getGpuById, type CPU, type GPU } from "@/lib/hardware";
import { getComboSlug, parseComboSlug } from "@/lib/calculator";

/**
 * Ratio bounds tuned to generate between 120 and 250 realistic, high-intent
 * desktop hardware pairings for static pre-rendering and search indexing.
 * Excludes absurd pairings (e.g. i5-8400 + RX 7800 XT, 9800X3D + GTX 1650)
 * and all mobile hardware.
 */
export const PLAUSIBLE_RATIO_MIN = 0.80;
export const PLAUSIBLE_RATIO_MAX = 1.20;

/**
 * Returns true if a CPU and GPU combination represents a plausible real-world
 * gaming rig worthy of search engine indexing and static pre-rendering.
 */
export function isPlausiblePair(cpu: CPU, gpu: GPU): boolean {
  if (cpu.mobile || gpu.mobile) return false;
  const ratio = gpu.tierScore / cpu.tierScore;
  return ratio >= PLAUSIBLE_RATIO_MIN && ratio <= PLAUSIBLE_RATIO_MAX;
}

export interface PlausibleCombo {
  cpu: CPU;
  gpu: GPU;
  slug: string;
}

/**
 * Canonical list of plausible combinations used across static params,
 * sitemap generation, and popular combo listings.
 */
export function getAllPlausibleCombos(): PlausibleCombo[] {
  const result: PlausibleCombo[] = [];
  const desktopCpus = cpus.filter((c) => !c.mobile);
  const desktopGpus = gpus.filter((g) => !g.mobile);

  for (const cpu of desktopCpus) {
    for (const gpu of desktopGpus) {
      if (isPlausiblePair(cpu, gpu)) {
        result.push({
          cpu,
          gpu,
          slug: getComboSlug(cpu.id, gpu.id),
        });
      }
    }
  }

  return result;
}

/**
 * Checks whether a given combo slug corresponds to a plausible pair.
 */
export function isPlausibleSlug(slug: string): boolean {
  const parsed = parseComboSlug(slug);
  if (!parsed) return false;
  const cpu = getCpuById(parsed.cpuId);
  const gpu = getGpuById(parsed.gpuId);
  if (!cpu || !gpu) return false;
  return isPlausiblePair(cpu, gpu);
}
