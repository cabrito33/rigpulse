import { type CPU, type GPU, platformChangeRequired, getCpuUpgrade, getGpuUpgrade } from "@/lib/hardware";
import { calculate, type BottleneckResult, type Resolution } from "@/lib/calculator";
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

export interface VerdictData {
  cpu: CPU;
  gpu: GPU;
  res1080: BottleneckResult;
  res1440: BottleneckResult;
  res4k: BottleneckResult;
  summaryVerdict: string;
  resolutionAnalysis: string;
  platformAnalysis: string;
  multiResTable: MultiResRow[];
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
    monthlyCost: number;
    description: string;
  };
  faq: FaqItem[];
  similarCombos: SimilarComboItem[];
  architecturalDeepDive: string;
  gamePerformanceDeepDive: string;
  hardwareThermalGuide: string;
  bottleneckPhysicsAnalysis: string;
}

export function buildVerdict(cpu: CPU, gpu: GPU): VerdictData {
  const res1080 = calculate(cpu.id, gpu.id, "1080p")!;
  const res1440 = calculate(cpu.id, gpu.id, "1440p")!;
  const res4k = calculate(cpu.id, gpu.id, "4k")!;

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

  // Classify tiers
  const isCpuHigh = cpu.tierScore >= 115;
  const isCpuBudget = cpu.tierScore < 70;
  const isGpuHigh = gpu.tierScore >= 115;
  const isGpuBudget = gpu.tierScore < 60;

  // Platform generation
  const isModernPlatform = cpu.socket === "AM5" || cpu.socket === "LGA1700" || cpu.socket === "LGA1851";
  const platformName = cpu.socket ? `${cpu.socket} platform` : "OEM / mobile platform";

  // Build natural English paragraphs
  let summaryVerdict = "";
  if (res1080.bottleneckType === "GPU Bottleneck") {
    summaryVerdict = `The pairing of the ${cpu.name} and ${gpu.name} represents a classic GPU-limited configuration, which is the preferred operating profile for PC gaming. At 1080p, the rig exhibits an estimated ${res1080.bottleneckPercent.toFixed(1)}% GPU limit, meaning your ${cpu.name} has more than enough processing headroom to feed the graphics pipeline without dropping frames. Because the graphics card operates at or near 100% capacity in demanding titles, you can expect stable 1% low frame times and minimal stuttering during intense scenes. This balance ensures that your CPU will not hold back visual settings or framerates.`;
  } else if (res1080.bottleneckType === "Balanced") {
    summaryVerdict = `Combining the ${cpu.name} with the ${gpu.name} results in a remarkably well-balanced gaming rig. Across 1080p gameplay, our model calculates a negligible ${res1080.bottleneckPercent.toFixed(1)}% variance between average CPU throughput and GPU rendering capacity. Both components reach their performance ceilings simultaneously, ensuring maximum hardware efficiency with virtually no wasted compute capacity on either side. This sweet-spot synergy is particularly cost-effective, delivering smooth, responsive gaming without requiring expensive upgrades to either component.`;
  } else {
    summaryVerdict = `In this pairing, the ${cpu.name} acts as the primary limiting factor for the ${gpu.name} at 1080p, showing an estimated ${res1080.bottleneckPercent.toFixed(1)}% CPU bottleneck. The graphics card possesses higher compute and rendering headroom than the processor can consistently feed with draw calls in CPU-heavy sequences. While graphically dense AAA games with high graphics presets will shift workload onto the GPU, high-refresh esports titles may see frame rates capped below the full potential of your ${gpu.name}. Stepping up to 1440p or 4K will shift the processing balance closer toward the GPU.`;
  }

  let resolutionAnalysis = "";
  if (isGpuHigh && isCpuHigh) {
    resolutionAnalysis = `Given the robust horsepower of both the ${cpu.name} and ${gpu.name}, 1440p (Quad HD) and 4K (Ultra HD) are the definitive sweet spots for this setup. At 1080p, the graphics card is underutilized, whereas at 1440p it delivers approximately ${cp1440} estimated FPS in Cyberpunk 2077 and ${cs1440} estimated FPS in competitive shooters like CS2. At 4K, the GPU workload dominates completely (showing a ${res4k.bottleneckPercent.toFixed(1)}% GPU limit), delivering pristine visual detail at an estimated ${cp4k} FPS in AAA titles. Pairing this configuration with a high-refresh 1440p or 4K gaming display maximizes your investment.`;
  } else if (isGpuBudget || isCpuBudget) {
    resolutionAnalysis = `For this hardware combination, 1080p (Full HD) is the ideal resolution target. At 1080p, the system produces an estimated ${cp1080} FPS in demanding AAA titles like Cyberpunk 2077 and ${cs1080} FPS in competitive multiplayer games such as CS2 and Rainbow Six Siege. While lightweight or older titles can run comfortably at 1440p (${cp1440} estimated FPS in Cyberpunk 2077), modern ray-traced releases will struggle beyond 1080p without aggressive resolution scaling. Keeping your display at 1080p ensures fluid frame rates, lower latency, and responsive input feel.`;
  } else {
    resolutionAnalysis = `The sweet spot for the ${cpu.name} and ${gpu.name} is 1080p High or 1440p Balanced. At 1080p, you can expect an estimated ${cp1080} FPS in Cyberpunk 2077 and a blazing ${cs1080} FPS in CS2. Moving up to 1440p reduces the CPU bottleneck to ${res1440.bottleneckPercent.toFixed(1)}%, yielding approximately ${cp1440} FPS in heavy AAA games and ${cs1440} FPS in competitive games. At 4K, rendering demands scale steeply, dropping Cyberpunk 2077 to an estimated ${cp4k} FPS, where upscaling technologies or lowered shadow settings will be necessary for consistent 60+ FPS performance.`;
  }

  let platformAnalysis = "";
  if (isModernPlatform) {
    platformAnalysis = `Built on the contemporary ${platformName}, the ${cpu.name} benefits from modern architectural conveniences, including high-bandwidth PCIe Gen 4/5 interfaces and rapid memory subsystems. This modern platform architecture provides ample longevity: should you decide to upgrade to an even faster graphics card in the future, the motherboard and memory configuration will readily accommodate next-generation hardware without immediate need for a complete platform overhaul.`;
  } else {
    platformAnalysis = `The ${cpu.name} operates on the legacy ${platformName}, which utilizes DDR4 memory and earlier PCIe revisions. While still very capable for current titles, future processor upgrades beyond the ${cpu.socket ?? "current"} ecosystem will necessitate a platform change, including a new motherboard and DDR5 system memory. For now, maximizing your RAM speed with dual-channel XMP/DOCP and ensuring modern NVMe storage will extract the highest possible frame consistency from this build.`;
  }

  // Multi-resolution table
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

  // Frame generation advice
  const fgTech = res1080.games[0].upscalingTech;
  let fgDesc = "";
  let fgWarning: string | null = null;

  if (gpu.dlss === "4") {
    fgDesc = `The ${gpu.name} supports cutting-edge NVIDIA DLSS 4 with multi-frame generation. In compatible titles, optical multi-frame generation uses dedicated Tensor cores to generate intermediate frames with minimal artifacts, multiplying frame throughput by up to 1.85× without loading CPU draw calls.`;
  } else if (gpu.dlss === "3") {
    fgDesc = `Equipped with NVIDIA Ada Lovelace architecture, the ${gpu.name} natively supports DLSS 3 Frame Generation. Utilizing the Optical Flow Accelerator, it generates entirely new synthetic frames to boost visual smoothness by approximately 1.80×, making heavy ray tracing playable even at higher resolutions.`;
  } else if (gpu.fsr3FrameGen) {
    fgDesc = `The ${gpu.name} fully supports AMD FidelityFX Super Resolution 3 (FSR 3) Frame Generation. FSR 3 uses open-standard optical flow algorithms to generate alternate frames, boosting framerates by approximately 1.65× in supported titles without requiring proprietary Tensor hardware.`;
  } else {
    fgDesc = `While the ${gpu.name} does not feature native DLSS 3 or official FSR 3 frame generation support, third-party solutions such as Lossless Scaling (available on Steam) can inject universal frame generation via modern driver-level frame pacing, delivering an estimated 1.70× smoothness boost in windowed games.`;
  }

  if (cp1080 < 40 || cp1440 < 40) {
    fgWarning = `Latency Advisory: In graphically intensive titles where native rendering dips below 40 FPS, enabling Frame Generation will increase input latency. We advise lowering base shadow and volumetric presets to achieve at least 45–50 native FPS before enabling frame generation for optimal responsiveness.`;
  }

  // Upgrades
  const cpuUpgrade = getCpuUpgrade(cpu);
  const gpuUpgrade = getGpuUpgrade(gpu);
  let cpuUpgradeText: string | null = null;
  let cpuUpgradeWarning: string | null = null;
  let gpuUpgradeText: string | null = null;
  let gpuUpgradeWarning: string | null = null;

  if (cpuUpgrade) {
    cpuUpgradeText = `If your gaming workload leans heavily into esports or CPU-intensive simulation titles, upgrading to the ${cpuUpgrade.name} increases CPU compute headroom by approximately ${(cpuUpgrade.tierScore - cpu.tierScore)} index points.`;
    if (platformChangeRequired(cpu, cpuUpgrade)) {
      cpuUpgradeWarning = `Platform Change Required: Upgrading from the ${cpu.name} (${cpu.socket ?? "Mobile"}) to the ${cpuUpgrade.name} (${cpuUpgrade.socket}) requires a new motherboard (and DDR5 system RAM if transitioning to modern AM5 or LGA1851/1700).`;
    }
  }

  if (gpuUpgrade) {
    gpuUpgradeText = `For higher graphical fidelity, ray tracing, or moving to 1440p/4K monitors, the ${gpuUpgrade.name} yields an estimated +${(gpuUpgrade.tierScore - gpu.tierScore)} relative performance score gain over the ${gpu.name}.`;
    const upgradedPeak = cpu.tdpWatts + gpuUpgrade.tdpWatts + 75;
    const upgradedRecommended = Math.ceil((upgradedPeak * 1.35) / 50) * 50;
    if (upgradedRecommended > res1080.psu.recommendedWatts) {
      gpuUpgradeWarning = `Power Supply Upgrade Required: The ${gpuUpgrade.name} increases system peak draw, raising the recommended power supply from ${res1080.psu.recommendedWatts}W to ${upgradedRecommended}W.`;
    }
  }

  // PSU advice
  const psuAdvice = {
    peakWatts: res1080.psu.peakDrawWatts,
    recommendedWatts: res1080.psu.recommendedWatts,
    monthlyCost: res1080.psu.monthlyCostUsd,
    description: `The ${cpu.name} (${cpu.tdpWatts}W TDP) and ${gpu.name} (${gpu.tdpWatts}W TDP) combine with standard motherboard, storage, and cooling overhead (75W) for a peak electrical draw of approximately ${res1080.psu.peakDrawWatts}W. Applying a 1.35× headroom safety buffer for transient voltage spikes, we recommend an 80 Plus Gold certified power supply of at least ${res1080.psu.recommendedWatts}W. Running this PC for 6 hours daily at standard utility rates ($0.15/kWh) amounts to an estimated $${res1080.psu.monthlyCostUsd.toFixed(2)} monthly electricity cost.`,
  };

  // FAQ
  const faq: FaqItem[] = [
    {
      question: `Does the ${cpu.name} bottleneck the ${gpu.name} in modern gaming?`,
      answer: `At 1080p, the ${cpu.name} and ${gpu.name} configuration exhibits a ${res1080.bottleneckPercent.toFixed(1)}% ${res1080.bottleneckType}. ${
        res1080.bottleneckType === "GPU Bottleneck"
          ? "This GPU-limited scenario is the standard, ideal behavior for PC gaming rigs, allowing your graphics card to be fully utilized."
          : res1080.bottleneckSeverity === "optimal"
          ? "This represents an exceptionally balanced pairing where neither component significantly limits the other."
          : "The CPU is the limiting component in fast-paced competitive games, though higher resolutions will shift load naturally to the GPU."
      } At 1440p, the dynamic shifts to a ${res1440.bottleneckPercent.toFixed(1)}% ${res1440.bottleneckType}.`,
    },
    {
      question: `What is the optimal display resolution for the ${cpu.name} and ${gpu.name}?`,
      answer: `The recommended resolution for this hardware pairing is ${
        isGpuHigh && isCpuHigh ? "1440p Quad HD or 4K Ultra HD" : isGpuBudget || isCpuBudget ? "1080p Full HD" : "1080p High or 1440p Balanced"
      }. At this target resolution, both components operate harmoniously without leaving performance untapped or overloading the rendering pipeline.`,
    },
    {
      question: `What estimated FPS will the ${cpu.name} and ${gpu.name} produce in Cyberpunk 2077 and CS2?`,
      answer: `At 1080p medium settings, our model estimates approximately ${cp1080} FPS in Cyberpunk 2077 and ${cs1080} FPS in CS2. At 1440p, expectations adjust to approximately ${cp1440} FPS in Cyberpunk 2077 and ${cs1440} FPS in CS2. Performance estimates are derived from relative hardware performance indices under standard thermal conditions.`,
    },
    {
      question: `What size power supply (PSU) is needed for the ${cpu.name} and ${gpu.name}?`,
      answer: `We recommend a quality 80 Plus Gold certified power supply of at least ${res1080.psu.recommendedWatts}W for this combination. The total system peak draw measures approximately ${res1080.psu.peakDrawWatts}W under simultaneous CPU and GPU stress, including peripheral and motherboard overhead.`,
    },
    {
      question: `Can the ${gpu.name} use Frame Generation technologies?`,
      answer: `Yes, this graphics card utilizes ${fgTech}. ${fgDesc}${fgWarning ? ` Note: ${fgWarning}` : ""}`,
    },
  ];

  // Similar combos from lib/combos.ts
  const allPlausible = getAllPlausibleCombos();
  const sameCpu = allPlausible
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

  const sameGpu = allPlausible
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

  // Deep dive sections to ensure rich, comprehensive, authoritative hardware analysis
  const architecturalDeepDive = `
### Architecture & Hardware Specifications

Understanding the low-level architecture of both the **${cpu.name}** and the **${gpu.name}** clarifies how bottlenecks manifest in real gaming engines:

- **CPU Compute Profile (${cpu.name}):** Manufactured by ${cpu.brand}, this processor features **${cpu.cores} physical cores** designed for desktop computing on the ${cpu.socket ? cpu.socket : "mobile"} socket. With a rated thermal design power of **${cpu.tdpWatts}W TDP**, it delivers robust single-threaded instructions per clock (IPC) vital for managing physics threads, NPC logic, and drawing command queues. In titles with complex simulation layers—such as Unreal Engine 5 nanite mesh passes or massive multiplayer tick rates—the CPU core scheduler plays a decisive role in preventing frametime micro-stutters.
- **GPU Rendering Architecture (${gpu.name}):** Built by ${gpu.brand}, the graphics card carries **${gpu.vramGb} GB of high-speed video memory (VRAM)** with a board power budget of **${gpu.tdpWatts}W TDP**. The rasterization pipelines and shader compute units handle geometry transformation, high-resolution texture streaming, post-processing shaders, and modern lighting passes. Because it supports **${fgTech}**, the GPU can offload repetitive frame rendering onto dedicated silicon, providing high frame fluidity even when scene complexity peaks.
- **Memory & Bandwidth Synergy:** Balanced pairing between CPU instruction dispatch and GPU frame buffer ingestion requires adequate system memory speed. When running the ${cpu.name} with modern multi-channel RAM, system bus latency remains low, allowing high-speed streaming of assets directly across the PCIe bus into the ${gpu.vramGb} GB VRAM buffer of the ${gpu.name}.
  `.trim();

  const gamePerformanceDeepDive = `
### Game-by-Game Estimated Performance Breakdown

To help you anticipate real-world playability, our calculation engine evaluates estimated framerates across 5 distinct game genres representing diverse rendering workloads:

1. **Cyberpunk 2077 (CD Projekt RED — Demanding AAA Open World):**
   - **1080p Medium:** ~**${cp1080} FPS** (High visual clarity, fluid combat responsiveness)
   - **1440p Medium:** ~**${cp1440} FPS** (Crisp image quality with balanced texture fidelity)
   - **4K Medium:** ~**${cp4k} FPS** (Extreme pixel density; upscaling or frame-gen recommended)
2. **Counter-Strike 2 / Rainbow Six Siege (Valve / Ubisoft — Esports Competitive):**
   - **1080p Medium:** ~**${cs1080} FPS** (Ultra-low latency, tailored for 144Hz–240Hz competitive displays)
   - **1440p Medium:** ~**${cs1440} FPS** (Competitive edge with enhanced spatial target identification)
   - **4K Medium:** ~**${cs4k} FPS** (High fidelity competitive play with ample refresh headroom)
3. **Forza Horizon 5 (Playground Games — Fast-Paced Racing & Streaming):**
   - **1080p Medium:** ~**${fz1080} FPS** | **1440p Medium:** ~**${fz1440} FPS** | **4K Medium:** ~**${fz4k} FPS**
   - Fast streaming of open-world terrain tests both GPU texture fillrate and CPU world generation.
4. **GTA V / Call of Duty: Warzone (Rockstar / Activision — Large Scale Multiplayer):**
   - **1080p Medium:** ~**${wz1080} FPS** | **1440p Medium:** ~**${wz1440} FPS** | **4K Medium:** ~**${wz4k} FPS**
   - Tests CPU draw call submission during crowded 100+ player lobbies and long draw distances.
5. **Elden Ring / Modern Action RPGs (FromSoftware — Dark Fantasy Open World):**
   - **1080p Medium:** ~**${er1080} FPS** | **1440p Medium:** ~**${er1440} FPS** | **4K Medium:** ~**${er4k} FPS**
   - Smooth frame pacing ensures responsive dodging, parrying, and visual immersion.
  `.trim();

  const hardwareThermalGuide = `
### Thermal Management, Cooling & Acoustic Headroom

Maximizing frametime consistency with the **${cpu.name}** and **${gpu.name}** depends heavily on sustained thermal stability. Under sustained dual-load gaming scenarios, both components produce heat that must be expelled efficiently to prevent thermal down-clocking:

- **CPU Thermal Dynamics (${cpu.tdpWatts}W):** Modern processors aggressively boost clock frequencies until encountering thermal limits (typically 85°C–95°C). For the ${cpu.name}, a quality dual-heatpipe tower air cooler or a 240mm liquid AIO cooler ensures frequencies remain locked at their maximum boost states without thermal throttling. Applying high-performance non-conductive thermal paste (such as Arctic MX-6) maintains optimal contact with the heatspreader.
- **GPU Airflow & Case Pressure (${gpu.tdpWatts}W):** The ${gpu.name} expels heated air directly into the chassis. To avoid heat pooling around the graphics card, we recommend a positive-pressure case airflow setup with at least two high-static-pressure front intake fans and one rear exhaust fan. Maintaining GPU junction temperatures below 75°C preserves maximum boost bin stability and silent acoustic operation.
- **Power Delivery & Transient Spikes:** Modern graphics cards generate microsecond power spikes (transients) that can exceed nominal TDP by 20% to 50%. Our recommended **${res1080.psu.recommendedWatts}W 80+ Gold power supply** provides the dynamic capacitor reserve needed to absorb transient current draws cleanly, preventing sudden system shutdowns during intense gaming moments.
  `.trim();

  const bottleneckPhysicsAnalysis = `
### Engineering Analysis: How the ${cpu.name} & ${gpu.name} Interact Under Load

A computer gaming workload is a synchronized pipeline between the host CPU and the client GPU. Understanding how bottlenecks dynamically evolve across game engines helps explain the estimated framerates observed on this rig:

- **Draw Call Generation & Dispatch (The CPU Stage):** Before the graphics card can shade a single pixel, the ${cpu.name} must compute simulation states (character animations, player inputs, game physics, AI pathfinding) and package them into DirectX 12 or Vulkan draw calls. The time required by the CPU to assemble these calls is largely independent of screen resolution. Whether rendering at 720p or 4K, an engine rendering 120 frames per second requires the processor to submit draw calls at strict 8.33 millisecond intervals. If the processor takes 12 milliseconds to process a crowded scene, the maximum attainable framerate is capped at ~83 FPS regardless of graphics power.
- **Pixel Shading & Rasterization (The GPU Stage):** Conversely, the workload placed on the ${gpu.name} scales geometrically with pixel count. At 1080p, the GPU renders approximately 2.07 million pixels per frame; at 1440p, that figure climbs to 3.69 million (+78%), and at 4K it surges to 8.29 million pixels (+300%). Because pixel fillrate and ray tracing BVH traversal heavily stress the GPU compute units and ${gpu.vramGb} GB VRAM bus, higher resolutions naturally push the graphics card to 99%–100% load.
- **The Smooth Transition to GPU-Boundedness:** This mathematical reality explains why systems with a noticeable CPU bottleneck at 1080p (${res1080.bottleneckPercent.toFixed(1)}%) transition smoothly into balanced or GPU-limited profiles at 1440p (${res1440.bottleneckPercent.toFixed(1)}%) and 4K (${res4k.bottleneckPercent.toFixed(1)}%). Our deterministic engine uses smooth minimum scaling (\`softMin\`, k=6) rather than arbitrary hard limits, accurately mirroring the gradual frame-pacing behavior observed on real gaming PCs.
  `.trim();

  return {
    cpu,
    gpu,
    res1080,
    res1440,
    res4k,
    summaryVerdict,
    resolutionAnalysis,
    platformAnalysis,
    multiResTable,
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
    architecturalDeepDive,
    gamePerformanceDeepDive,
    hardwareThermalGuide,
    bottleneckPhysicsAnalysis,
  };
}
