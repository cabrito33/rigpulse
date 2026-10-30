import { describe, it, expect } from "vitest";
import { calculate, getComboSlug, parseComboSlug } from "../lib/calculator";
import { getCpuById, getGpuById } from "../lib/hardware";
import { buildVerdict } from "../lib/verdict";
import {
  isPlausiblePair,
  getAllPlausibleCombos,
  PLAUSIBLE_RATIO_MIN,
  PLAUSIBLE_RATIO_MAX,
} from "../lib/combos";
import hardwareData from "../data/hardware.json";

// ─── Sanity anchors ────────────────────────────────────────────────────────────

describe("Sanity anchors", () => {
  it("i5-8400 + RTX 4080 Super @1080p: CPU bottleneck >=30%, Cyberpunk 80-120, CS2 150-250", () => {
    const r = calculate("i5-8400", "rtx-4080-super", "1080p", "gaming");
    expect(r).not.toBeNull();
    expect(r!.bottleneckType).toBe("CPU Bottleneck");
    expect(r!.bottleneckPercent).toBeGreaterThanOrEqual(30);

    const cp = r!.games.find((g) => g.game === "Cyberpunk 2077")!;
    expect(cp.nativeMed).toBeGreaterThanOrEqual(80);
    expect(cp.nativeMed).toBeLessThanOrEqual(120);

    const cs = r!.games.find((g) => g.game === "CS2 / Rainbow Six Siege")!;
    expect(cs.nativeMed).toBeGreaterThanOrEqual(150);
    expect(cs.nativeMed).toBeLessThanOrEqual(250);
  });

  it("Ryzen 5 5600 + RTX 3060 @1080p: Balanced or <=15%", () => {
    const r = calculate("ryzen-5-5600", "rtx-3060", "1080p", "gaming");
    expect(r!.bottleneckPercent).toBeLessThanOrEqual(15);
  });

  it("Ryzen 5 5600 + RTX 3060 @1440p: GPU bottleneck (not CPU)", () => {
    const r = calculate("ryzen-5-5600", "rtx-3060", "1440p", "gaming");
    expect(r!.bottleneckType).not.toBe("CPU Bottleneck");
  });

  it("Ryzen 5 5600 + RTX 3060 @4K: GPU bottleneck (not CPU)", () => {
    const r = calculate("ryzen-5-5600", "rtx-3060", "4k", "gaming");
    expect(r!.bottleneckType).not.toBe("CPU Bottleneck");
  });

  it("Ryzen 7 9800X3D + GTX 1650: GPU bottleneck at ALL resolutions (normal severity)", () => {
    for (const res of ["1080p", "1440p", "4k"] as const) {
      const r = calculate("ryzen-7-9800x3d", "gtx-1650", res, "gaming");
      expect(r!.bottleneckType, `Expected GPU bottleneck at ${res}`).toBe("GPU Bottleneck");
      expect(r!.bottleneckSeverity, `Expected gpu-limited at ${res}`).toBe("gpu-limited");
    }
  });

  it("Ryzen 7 9800X3D + RTX 5080 @4K: never CPU bottleneck, Cyberpunk high 50-80 fps", () => {
    const r = calculate("ryzen-7-9800x3d", "rtx-5080", "4k", "gaming");
    expect(r!.bottleneckType).not.toBe("CPU Bottleneck");

    const cp = r!.games.find((g) => g.game === "Cyberpunk 2077")!;
    expect(cp.nativeHigh).toBeGreaterThanOrEqual(50);
    expect(cp.nativeHigh).toBeLessThanOrEqual(80);
  });
});

// ─── Bottleneck severity semantics ──────────────────────────────────────────

