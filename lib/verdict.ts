import { type CPU, type GPU, platformChangeRequired, getCpuUpgrade, getGpuUpgrade } from "@/lib/hardware";
import { calculate, type BottleneckResult, type Resolution, getComboSlug } from "@/lib/calculator";
import { getAllPlausibleCombos } from "@/lib/combos";

export interface MultiResRow {
  resolution: Resolution;
  label: string;
  bottleneckPercent: number;
  bottleneckType: string;
  bottleneckSeverity: string;
  cyberpunkFps: number;
  cs2Fps: number;
  forzaFps: number;
  warzoneFps: number;
  eldenFps: number;
}

export interface GamePresetRow {
  game: string;
  lowFps: number;
  medFps: number;
  highFps: number;
  frameGenRange: string;
  upscalingTech: string;
  hasLatencyWarning: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SimilarComboItem {
  cpuId: string;
  gpuId: string;
  cpuName: string;
  gpuName: string;
  slug: string;
  relation: "same-cpu" | "same-gpu";
}

export interface HardwareComparison {
  title: string;
  componentName: string;
  slug: string;
  tierScoreDelta: number;
  cyberpunkFpsDelta: number;
  cs2FpsDelta: number;
  analysis: string;
  type: "faster-cpu" | "slower-cpu" | "faster-gpu" | "slower-gpu";
}

export interface HardwareSpecMatrix {
  cpu: {
    name: string;
    brand: string;
    cores: number;
    socket: string;
    tdpWatts: number;
    tierScore: number;
    segment: string;
  };
  gpu: {
    name: string;
    brand: string;
    vramGb: number;
    tdpWatts: number;
    tierScore: number;
    segment: string;
    dlssTech: string;
  };
  computeRatio: number;
  synergyAnalysis: string;
}

export interface VerdictData {
  cpu: CPU;
  gpu: GPU;
  res1080: BottleneckResult;
  res1440: BottleneckResult;
  res4k: BottleneckResult;
  introSentence: string;
  summaryVerdict: string;
  resolutionAnalysis: string;
  platformAnalysis: string;
  closingTakeaway: string;
  multiResTable: MultiResRow[];
  gamePresetsTable: GamePresetRow[];
  hardwareSpecs: HardwareSpecMatrix;
  comparisons: HardwareComparison[];
  frameGenAdvice: {
    technology: string;
    description: string;
    warning: string | null;
  };
  upgradeAdvice: {
    cpuUpgradeText: string | null;
    cpuUpgradeWarning: string | null;
    gpuUpgradeText: string | null;
    gpuUpgradeWarning: string | null;
  };
  psuAdvice: {
    peakWatts: number;
    recommendedWatts: number;
    monthlyCostEur: number;
    description: string;
  };
  faq: FaqItem[];
  similarCombos: SimilarComboItem[];
  deepDive: {
    drawCallPipelineNotes: string[];
    thermalPointers: string[];
    formulaBreakdown: {
      cpuCapCyberpunk: number;
      gpuCapCyberpunk1080: number;
      gpuCapCyberpunk1440: number;
      gpuCapCyberpunk4k: number;
      blendedMed1080: number;
    };
  };
}

/**
 * Deterministic integer hash for variant selection from slug string.
 */
function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function buildVerdict(cpu: CPU, gpu: GPU): VerdictData {
  const res1080 = calculate(cpu.id, gpu.id, "1080p")!;
  const res1440 = calculate(cpu.id, gpu.id, "1440p")!;
  const res4k = calculate(cpu.id, gpu.id, "4k")!;

  const slug = getComboSlug(cpu.id, gpu.id);
  const hash = hashSlug(slug);

  const cp1080 = res1080.games.find((g) => g.game === "Cyberpunk 2077")?.nativeMed ?? 0;
  const cs1080 = res1080.games.find((g) => g.game === "CS2 / Rainbow Six Siege")?.nativeMed ?? 0;
  const fz1080 = res1080.games.find((g) => g.game === "Forza Horizon 5")?.nativeMed ?? 0;
  const wz1080 = res1080.games.find((g) => g.game === "GTA V / Warzone")?.nativeMed ?? 0;
  const er1080 = res1080.games.find((g) => g.game === "Elden Ring / AAA Open World")?.nativeMed ?? 0;

  const cp1440 = res1440.games.find((g) => g.game === "Cyberpunk 2077")?.nativeMed ?? 0;
  const cs1440 = res1440.games.find((g) => g.game === "CS2 / Rainbow Six Siege")?.nativeMed ?? 0;
  const fz1440 = res1440.games.find((g) => g.game === "Forza Horizon 5")?.nativeMed ?? 0;
  const wz1440 = res1440.games.find((g) => g.game === "GTA V / Warzone")?.nativeMed ?? 0;
  const er1440 = res1440.games.find((g) => g.game === "Elden Ring / AAA Open World")?.nativeMed ?? 0;

  const cp4k = res4k.games.find((g) => g.game === "Cyberpunk 2077")?.nativeMed ?? 0;
  const cs4k = res4k.games.find((g) => g.game === "CS2 / Rainbow Six Siege")?.nativeMed ?? 0;
  const fz4k = res4k.games.find((g) => g.game === "Forza Horizon 5")?.nativeMed ?? 0;
  const wz4k = res4k.games.find((g) => g.game === "GTA V / Warzone")?.nativeMed ?? 0;
  const er4k = res4k.games.find((g) => g.game === "Elden Ring / AAA Open World")?.nativeMed ?? 0;

  // Segment classifications
  const isCpuHigh = cpu.tierScore >= 115;
  const isCpuBudget = cpu.tierScore < 70;
  const isGpuHigh = gpu.tierScore >= 115;
  const isGpuBudget = gpu.tierScore < 60;

  const cpuSegment = isCpuHigh
    ? "High-End Enthusiast"
    : isCpuBudget
    ? "Entry / Budget Tier"
    : "Mainstream Performance";
  const gpuSegment = isGpuHigh
    ? "High-End Enthusiast"
    : isGpuBudget
    ? "Entry / Budget Tier"
    : "Mainstream Performance";

  const isModernPlatform =
    cpu.socket === "AM5" || cpu.socket === "LGA1700" || cpu.socket === "LGA1851";
  const platformName = cpu.socket ? `${cpu.socket} socket` : "integrated OEM platform";

  // Compute synergy ratio
  const computeRatio = Number((cpu.tierScore / gpu.tierScore).toFixed(2));
  let synergyAnalysis = "";
  if (computeRatio > 1.25) {
    synergyAnalysis = `With a CPU-to-GPU compute ratio of ${computeRatio}, the ${cpu.name} provides ample instruction throughput headroom relative to the ${gpu.name}, ensuring maximum graphics card utilization across modern titles.`;
  } else if (computeRatio < 0.8) {
    synergyAnalysis = `At a compute ratio of ${computeRatio}, the ${gpu.name} outpaces CPU draw call throughput in high-refresh esports scenarios, making 1440p or 4K resolutions optimal to shift workload back onto the graphics card.`;
  } else {
    synergyAnalysis = `With a balanced compute ratio of ${computeRatio}, CPU frame dispatch capability closely mirrors GPU fill rate, offering well-aligned performance across diverse gaming engines.`;
  }

  // ─── 1. Deterministic Intro Sentence (4 variants via hash) ────────────────
  const introVariants = [
    `Pairing the ${cpu.name} with the ${gpu.name} creates an intriguing setup for modern gaming workloads.`,
    `Analyzing the combination of the ${cpu.name} processor and the ${gpu.name} graphics card reveals distinct performance dynamics across 1080p, 1440p, and 4K.`,
    `When evaluating the ${cpu.name} alongside the ${gpu.name}, real-world gaming balance is determined by the interplay between CPU frame dispatch and GPU pixel throughput.`,
    `This evaluation examines how effectively the ${cpu.name} feeds frames to the ${gpu.name} across competitive esports and demanding AAA titles.`,
  ];
  const introSentence = introVariants[hash % introVariants.length];

  // ─── 2. Deterministic Summary Verdict (4 variants per category) ───────────
  let summaryVerdict = "";
  const variantIndex = (hash >>> 2) % 4;

  if (res1080.bottleneckType === "GPU Bottleneck") {
    const gpuBoundVariants = [
      `The pairing of the ${cpu.name} and ${gpu.name} operates in a classic GPU-limited profile, which represents the standard and preferred state for PC gaming. At 1080p, the rig exhibits an estimated ${res1080.bottleneckPercent.toFixed(1)}% GPU limit, meaning the processor delivers more than enough draw-call throughput to allow the graphics card to reach peak capacity without CPU stutter.`,
      `With an estimated ${res1080.bottleneckPercent.toFixed(1)}% GPU limit at 1080p, the ${gpu.name} serves as the primary performance ceiling in this configuration. This is an optimal scenario for gaming because having your graphics card operate near 100% capacity produces consistent 1% low frametimes and predictable visual fluidity.`,
      `Our algorithmic model identifies the ${cpu.name} and ${gpu.name} as a GPU-bound pairing with an estimated ${res1080.bottleneckPercent.toFixed(1)}% variance at 1080p. The processor comfortably out-dispatches the rendering demands of the GPU, ensuring that upgrading in-game graphical details will not introduce processor-induced frame pacing hitches.`,
      `In this configuration, the ${gpu.name} is the primary determining factor for overall framerates, showing a ${res1080.bottleneckPercent.toFixed(1)}% GPU limit at 1080p. This ensures clean frame delivery and validates that the ${cpu.name} is not constricting graphic output in modern titles.`,
    ];
    summaryVerdict = gpuBoundVariants[variantIndex];
  } else if (res1080.bottleneckType === "Balanced") {
    const balancedVariants = [
      `Combining the ${cpu.name} with the ${gpu.name} achieves a remarkably well-balanced gaming profile. Across 1080p gameplay, our model calculates a minimal ${res1080.bottleneckPercent.toFixed(1)}% difference between CPU instruction dispatch and GPU rasterization headroom, maximizing compute investment without leaving hardware capability idle.`,
      `This hardware pairing is well matched, yielding an estimated ${res1080.bottleneckPercent.toFixed(1)}% balance variance at 1080p. Both the ${cpu.name} and the ${gpu.name} operate in close synergy, ensuring dependable frame rates in both simulation-heavy titles and graphically complex environments.`,
      `Our analysis indicates near-equilibrium for the ${cpu.name} and ${gpu.name}, with only a ${res1080.bottleneckPercent.toFixed(1)}% bottleneck at 1080p. Neither component severely holds back the other, representing an efficient allocation of budget and system power.`,
      `The ${cpu.name} and ${gpu.name} demonstrate strong hardware alignment at 1080p, with an estimated variance of just ${res1080.bottleneckPercent.toFixed(1)}%. This sweet-spot synergy delivers responsive gameplay without requiring immediate upgrades to either component.`,
    ];
    summaryVerdict = balancedVariants[variantIndex];
  } else {
    const cpuBoundVariants = [
      `In this configuration, the ${cpu.name} acts as the primary limiting component for the ${gpu.name} at 1080p, exhibiting an estimated ${res1080.bottleneckPercent.toFixed(1)}% CPU bottleneck. The graphics card possesses higher rendering headroom than the processor can consistently supply with draw calls during rapid scene transitions.`,
      `At 1080p resolution, the ${gpu.name} is constrained by the processing throughput of the ${cpu.name}, with an estimated ${res1080.bottleneckPercent.toFixed(1)}% CPU limit. While high graphical presets in AAA open worlds will shift weight to the GPU, fast-paced competitive esports titles will encounter frame caps dictated by CPU single-core speed.`,
      `Our calculation model identifies an estimated ${res1080.bottleneckPercent.toFixed(1)}% CPU bottleneck at 1080p for the ${cpu.name} and ${gpu.name} pairing. Transitioning to 1440p or 4K resolution increases pixel shading demands on the graphics card and naturally shifts the operational balance away from the CPU.`,
      `The ${cpu.name} limits the full frame potential of the ${gpu.name} by approximately ${res1080.bottleneckPercent.toFixed(1)}% at 1080p. While demanding graphical settings mitigate this variance, competitive multiplayer titles will reflect the CPU instruction ceiling.`,
    ];
    summaryVerdict = cpuBoundVariants[variantIndex];
  }

  // ─── 3. Deterministic Resolution Analysis (4 variants per tier) ───────────
  let resolutionAnalysis = "";
  const resVariantIndex = (hash >>> 4) % 4;

  if (isGpuHigh && isCpuHigh) {
    const enthusiastResVariants = [
      `Given the robust capabilities of both the ${cpu.name} and ${gpu.name}, 1440p (Quad HD) and 4K (Ultra HD) represent the ideal display targets. At 1080p the graphics card is under-extended, whereas 1440p produces an estimated ${cp1440} FPS in Cyberpunk 2077 and ${cs1440} FPS in CS2. At 4K, the GPU operates at full capacity (showing a ${res4k.bottleneckPercent.toFixed(1)}% GPU limit) while sustaining an estimated ${cp4k} FPS in demanding AAA open worlds.`,
      `To fully capitalize on this high-tier hardware, pairing the ${cpu.name} and ${gpu.name} with a 1440p high-refresh or 4K monitor is strongly recommended. At 1440p you can expect approximately ${cp1440} FPS in Cyberpunk 2077 and ${cs1440} FPS in competitive multiplayer. At 4K resolution, visual fidelity is pristine with estimated framerates around ${cp4k} FPS in intense titles.`,
      `This setup thrives at higher pixel densities. While 1080p leaves unused graphics compute, moving to 1440p achieves roughly ${cp1440} FPS in heavy single-player games and ${cs1440} FPS in esports shooters. Ultra HD 4K shifts workload entirely onto the ${gpu.name} (${res4k.bottleneckPercent.toFixed(1)}% GPU limit), delivering an estimated ${cp4k} FPS with sharp image clarity.`,
      `For enthusiasts running the ${cpu.name} with the ${gpu.name}, 1440p and 4K are the clear sweet spots. Expected 1440p performance reaches approximately ${cp1440} FPS in Cyberpunk 2077, while 4K rendering maintains roughly ${cp4k} FPS. Using an esports 1080p display under-utilizes the graphics card's shader potential.`,
    ];
    resolutionAnalysis = enthusiastResVariants[resVariantIndex];
  } else if (isGpuBudget || isCpuBudget) {
    const budgetResVariants = [
      `For this configuration, 1080p (Full HD) is the optimal resolution target. At 1080p, the system produces an estimated ${cp1080} FPS in demanding titles like Cyberpunk 2077 and ${cs1080} FPS in esports titles like CS2. Attempting native 1440p drops estimated Cyberpunk 2077 framerates to ${cp1440} FPS, where lower presets or resolution upscaling will be necessary to maintain fluid responsiveness.`,
      `We recommend targeting 1080p Full HD for the ${cpu.name} and ${gpu.name} pairing. You will achieve an estimated ${cp1080} FPS in modern open-world titles and ${cs1080} FPS in competitive shooters. While lightweight esports run acceptably at 1440p, demanding graphical releases will experience framerate dips without aggressive upscaling.`,
      `Targeting 1080p allows this hardware pairing to deliver responsive input latency and steady frame pacing, achieving approximately ${cp1080} FPS in Cyberpunk 2077 and ${cs1080} FPS in CS2. Scaling up to 1440p reduces Cyberpunk 2077 to roughly ${cp1440} FPS, making standard 1080p gaming displays the most balanced choice.`,
      `Standard 1080p gaming remains the practical home for the ${cpu.name} and ${gpu.name}. Estimated framerates clock in at ${cp1080} FPS in heavy AAA releases and ${cs1080} FPS in competitive games. Keeping settings at 1080p ensures responsive combat mechanics without overloading hardware buffers.`,
    ];
    resolutionAnalysis = budgetResVariants[resVariantIndex];
  } else {
    const mainstreamResVariants = [
      `The sweet spot for the ${cpu.name} and ${gpu.name} is 1080p High or 1440p Balanced. At 1080p, estimated framerates reach ${cp1080} FPS in Cyberpunk 2077 and ${cs1080} FPS in CS2. Stepping up to 1440p reduces the bottleneck variance to ${res1440.bottleneckPercent.toFixed(1)}%, yielding approximately ${cp1440} FPS in intensive AAA environments and ${cs1440} FPS in competitive shooters. At 4K, Cyberpunk 2077 delivers an estimated ${cp4k} FPS, where upscaling becomes valuable for maintaining 60 FPS.`,
      `This configuration provides versatile gaming performance across 1080p and 1440p displays. You can expect around ${cp1080} FPS in Cyberpunk 2077 at 1080p and ${cp1440} FPS at 1440p, accompanied by ${cs1080} and ${cs1440} FPS respectively in competitive titles. At 4K, heavy ray tracing or open-world assets adjust framerates to approximately ${cp4k} FPS.`,
      `Gamers will experience excellent flexibility with this setup on either 1080p high-refresh or 1440p standard monitors. Estimated Cyberpunk 2077 performance transitions from ${cp1080} FPS at 1080p to ${cp1440} FPS at 1440p, while CS2 maintains fluid rates of ${cs1080} and ${cs1440} FPS. 4K rendering drops AAA framerates to roughly ${cp4k} FPS, where upscaling helps secure smooth motion.`,
      `Operating across 1080p and 1440p presents the best balance of fidelity and frame pacing for the ${cpu.name} and ${gpu.name}. Cyberpunk 2077 delivers an estimated ${cp1080} FPS at 1080p and ${cp1440} FPS at 1440p. High-refresh multiplayer remains sharp with ${cs1080} FPS in CS2 at 1080p, adjusting to ${cs1440} FPS at 1440p.`,
    ];
    resolutionAnalysis = mainstreamResVariants[resVariantIndex];
  }

  // ─── 4. Deterministic Platform Analysis (4 variants per platform) ─────────
  let platformAnalysis = "";
  const platVariantIndex = (hash >>> 6) % 4;

  if (isModernPlatform) {
    const modernPlatVariants = [
      `Built on the contemporary ${platformName}, the ${cpu.name} benefits from high-speed memory architectures and PCIe Gen 4/5 interconnect bandwidth. This modern foundation provides solid future-proofing, allowing you to upgrade to a faster graphics card down the road without requiring a new motherboard or RAM kit.`,
      `The ${platformName} architecture underlying the ${cpu.name} ensures compatibility with modern NVMe storage and high-bandwidth expansion buses. Should you decide to upgrade the ${gpu.name} in future generations, the motherboard platform offers sufficient electrical and interconnect headroom to support faster hardware.`,
      `Leveraging the modern ${platformName}, this system is well positioned for platform longevity. High-frequency memory support and modern PCIe revisions minimize data transfer latencies between system memory and the ${gpu.name}'s onboard VRAM buffer.`,
      `By utilizing the current ${platformName}, the ${cpu.name} provides an accessible upgrade trajectory. Next-generation graphics cards can be dropped into this motherboard without creating artificial system interface bottlenecks.`,
    ];
    platformAnalysis = modernPlatVariants[platVariantIndex];
  } else {
    const legacyPlatVariants = [
      `The ${cpu.name} operates on the legacy ${platformName}, which utilizes DDR4 memory architectures. While still capable for contemporary gaming titles, substantial future processor upgrades beyond this socket will require a platform transition, including a newer motherboard and DDR5 system memory.`,
      `Because the ${cpu.name} resides on the mature ${platformName}, the platform upgrade ceiling is relatively defined. To extract the best possible consistency from this configuration, running dual-channel memory with active XMP/DOCP profiles is strongly recommended.`,
      `Operating on the legacy ${platformName}, this setup provides cost-effective gaming today. However, moving to next-generation processors will eventually necessitate replacing the motherboard and memory subsystem to adopt modern DDR5 standards.`,
      `The ${platformName} supporting the ${cpu.name} represents a proven, budget-friendly generation. While future high-end processor drops are constrained by socket compatibility, this build continues to provide capable framerates when paired with the ${gpu.name}.`,
    ];
    platformAnalysis = legacyPlatVariants[platVariantIndex];
  }

  // ─── 5. Deterministic Closing Takeaway (4 variants) ───────────────────────
  const takeawayVariants = [
    `Overall, the ${cpu.name} and ${gpu.name} configuration offers dependable gaming performance tailored to its target resolution, with straightforward upgrade pathways available when higher graphical fidelity or framerates are required.`,
    `In conclusion, pairing the ${cpu.name} with the ${gpu.name} creates an effective, functional gaming rig. Balancing display resolution with proper in-game quality settings will ensure smooth and enjoyable gameplay across both single-player adventures and competitive titles.`,
    `To summarize, this combination provides a solid balance of cost and computing capability. Following our recommended power supply and cooling guidelines will ensure system stability and longevity under extended gaming sessions.`,
    `Final takeaway: the ${cpu.name} and ${gpu.name} deliver consistent, predictable framerates in contemporary releases, providing a viable platform for gamers seeking a clear balance of visual fidelity and input responsiveness.`,
  ];
  const closingTakeaway = takeawayVariants[(hash >>> 8) % takeawayVariants.length];

  // ─── 6. Multi-Resolution Table ────────────────────────────────────────────
  const multiResTable: MultiResRow[] = [
    {
      resolution: "1080p",
      label: "1080p Full HD",
      bottleneckPercent: res1080.bottleneckPercent,
      bottleneckType: res1080.bottleneckType,
      bottleneckSeverity: res1080.bottleneckSeverity,
      cyberpunkFps: cp1080,
      cs2Fps: cs1080,
      forzaFps: fz1080,
      warzoneFps: wz1080,
      eldenFps: er1080,
    },
    {
      resolution: "1440p",
      label: "1440p Quad HD",
      bottleneckPercent: res1440.bottleneckPercent,
      bottleneckType: res1440.bottleneckType,
      bottleneckSeverity: res1440.bottleneckSeverity,
      cyberpunkFps: cp1440,
      cs2Fps: cs1440,
      forzaFps: fz1440,
      warzoneFps: wz1440,
      eldenFps: er1440,
    },
    {
      resolution: "4k",
      label: "4K Ultra HD",
      bottleneckPercent: res4k.bottleneckPercent,
      bottleneckType: res4k.bottleneckType,
      bottleneckSeverity: res4k.bottleneckSeverity,
      cyberpunkFps: cp4k,
      cs2Fps: cs4k,
      forzaFps: fz4k,
      warzoneFps: wz4k,
      eldenFps: er4k,
    },
  ];

  // ─── 7. Game Presets Table (Low / Medium / Ultra) ─────────────────────────
  const gamePresetsTable: GamePresetRow[] = res1080.games.map((g) => ({
    game: g.game,
    lowFps: g.nativeLow,
    medFps: g.nativeMed,
    highFps: g.nativeHigh,
    frameGenRange: `${g.frameGenMin}–${g.frameGenMax} fps`,
    upscalingTech: g.upscalingTech,
    hasLatencyWarning: Boolean(g.frameGenWarning),
  }));

  // ─── 8. Hardware Specs Matrix ─────────────────────────────────────────────
  const hardwareSpecs: HardwareSpecMatrix = {
    cpu: {
      name: cpu.name,
      brand: cpu.brand,
      cores: cpu.cores,
      socket: cpu.socket ?? "Integrated / OEM",
      tdpWatts: cpu.tdpWatts,
      tierScore: cpu.tierScore,
      segment: cpuSegment,
    },
    gpu: {
      name: gpu.name,
      brand: gpu.brand,
      vramGb: gpu.vramGb,
      tdpWatts: gpu.tdpWatts,
      tierScore: gpu.tierScore,
      segment: gpuSegment,
      dlssTech:
        gpu.dlss === "4"
          ? "DLSS 4 Multi-Frame Gen"
          : gpu.dlss === "3"
          ? "DLSS 3 Frame Gen"
          : gpu.dlss === "2"
          ? "DLSS 2 Super Resolution"
          : gpu.fsr3FrameGen
          ? "AMD FSR 3 Frame Gen"
          : "Driver / Lossless Scaling",
    },
    computeRatio,
    synergyAnalysis,
  };

  // ─── 9. Neighbouring Hardware Comparisons (Data-Driven with Real Numbers) ──
  const allCombos = getAllPlausibleCombos();
  const comparisons: HardwareComparison[] = [];

  // (a) Same GPU with neighbouring CPUs (faster and slower)
  const sameGpuCombos = allCombos.filter(
    (c) => c.gpu.id === gpu.id && c.cpu.id !== cpu.id
  );

  const fasterCpuCombo = sameGpuCombos
    .filter((c) => c.cpu.tierScore > cpu.tierScore)
    .sort((a, b) => a.cpu.tierScore - b.cpu.tierScore)[0];

  if (fasterCpuCombo) {
    const altRes = calculate(fasterCpuCombo.cpu.id, gpu.id, "1080p")!;
    const altCp = altRes.games.find((g) => g.game === "Cyberpunk 2077")?.nativeMed ?? 0;
    const altCs = altRes.games.find((g) => g.game === "CS2 / Rainbow Six Siege")?.nativeMed ?? 0;
    const tierDelta = fasterCpuCombo.cpu.tierScore - cpu.tierScore;
    const cpDelta = altCp - cp1080;
    const csDelta = altCs - cs1080;

    comparisons.push({
      title: `Faster CPU: ${fasterCpuCombo.cpu.name}`,
      componentName: fasterCpuCombo.cpu.name,
      slug: fasterCpuCombo.slug,
      tierScoreDelta: tierDelta,
      cyberpunkFpsDelta: cpDelta,
      cs2FpsDelta: csDelta,
      analysis: `Upgrading to the ${fasterCpuCombo.cpu.name} (+${tierDelta} CPU points) shifts 1080p Cyberpunk 2077 performance by ${cpDelta >= 0 ? "+" : ""}${cpDelta} FPS and CS2 by ${csDelta >= 0 ? "+" : ""}${csDelta} FPS, illustrating available draw call headroom for the ${gpu.name}.`,
      type: "faster-cpu",
    });
  }

  const slowerCpuCombo = sameGpuCombos
    .filter((c) => c.cpu.tierScore < cpu.tierScore)
    .sort((a, b) => b.cpu.tierScore - a.cpu.tierScore)[0];

  if (slowerCpuCombo) {
    const altRes = calculate(slowerCpuCombo.cpu.id, gpu.id, "1080p")!;
    const altCp = altRes.games.find((g) => g.game === "Cyberpunk 2077")?.nativeMed ?? 0;
    const altCs = altRes.games.find((g) => g.game === "CS2 / Rainbow Six Siege")?.nativeMed ?? 0;
    const tierDelta = slowerCpuCombo.cpu.tierScore - cpu.tierScore;
    const cpDelta = altCp - cp1080;
    const csDelta = altCs - cs1080;

    comparisons.push({
      title: `Alternative CPU: ${slowerCpuCombo.cpu.name}`,
      componentName: slowerCpuCombo.cpu.name,
      slug: slowerCpuCombo.slug,
      tierScoreDelta: tierDelta,
      cyberpunkFpsDelta: cpDelta,
      cs2FpsDelta: csDelta,
      analysis: `Stepping down to the ${slowerCpuCombo.cpu.name} (${tierDelta} CPU points) results in a ${cpDelta} FPS shift in Cyberpunk 2077 and ${csDelta} FPS in CS2 at 1080p, demonstrating how your current ${cpu.name} maintains superior frametime stability.`,
      type: "slower-cpu",
    });
  }

  // (b) Same CPU with neighbouring GPUs (faster and slower)
  const sameCpuCombos = allCombos.filter(
    (c) => c.cpu.id === cpu.id && c.gpu.id !== gpu.id
  );

  const fasterGpuCombo = sameCpuCombos
    .filter((c) => c.gpu.tierScore > gpu.tierScore)
    .sort((a, b) => a.gpu.tierScore - b.gpu.tierScore)[0];

  if (fasterGpuCombo) {
    const altRes = calculate(cpu.id, fasterGpuCombo.gpu.id, "1440p")!;
    const altCp = altRes.games.find((g) => g.game === "Cyberpunk 2077")?.nativeMed ?? 0;
    const altCs = altRes.games.find((g) => g.game === "CS2 / Rainbow Six Siege")?.nativeMed ?? 0;
    const tierDelta = fasterGpuCombo.gpu.tierScore - gpu.tierScore;
    const cpDelta = altCp - cp1440;
    const csDelta = altCs - cs1440;

    comparisons.push({
      title: `Faster GPU: ${fasterGpuCombo.gpu.name}`,
      componentName: fasterGpuCombo.gpu.name,
      slug: fasterGpuCombo.slug,
      tierScoreDelta: tierDelta,
      cyberpunkFpsDelta: cpDelta,
      cs2FpsDelta: csDelta,
      analysis: `Moving to the ${fasterGpuCombo.gpu.name} (+${tierDelta} GPU points) boosts 1440p Cyberpunk 2077 rendering by ${cpDelta >= 0 ? "+" : ""}${cpDelta} FPS and CS2 by ${csDelta >= 0 ? "+" : ""}${csDelta} FPS, which your ${cpu.name} handles with ease.`,
      type: "faster-gpu",
    });
  }

  // ─── 10. Frame Generation & Upscaling Intelligence ─────────────────────────
  const fgTech = res1080.games[0].upscalingTech;
  let fgDesc = "";
  let fgWarning: string | null = null;

  if (gpu.dlss === "4") {
    fgDesc = `The ${gpu.name} supports cutting-edge NVIDIA DLSS 4 with multi-frame generation. On GeForce RTX 50 series architectures, multi-frame generation generates up to 3 intermediate frames using dedicated Tensor cores, achieving up to a 2.50x frame rate multiplier without increasing CPU draw call load.`;
  } else if (gpu.dlss === "3") {
    fgDesc = `Equipped with NVIDIA Ada Lovelace architecture, the ${gpu.name} natively supports DLSS 3 Frame Generation. Utilizing the Optical Flow Accelerator, it generates 1 synthetic frame per native frame to boost visual smoothness by approximately 1.80x, making heavy ray tracing playable even at higher resolutions.`;
  } else if (gpu.fsr3FrameGen) {
    fgDesc = `The ${gpu.name} fully supports AMD FidelityFX Super Resolution 3 (FSR 3) Frame Generation. FSR 3 uses open-standard optical flow algorithms to generate alternate frames, boosting framerates by approximately 1.65x in supported titles without requiring proprietary Tensor hardware.`;
  } else {
    fgDesc = `While the ${gpu.name} does not feature native DLSS 3 or official FSR 3 frame generation support, third-party solutions such as Lossless Scaling (available on Steam) can inject universal frame generation via modern driver-level frame pacing, delivering an estimated 1.70x smoothness boost in windowed games.`;
  }

  if (cp1080 < 40 || cp1440 < 40) {
    fgWarning = `Latency Advisory: In graphically intensive titles where native rendering dips below 40 FPS, enabling Frame Generation will increase input latency. We advise lowering base shadow and volumetric presets to achieve at least 45–50 native FPS before enabling frame generation for optimal responsiveness.`;
  }

  // ─── 11. Upgrade Recommendations ──────────────────────────────────────────
  const cpuUpgrade = getCpuUpgrade(cpu);
  const gpuUpgrade = getGpuUpgrade(gpu);
  let cpuUpgradeText: string | null = null;
  let cpuUpgradeWarning: string | null = null;
  let gpuUpgradeText: string | null = null;
  let gpuUpgradeWarning: string | null = null;

  if (cpuUpgrade) {
    cpuUpgradeText = `If your gaming workload leans heavily into esports or CPU-intensive simulation titles, upgrading to the ${cpuUpgrade.name} increases CPU compute headroom by approximately ${(cpuUpgrade.tierScore - cpu.tierScore)} index points.`;
    if (platformChangeRequired(cpu, cpuUpgrade)) {
      cpuUpgradeWarning = `Platform Change Required: Upgrading from the ${cpu.name} (${cpu.socket ?? "OEM"}) to the ${cpuUpgrade.name} (${cpuUpgrade.socket}) requires a new motherboard and DDR5 system RAM.`;
    }
  }

  if (gpuUpgrade) {
    gpuUpgradeText = `For higher graphical fidelity, ray tracing, or moving to 1440p or 4K monitors, the ${gpuUpgrade.name} yields an estimated +${(gpuUpgrade.tierScore - gpu.tierScore)} relative performance score gain over the ${gpu.name}.`;
    const upgradedPeak = cpu.tdpWatts + gpuUpgrade.tdpWatts + 75;
    const upgradedRecommended = Math.ceil((upgradedPeak * 1.35) / 50) * 50;
    if (upgradedRecommended > res1080.psu.recommendedWatts) {
      gpuUpgradeWarning = `Power Supply Upgrade Required: The ${gpuUpgrade.name} increases system peak draw, raising the recommended power supply from ${res1080.psu.recommendedWatts}W to ${upgradedRecommended}W.`;
    }
  }

  // ─── 12. PSU Advice & Electricity Cost (4 hash-varied descriptions) ───────
  const psuVariants = [
    `The ${cpu.name} (${cpu.tdpWatts}W) alongside the ${gpu.name} (${gpu.tdpWatts}W) with 75W auxiliary system draw totals roughly ${res1080.psu.peakDrawWatts}W peak. With a 1.35x safety buffer for transient excursions, an 80+ Gold PSU rated at ${res1080.psu.recommendedWatts}W is advised. Gaming 3 hours daily at 60% load on typical 0.20 EUR/kWh rates runs about €${res1080.psu.monthlyCostEur.toFixed(2)} monthly.`,
    `Combining a ${cpu.tdpWatts}W processor and a ${gpu.tdpWatts}W graphics board with platform overhead results in an estimated ${res1080.psu.peakDrawWatts}W maximum draw. We recommend a ${res1080.psu.recommendedWatts}W power supply to absorb brief power spikes safely. Based on 0.20 EUR/kWh electricity pricing and 3 daily gaming hours (60% duty load), monthly utility costs average around €${res1080.psu.monthlyCostEur.toFixed(2)}.`,
    `Our power model tallies ${cpu.tdpWatts}W for the ${cpu.name}, ${gpu.tdpWatts}W for the ${gpu.name}, and 75W base load, reaching ~${res1080.psu.peakDrawWatts}W under load. Factoring in a 35% margin for transient spikes, a ${res1080.psu.recommendedWatts}W unit is optimal. Three hours of daily gaming at 60% workload translates to approximately €${res1080.psu.monthlyCostEur.toFixed(2)} per month at 0.20 EUR/kWh.`,
    `System electrical requirements cap out near ${res1080.psu.peakDrawWatts}W (${cpu.name} at ${cpu.tdpWatts}W, ${gpu.name} at ${gpu.tdpWatts}W, plus 75W periphery). A ${res1080.psu.recommendedWatts}W supply provides stable voltage regulation. Running 3 hours per day under typical 60% gaming loads at 0.20 EUR/kWh incurs an estimated €${res1080.psu.monthlyCostEur.toFixed(2)} in monthly electricity.`,
  ];
  const psuDescription = psuVariants[(hash >>> 10) % psuVariants.length];

  const psuAdvice = {
    peakWatts: res1080.psu.peakDrawWatts,
    recommendedWatts: res1080.psu.recommendedWatts,
    monthlyCostEur: res1080.psu.monthlyCostEur,
    description: psuDescription,
  };

  // ─── 13. Frequently Asked Questions (Dynamically Varied) ───────────────────
  const faq1Answers = [
    `At 1080p, the ${cpu.name} and ${gpu.name} pairing exhibits an estimated ${res1080.bottleneckPercent.toFixed(1)}% ${res1080.bottleneckType}. ${
      res1080.bottleneckType === "GPU Bottleneck"
        ? "This GPU-limited scenario is the standard, ideal behavior for PC gaming rigs, allowing your graphics card to be fully utilized."
        : res1080.bottleneckSeverity === "optimal"
        ? "This represents an exceptionally balanced pairing where neither component significantly limits the other."
        : "The CPU is the limiting component in fast-paced competitive games, though higher resolutions will shift load naturally to the GPU."
    } At 1440p, the dynamic shifts to a ${res1440.bottleneckPercent.toFixed(1)}% ${res1440.bottleneckType}.`,
    `Our 1080p model records a ${res1080.bottleneckPercent.toFixed(1)}% ${res1080.bottleneckType} for this pairing. ${
      res1080.bottleneckType === "GPU Bottleneck"
        ? "Having the GPU operate as the limiter is normal and desirable for stable frametimes."
        : res1080.bottleneckSeverity === "optimal"
        ? "Both hardware parts work in tight synchrony without wasteful throughput overhead."
        : "Draw calls from the processor constrain top framerates in lightweight esports titles."
    } Scaling up to 1440p adjusts the relationship to a ${res1440.bottleneckPercent.toFixed(1)}% ${res1440.bottleneckType}.`,
    `Testing this rig at 1080p shows a ${res1080.bottleneckPercent.toFixed(1)}% ${res1080.bottleneckType}. ${
      res1080.bottleneckType === "GPU Bottleneck"
        ? "This demonstrates that the processor delivers more than enough instructions to keep the graphics card fully engaged."
        : res1080.bottleneckSeverity === "optimal"
        ? "Performance is well distributed across both computing silicon blocks."
        : "Esports players may observe lower peak framerates than the graphics card alone could generate."
    } Stepping to 1440p transitions the balance to ${res1440.bottleneckPercent.toFixed(1)}% ${res1440.bottleneckType}.`,
  ];

  const faq2Answers = [
    `The recommended resolution for this hardware pairing is ${
      isGpuHigh && isCpuHigh
        ? "1440p Quad HD or 4K Ultra HD"
        : isGpuBudget || isCpuBudget
        ? "1080p Full HD"
        : "1080p High or 1440p Balanced"
    }. At this target resolution, both components operate harmoniously without leaving performance untapped or overloading the rendering pipeline.`,
    `We advise playing at ${
      isGpuHigh && isCpuHigh
        ? "1440p or 4K"
        : isGpuBudget || isCpuBudget
        ? "1080p"
        : "1080p or 1440p"
    } with this combination. This aligns rendering demands with available memory bandwidth and rasterization speed.`,
    `For the ${cpu.name} with ${gpu.name}, the sweet spot display target is ${
      isGpuHigh && isCpuHigh
        ? "1440p Quad HD or 4K"
        : isGpuBudget || isCpuBudget
        ? "1080p Full HD"
        : "1080p High / 1440p Balanced"
    }, preserving smooth frame consistency.`,
  ];

  const faq3Answers = [
    `At 1080p medium settings, our model estimates approximately ${cp1080} FPS in Cyberpunk 2077 and ${cs1080} FPS in CS2. At 1440p, expectations adjust to approximately ${cp1440} FPS in Cyberpunk 2077 and ${cs1440} FPS in CS2. Performance estimates are derived from relative hardware performance indices under standard thermal conditions.`,
    `Expect roughly ${cp1080} FPS in Cyberpunk 2077 and ${cs1080} FPS in CS2 at 1080p medium presets. Moving to 1440p yields an estimated ${cp1440} FPS in Cyberpunk 2077 alongside ${cs1440} FPS in competitive multiplayer.`,
    `Our calculations project ~${cp1080} FPS in heavy open worlds like Cyberpunk 2077 and ~${cs1080} FPS in CS2 at 1080p medium. When gaming at 1440p, framerates scale to ~${cp1440} FPS and ~${cs1440} FPS respectively.`,
  ];

  const faq4Answers = [
    `We recommend a quality 80 Plus Gold certified power supply of at least ${res1080.psu.recommendedWatts}W for this combination. The total system peak draw measures approximately ${res1080.psu.peakDrawWatts}W under simultaneous CPU and GPU stress, including peripheral and motherboard overhead.`,
    `A certified power supply rated for at least ${res1080.psu.recommendedWatts}W is suggested. Peak system power is calculated at ${res1080.psu.peakDrawWatts}W under dual component stress, with safety headroom for voltage transients.`,
    `For reliable long-term operation, pair this hardware with a ${res1080.psu.recommendedWatts}W or greater 80 Plus Gold unit. Maximum system draw peaks near ${res1080.psu.peakDrawWatts}W during simultaneous processor and graphics loads.`,
  ];

  const faq: FaqItem[] = [
    {
      question: `Does the ${cpu.name} bottleneck the ${gpu.name} in modern gaming?`,
      answer: faq1Answers[(hash >>> 3) % faq1Answers.length],
    },
    {
      question: `What is the optimal display resolution for the ${cpu.name} and ${gpu.name}?`,
      answer: faq2Answers[(hash >>> 5) % faq2Answers.length],
    },
    {
      question: `What estimated FPS will the ${cpu.name} and ${gpu.name} produce in Cyberpunk 2077 and CS2?`,
      answer: faq3Answers[(hash >>> 7) % faq3Answers.length],
    },
    {
      question: `What size power supply (PSU) is needed for the ${cpu.name} and ${gpu.name}?`,
      answer: faq4Answers[(hash >>> 9) % faq4Answers.length],
    },
    {
      question: `Can the ${gpu.name} use Frame Generation technologies?`,
      answer: `Yes, this graphics card utilizes ${fgTech}. ${fgDesc}${fgWarning ? ` Note: ${fgWarning}` : ""}`,
    },
  ];

  // ─── 14. Similar Combos ───────────────────────────────────────────────────
  const sameCpu = allCombos
    .filter((c) => c.cpu.id === cpu.id && c.gpu.id !== gpu.id)
    .slice(0, 3)
    .map((c) => ({
      cpuId: c.cpu.id,
      gpuId: c.gpu.id,
      cpuName: c.cpu.name,
      gpuName: c.gpu.name,
      slug: c.slug,
      relation: "same-cpu" as const,
    }));

  const sameGpu = allCombos
    .filter((c) => c.gpu.id === gpu.id && c.cpu.id !== cpu.id)
    .slice(0, 3)
    .map((c) => ({
      cpuId: c.cpu.id,
      gpuId: c.gpu.id,
      cpuName: c.cpu.name,
      gpuName: c.gpu.name,
      slug: c.slug,
      relation: "same-gpu" as const,
    }));

  const similarCombos = [...sameCpu, ...sameGpu];

  // ─── 15. Deep Dive Structured Data (Zero Raw Markdown) ────────────────────
  const cpuTdpStr = `${cpu.tdpWatts}W`;
  const gpuTdpStr = `${gpu.tdpWatts}W`;
  const coolerRec =
    cpu.tdpWatts > 150
      ? "a 280mm or 360mm liquid AIO liquid cooler"
      : cpu.tdpWatts > 90
      ? "a dual-tower air cooler or 240mm liquid AIO"
      : "a single-tower heatpipe air cooler";

  const architecturalNotes = [
    `The ${cpu.name} features ${cpu.cores} physical cores with a thermal design power of ${cpuTdpStr}, operating on the ${cpu.socket ?? "OEM"} socket. Its single-core instruction throughput dictates the maximum draw-call dispatch speed before graphics rendering begins.`,
    `The ${gpu.name} integrates ${gpu.vramGb} GB of high-speed video memory with a rated board power of ${gpuTdpStr}. It handles rasterization, compute shaders, and texture filtering via ${gpu.brand} architecture.`,
    `Operating with ${fgTech}, the graphics pipeline can synthesize intermediate frames to enhance visual smoothness without increasing CPU draw call cycles.`,
  ];

  const thermalPointers = [
    `Processor Thermal Profile: With a TDP of ${cpuTdpStr}, we recommend ${coolerRec} to prevent thermal frequency throttling during prolonged gaming sessions.`,
    `Graphics Card Heat Dissipation: The ${gpu.name} expels up to ${gpuTdpStr} into the PC chassis. Maintaining positive-pressure airflow with at least two front intake fans keeps junction temperatures stable.`,
    `Power Delivery Margins: Modern hardware produces transient power spikes lasting milliseconds. Our recommended ${res1080.psu.recommendedWatts}W power supply includes the 1.35x capacitor buffer necessary to prevent unexpected shutdowns.`,
  ];

  const cpuBaseCp = 135; // CPU_BASE_FPS["Cyberpunk 2077"]
  const gpuBaseCp = 110; // GPU_BASE_FPS["Cyberpunk 2077"]
  const cpuCapCyberpunk = Math.round((cpuBaseCp * cpu.tierScore) / 100);
  const gpuCapCyberpunk1080 = Math.round((gpuBaseCp * gpu.tierScore) / 100 * 1.0);
  const gpuCapCyberpunk1440 = Math.round((gpuBaseCp * gpu.tierScore) / 100 * 0.68);
  const gpuCapCyberpunk4k = Math.round((gpuBaseCp * gpu.tierScore) / 100 * 0.38);

  return {
    cpu,
    gpu,
    res1080,
    res1440,
    res4k,
    introSentence,
    summaryVerdict,
    resolutionAnalysis,
    platformAnalysis,
    closingTakeaway,
    multiResTable,
    gamePresetsTable,
    hardwareSpecs,
    comparisons,
    frameGenAdvice: {
      technology: fgTech,
      description: fgDesc,
      warning: fgWarning,
    },
    upgradeAdvice: {
      cpuUpgradeText,
      cpuUpgradeWarning,
      gpuUpgradeText,
      gpuUpgradeWarning,
    },
    psuAdvice,
    faq,
    similarCombos,
    deepDive: {
      drawCallPipelineNotes: architecturalNotes,
      thermalPointers,
      formulaBreakdown: {
        cpuCapCyberpunk,
        gpuCapCyberpunk1080,
        gpuCapCyberpunk1440,
        gpuCapCyberpunk4k,
        blendedMed1080: cp1080,
      },
    },
  };
}
