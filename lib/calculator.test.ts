import { describe, it, expect } from "vitest";
import { calculate, getComboSlug, parseComboSlug } from "../lib/calculator";
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

  it("Ryzen 7 9800X3D + GTX 1650: GPU bottleneck severe at ALL resolutions", () => {
    for (const res of ["1080p", "1440p", "4k"] as const) {
      const r = calculate("ryzen-7-9800x3d", "gtx-1650", res, "gaming");
      expect(r!.bottleneckType, `Expected GPU bottleneck at ${res}`).toBe("GPU Bottleneck");
      expect(r!.bottleneckSeverity, `Expected severe at ${res}`).toBe("severe");
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

// ─── Property tests ────────────────────────────────────────────────────────────

describe("Property tests", () => {
  it("Raising GPU tierScore never lowers FPS", () => {
    const r1 = calculate("i5-13600k", "rtx-3060", "1080p", "gaming");
    const r2 = calculate("i5-13600k", "rtx-4070-super", "1080p", "gaming");
    // RTX 4070 Super has higher tierScore than RTX 3060
    expect(r2!.games[0].nativeMed).toBeGreaterThanOrEqual(r1!.games[0].nativeMed);
  });

  it("Raising CPU tierScore never lowers FPS", () => {
    const r1 = calculate("i5-8400", "rtx-3060", "1080p", "gaming");
    const r2 = calculate("ryzen-7-9800x3d", "rtx-3060", "1080p", "gaming");
    expect(r2!.games[0].nativeMed).toBeGreaterThanOrEqual(r1!.games[0].nativeMed);
  });

  it("Raising resolution never raises GPU-bound FPS (Cyberpunk, GPU-limited pair)", () => {
    // 9800X3D + RTX 3060 is GPU-bound at all resolutions
    const r1080 = calculate("ryzen-7-9800x3d", "rtx-3060", "1080p", "gaming");
    const r1440 = calculate("ryzen-7-9800x3d", "rtx-3060", "1440p", "gaming");
    const r4k = calculate("ryzen-7-9800x3d", "rtx-3060", "4k", "gaming");

    const cp1080 = r1080!.games[0].nativeMed;
    const cp1440 = r1440!.games[0].nativeMed;
    const cp4k = r4k!.games[0].nativeMed;

    expect(cp1440).toBeLessThanOrEqual(cp1080 + 2); // allow 2 fps rounding tolerance
    expect(cp4k).toBeLessThanOrEqual(cp1440 + 2);
  });

  it("CPU bottleneck % is non-increasing from 1080p → 1440p → 4K (i5-8400 + RTX 4080 Super)", () => {
    const r1 = calculate("i5-8400", "rtx-4080-super", "1080p", "gaming")!;
    const r2 = calculate("i5-8400", "rtx-4080-super", "1440p", "gaming")!;
    const r3 = calculate("i5-8400", "rtx-4080-super", "4k", "gaming")!;

    // At higher res, GPU is more limited → CPU bottleneck % should not grow
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
    // i5-8400: 65W, RTX 3060: 170W, overhead: 75W → peak = 310W
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

  it("all recommendedUpgradeIds exist", () => {
    for (const cpu of cpus) {
      expect(
        allIds.has(cpu.recommendedUpgradeId as string),
        `CPU ${cpu.id} upgrade "${cpu.recommendedUpgradeId}" not found`
      ).toBe(true);
    }
    for (const gpu of gpus) {
      expect(
        allIds.has(gpu.recommendedUpgradeId as string),
        `GPU ${gpu.id} upgrade "${gpu.recommendedUpgradeId}" not found`
      ).toBe(true);
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
    const required = ["id", "name", "brand", "tierScore", "tdpWatts", "cores", "recommendedUpgradeId", "amazonQuery", "mobile"];
    for (const cpu of cpus) {
      for (const field of required) {
        expect(cpu[field], `CPU ${cpu.id} missing field "${field}"`).toBeDefined();
      }
    }
  });

  it("no missing required fields on GPUs", () => {
    const required = ["id", "name", "brand", "tierScore", "tdpWatts", "vramGb", "recommendedUpgradeId", "amazonQuery", "dlss", "fsr3FrameGen", "xess", "mobile"];
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

  it("GTX cards have dlss='none'", () => {
    for (const gpu of gpus) {
      const id = gpu.id as string;
      if (id.startsWith("gtx-") || id === "mx450") {
        expect(
          gpu.dlss,
          `${id} is a GTX/MX card and must have dlss="none"`
        ).toBe("none");
      }
    }
  });

  it("fsr3FrameGen and xess are booleans", () => {
    for (const gpu of gpus) {
      expect(typeof gpu.fsr3FrameGen, `${gpu.id} fsr3FrameGen`).toBe("boolean");
      expect(typeof gpu.xess, `${gpu.id} xess`).toBe("boolean");
    }
  });
});