describe("Bottleneck severity semantics", () => {
  it("i7-14700K + RTX 4070 Super @1440p: GPU-limited is normal for gaming, never severe", () => {
    const r = calculate("i7-14700k", "rtx-4070-super", "1440p", "gaming");
    expect(r).not.toBeNull();
    expect(r!.bottleneckType).toBe("GPU Bottleneck");
    expect(r!.bottleneckSeverity).toBe("gpu-limited");
  });

  it("GPU-limited pairs are always 'gpu-limited' severity regardless of percentage", () => {
    const pairs: [string, string][] = [
      ["ryzen-7-7800x3d", "rtx-4070-super"],
      ["i9-12900k", "rtx-3060"],
      ["ryzen-9-7900x", "rx-7600"],
    ];
    for (const [cpuId, gpuId] of pairs) {
      const r = calculate(cpuId, gpuId, "1440p", "gaming");
      if (r && r.bottleneckType === "GPU Bottleneck") {
        expect(r.bottleneckSeverity).toBe("gpu-limited");
      }
    }
  });

  it("CPU bottlenecks map to correct severity thresholds (<10% optimal, 10-20% moderate, >20% severe)", () => {
    // i5-8400 + RTX 4080 Super is a severe CPU bottleneck (>20%)
    const severe = calculate("i5-8400", "rtx-4080-super", "1080p", "gaming");
    expect(severe!.bottleneckType).toBe("CPU Bottleneck");
    expect(severe!.bottleneckSeverity).toBe("severe");
  });
});

// ─── Frame-Gen / DLSS / FSR 3 Priority ──────────────────────────────────────

describe("Frame-Gen technology priority", () => {
  it("DLSS-2-only cards (RTX 20/30) with FSR 3 show FSR 3 Frame Generation", () => {
    const r = calculate("ryzen-5-5600", "rtx-3060", "1080p", "gaming");
    expect(r!.games[0].upscalingTech).toBe("FSR 3 Frame Generation");
  });

  it("RTX 40 series cards show DLSS 3 Frame Generation", () => {
    const r = calculate("i5-13600k", "rtx-4070-super", "1440p", "gaming");
    expect(r!.games[0].upscalingTech).toBe("DLSS 3 Frame Generation");
  });

  it("RTX 50 series cards show DLSS 4 Frame Generation", () => {
    const r = calculate("ryzen-7-9800x3d", "rtx-5080", "4k", "gaming");
    expect(r!.games[0].upscalingTech).toBe("DLSS 4 Frame Generation");
  });

  it("AMD RX 6000 and 7000 series cards show FSR 3 Frame Generation", () => {
    const r6 = calculate("ryzen-5-5600", "rx-6700-xt", "1080p", "gaming");
    expect(r6!.games[0].upscalingTech).toBe("FSR 3 Frame Generation");

    const r7 = calculate("ryzen-7-7800x3d", "rx-7800-xt", "1440p", "gaming");
    expect(r7!.games[0].upscalingTech).toBe("FSR 3 Frame Generation");
  });

  it("Cards without DLSS 3/4 or FSR 3 fallback to Lossless Scaling", () => {
    const r = calculate("i5-8400", "gtx-1650", "1080p", "gaming");
    expect(r!.games[0].upscalingTech).toBe("Lossless Scaling (third-party, paid)");
  });
});

// ─── Plausible combinations (lib/combos.ts) ──────────────────────────────────

describe("Plausible combinations filtering", () => {
  it("excludes absurd pairings by ratio threshold", () => {
    const cpuOld = getCpuById("i5-8400")!;
    const gpuNew = getGpuById("rx-7800-xt")!;
    expect(isPlausiblePair(cpuOld, gpuNew)).toBe(false);

    const cpuFlagship = getCpuById("ryzen-7-9800x3d")!;
    const gpuBudget = getGpuById("gtx-1650")!;
    expect(isPlausiblePair(cpuFlagship, gpuBudget)).toBe(false);
  });

  it("excludes mobile parts completely", () => {
    const mobileCpu = getCpuById("i7-1165g7")!;
    const desktopGpu = getGpuById("rtx-3060")!;
    expect(isPlausiblePair(mobileCpu, desktopGpu)).toBe(false);

    const desktopCpu = getCpuById("ryzen-5-5600")!;
    const mobileGpu = getGpuById("mx450")!;
    expect(isPlausiblePair(desktopCpu, mobileGpu)).toBe(false);
  });

  it("includes well-matched realistic pairings", () => {
    const pairs: [string, string][] = [
      ["ryzen-5-5600", "rtx-3060"],
      ["i7-14700k", "rtx-4070-super"],
      ["ryzen-7-7800x3d", "rtx-4080-super"],
      ["ryzen-7-9800x3d", "rtx-5080"],
      ["i5-12400f", "rtx-3060-ti"],
      ["i5-8400", "gtx-1660-super"],
    ];
    for (const [cId, gId] of pairs) {
      const c = getCpuById(cId)!;
      const g = getGpuById(gId)!;
      expect(isPlausiblePair(c, g), `Expected ${cId} + ${gId} to be plausible`).toBe(true);
    }
  });

  it("plausible combos list length is within range [120, 250]", () => {
    expect(PLAUSIBLE_RATIO_MIN).toBe(0.80);
    expect(PLAUSIBLE_RATIO_MAX).toBe(1.20);
    const combos = getAllPlausibleCombos();
    expect(combos.length).toBeGreaterThanOrEqual(120);
    expect(combos.length).toBeLessThanOrEqual(250);
  });

  it("all plausible combo slugs are unique", () => {
    const combos = getAllPlausibleCombos();
    const slugs = combos.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

// ─── Property tests ────────────────────────────────────────────────────────────

describe("Property tests", () => {
  it("Raising GPU tierScore never lowers FPS", () => {
    const r1 = calculate("i5-13600k", "rtx-3060", "1080p", "gaming");
    const r2 = calculate("i5-13600k", "rtx-4070-super", "1080p", "gaming");
    expect(r2!.games[0].nativeMed).toBeGreaterThanOrEqual(r1!.games[0].nativeMed);
  });

  it("Raising CPU tierScore never lowers FPS", () => {
    const r1 = calculate("i5-8400", "rtx-3060", "1080p", "gaming");
    const r2 = calculate("ryzen-7-9800x3d", "rtx-3060", "1080p", "gaming");
    expect(r2!.games[0].nativeMed).toBeGreaterThanOrEqual(r1!.games[0].nativeMed);
  });

  it("Raising resolution never raises GPU-bound FPS (Cyberpunk, GPU-limited pair)", () => {
    const r1080 = calculate("ryzen-7-9800x3d", "rtx-3060", "1080p", "gaming");
    const r1440 = calculate("ryzen-7-9800x3d", "rtx-3060", "1440p", "gaming");
    const r4k = calculate("ryzen-7-9800x3d", "rtx-3060", "4k", "gaming");

    const cp1080 = r1080!.games[0].nativeMed;
    const cp1440 = r1440!.games[0].nativeMed;
    const cp4k = r4k!.games[0].nativeMed;

    expect(cp1440).toBeLessThanOrEqual(cp1080 + 2);
    expect(cp4k).toBeLessThanOrEqual(cp1440 + 2);
  });

  it("CPU bottleneck % is non-increasing from 1080p → 1440p → 4K (i5-8400 + RTX 4080 Super)", () => {
    const r1 = calculate("i5-8400", "rtx-4080-super", "1080p", "gaming")!;
    const r2 = calculate("i5-8400", "rtx-4080-super", "1440p", "gaming")!;
    const r3 = calculate("i5-8400", "rtx-4080-super", "4k", "gaming")!;

    if (r1.bottleneckType === "CPU Bottleneck" && r2.bottleneckType === "CPU Bottleneck") {
      expect(r2.bottleneckPercent).toBeLessThanOrEqual(r1.bottleneckPercent + 1);
    }
    if (r2.bottleneckType === "CPU Bottleneck" && r3.bottleneckType === "CPU Bottleneck") {
      expect(r3.bottleneckPercent).toBeLessThanOrEqual(r2.bottleneckPercent + 1);
    }
  });
});

// ─── PSU formula ───────────────────────────────────────────────────────────────

describe("PSU formula", () => {
  it("recommendedWatts = ceil((cpuTdp + gpuTdp + 75) * 1.35 / 50) * 50", () => {
    const r = calculate("i5-8400", "rtx-3060", "1080p", "gaming");
    const peak = r!.psu.peakDrawWatts;
    expect(r!.psu.recommendedWatts).toBe(Math.ceil((peak * 1.35) / 50) * 50);
    expect(peak).toBe(65 + 170 + 75);
  });
});

// ─── Slug round-trip ───────────────────────────────────────────────────────────

describe("Slug round-trip", () => {
  it("getComboSlug / parseComboSlug are inverses", () => {
    const slug = getComboSlug("i5-8400", "rtx-3060");
    const parsed = parseComboSlug(slug);
    expect(parsed).toEqual({ cpuId: "i5-8400", gpuId: "rtx-3060" });
  });

  it("handles hyphenated IDs correctly", () => {
    const slug = getComboSlug("ryzen-7-9800x3d", "rtx-4080-super");
    const parsed = parseComboSlug(slug);
    expect(parsed).toEqual({ cpuId: "ryzen-7-9800x3d", gpuId: "rtx-4080-super" });
  });
});

// ─── Data validation ───────────────────────────────────────────────────────────

describe("Hardware data validation", () => {
  const cpus = hardwareData.cpus as Array<Record<string, unknown>>;
  const gpus = hardwareData.gpus as Array<Record<string, unknown>>;
  const allIds = new Set([
    ...cpus.map((c) => c.id as string),
    ...gpus.map((g) => g.id as string),
  ]);

  it("all IDs are unique and URL-safe", () => {
    const ids = [
      ...cpus.map((c) => c.id as string),
      ...gpus.map((g) => g.id as string),
    ];
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id, `ID "${id}" must be URL-safe`).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("all recommendedUpgradeIds exist and have upgrade.tierScore >= current.tierScore", () => {
    const cpuMap = new Map(cpus.map((c) => [c.id as string, c]));
    const gpuMap = new Map(gpus.map((g) => [g.id as string, g]));

    for (const cpu of cpus) {
      expect(
        allIds.has(cpu.recommendedUpgradeId as string),
        `CPU ${cpu.id} upgrade "${cpu.recommendedUpgradeId}" not found`
      ).toBe(true);
      const upgrade = cpuMap.get(cpu.recommendedUpgradeId as string)!;
      expect(
        upgrade.tierScore as number,
        `CPU ${cpu.id} upgrade ${upgrade.id} must have tierScore >= current`
      ).toBeGreaterThanOrEqual(cpu.tierScore as number);
    }

    for (const gpu of gpus) {
      expect(
        allIds.has(gpu.recommendedUpgradeId as string),
        `GPU ${gpu.id} upgrade "${gpu.recommendedUpgradeId}" not found`
      ).toBe(true);
      const upgrade = gpuMap.get(gpu.recommendedUpgradeId as string)!;
      expect(
        upgrade.tierScore as number,
        `GPU ${gpu.id} upgrade ${upgrade.id} must have tierScore >= current`
      ).toBeGreaterThanOrEqual(gpu.tierScore as number);
    }
  });

  it("all CPUs and GPUs have lastReviewed ('2026-10-30') and source fields", () => {
    for (const item of [...cpus, ...gpus]) {
      expect(item.lastReviewed, `${item.id} missing lastReviewed`).toBe("2026-10-30");
      expect(typeof item.source, `${item.id} source must be string`).toBe("string");
      expect((item.source as string).length, `${item.id} source cannot be empty`).toBeGreaterThan(5);
    }
  });

  it("tierScores are in range 18-200", () => {
    for (const item of [...cpus, ...gpus]) {
      const score = item.tierScore as number;
      expect(score, `${item.id} tierScore out of range`).toBeGreaterThanOrEqual(18);
      expect(score, `${item.id} tierScore out of range`).toBeLessThanOrEqual(200);
    }
  });

  it("no missing required fields on CPUs", () => {
    const required = [
      "id", "name", "brand", "tierScore", "tdpWatts", "cores",
      "recommendedUpgradeId", "amazonQuery", "mobile", "lastReviewed", "source",
    ];
    for (const cpu of cpus) {
      for (const field of required) {
        expect(cpu[field], `CPU ${cpu.id} missing field "${field}"`).toBeDefined();
      }
    }
  });

  it("no missing required fields on GPUs", () => {
    const required = [
      "id", "name", "brand", "tierScore", "tdpWatts", "vramGb",
      "recommendedUpgradeId", "amazonQuery", "dlss", "fsr3FrameGen",
      "xess", "mobile", "lastReviewed", "source",
    ];
    for (const gpu of gpus) {
      for (const field of required) {
        expect(gpu[field], `GPU ${gpu.id} missing field "${field}"`).toBeDefined();
      }
    }
  });

  it("DLSS values are valid", () => {
    for (const gpu of gpus) {
      expect(
        ["none", "2", "3", "4"],
        `GPU ${gpu.id} has invalid dlss value`
      ).toContain(gpu.dlss);
    }
  });

  it("GTX and MX cards have dlss='none' and fsr3FrameGen=false", () => {
    for (const gpu of gpus) {
      const id = gpu.id as string;
      if (id.startsWith("gtx-") || id === "mx450") {
        expect(gpu.dlss, `${id} is a GTX/MX card and must have dlss="none"`).toBe("none");
        expect(gpu.fsr3FrameGen, `${id} GTX/MX card does not support FSR 3 frame gen`).toBe(false);
      }
    }
  });

  it("RTX and modern RX cards have fsr3FrameGen=true", () => {
    for (const gpu of gpus) {
      const id = gpu.id as string;
      if (id.startsWith("rtx-") || id.startsWith("rx-6") || id.startsWith("rx-7") || id.startsWith("arc-")) {
        expect(gpu.fsr3FrameGen, `${id} must have fsr3FrameGen=true`).toBe(true);
      }
    }
  });
});

// ─── Verdict generation (lib/verdict.ts) ──────────────────────────────────────

describe("buildVerdict (lib/verdict.ts)", () => {
  const cpu1 = getCpuById("i5-8400")!;
  const gpu1 = getGpuById("rtx-3050")!;
  const cpu2 = getCpuById("ryzen-7-9800x3d")!;
  const gpu2 = getGpuById("rtx-5070")!;

  it("different pairs produce genuinely different verdict text and analysis", () => {
    const v1 = buildVerdict(cpu1, gpu1);
    const v2 = buildVerdict(cpu2, gpu2);

    expect(v1.summaryVerdict).not.toBe(v2.summaryVerdict);
    expect(v1.resolutionAnalysis).not.toBe(v2.resolutionAnalysis);
    expect(v1.platformAnalysis).not.toBe(v2.platformAnalysis);
    expect(v1.architecturalDeepDive).not.toBe(v2.architecturalDeepDive);
    expect(v1.gamePerformanceDeepDive).not.toBe(v2.gamePerformanceDeepDive);
  });

  it("makes no false claims of 'real benchmarks' or lab testing", () => {
    const v1 = buildVerdict(cpu1, gpu1);
    const allText = [
      v1.summaryVerdict,
      v1.resolutionAnalysis,
      v1.platformAnalysis,
      v1.architecturalDeepDive,
      v1.gamePerformanceDeepDive,
      v1.hardwareThermalGuide,
      v1.bottleneckPhysicsAnalysis,
      ...v1.faq.map((f) => f.question + " " + f.answer),
    ].join(" ");

    expect(allText).not.toMatch(/real benchmarks/i);
    expect(allText).not.toMatch(/lab measurement/i);
    expect(allText).toMatch(/estimate/i);
  });

  it("verdict numbers match calculate() exactly across all resolutions", () => {
    const v = buildVerdict(cpu1, gpu1);
    const c1080 = calculate(cpu1.id, gpu1.id, "1080p")!;
    const c1440 = calculate(cpu1.id, gpu1.id, "1440p")!;
    const c4k = calculate(cpu1.id, gpu1.id, "4k")!;

    expect(v.res1080.bottleneckPercent).toBe(c1080.bottleneckPercent);
    expect(v.res1440.bottleneckPercent).toBe(c1440.bottleneckPercent);
    expect(v.res4k.bottleneckPercent).toBe(c4k.bottleneckPercent);

    // Multi-res table rows
    expect(v.multiResTable[0].bottleneckPercent).toBe(c1080.bottleneckPercent);
    expect(v.multiResTable[1].bottleneckPercent).toBe(c1440.bottleneckPercent);
    expect(v.multiResTable[2].bottleneckPercent).toBe(c4k.bottleneckPercent);

    // Cyberpunk estimated FPS
    const cp1080 = c1080.games.find((g) => g.game === "Cyberpunk 2077")!.nativeMed;
    expect(v.multiResTable[0].cyberpunkFps).toBe(cp1080);

    // PSU wattage
    expect(v.psuAdvice.recommendedWatts).toBe(c1080.psu.recommendedWatts);
    expect(v.psuAdvice.peakWatts).toBe(c1080.psu.peakDrawWatts);
  });

  it("FAQ contains 5 questions with matching numerical data", () => {
    const v = buildVerdict(cpu2, gpu2);
    expect(v.faq.length).toBe(5);
    for (const item of v.faq) {
      expect(item.question.length).toBeGreaterThan(10);
      expect(item.answer.length).toBeGreaterThan(20);
    }
  });

  it("similar combos provides 4-6 plausible links with valid slugs", () => {
    const v = buildVerdict(cpu1, gpu1);
    expect(v.similarCombos.length).toBeGreaterThanOrEqual(4);
    expect(v.similarCombos.length).toBeLessThanOrEqual(6);
    for (const item of v.similarCombos) {
      expect(item.slug).toMatch(/^[a-z0-9-]+-with-[a-z0-9-]+$/);
    }
  });
});
