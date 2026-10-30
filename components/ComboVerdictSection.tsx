import Link from "next/link";
import { type VerdictData } from "@/lib/verdict";
import {
  AlertTriangle,
  Zap,
  Cpu,
  Layers,
  Thermometer,
  Shield,
  HelpCircle,
  ArrowRight,
  Activity,
  GitCompare,
  Sliders,
} from "lucide-react";

interface ComboVerdictSectionProps {
  verdict: VerdictData;
}

export default function ComboVerdictSection({ verdict }: ComboVerdictSectionProps) {
  const {
    cpu,
    gpu,
    introSentence,
    summaryVerdict,
    resolutionAnalysis,
    platformAnalysis,
    closingTakeaway,
    multiResTable,
    gamePresetsTable,
    hardwareSpecs,
    comparisons,
    frameGenAdvice,
    upgradeAdvice,
    psuAdvice,
    faq,
    similarCombos,
    deepDive,
  } = verdict;

  return (
    <article className="space-y-10 pt-8 border-t border-slate-800/80">
      {/* ─── 1. Executive Hardware Verdict ─────────────────────────────────── */}
      <section className="glass-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
          <Zap className="w-4 h-4" />
          <span>Executive Verdict &amp; Performance Profile</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
          How the {cpu.name} &amp; {gpu.name} Perform Together
        </h2>
        <div className="prose prose-invert prose-slate max-w-none text-slate-300 space-y-3 leading-relaxed text-sm sm:text-base">
          <p className="text-slate-200 font-medium">{introSentence}</p>
          <p>{summaryVerdict}</p>
          <p>{resolutionAnalysis}</p>
          <p>{platformAnalysis}</p>
          <p className="text-slate-400 text-xs sm:text-sm italic pt-1">{closingTakeaway}</p>
        </div>
      </section>

      {/* ─── 2. Hardware Specification & Balance Matrix ───────────────────── */}
      <section className="glass-card p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
          <Cpu className="w-4 h-4" />
          <span>Component Specification Matrix</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
          Architectural Baseline &amp; Compute Balance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CPU Card */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">Processor (CPU)</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {hardwareSpecs.cpu.segment}
              </span>
            </div>
            <p className="text-lg font-bold text-slate-100">{hardwareSpecs.cpu.name}</p>
            <ul className="text-xs sm:text-sm space-y-1.5 text-slate-300">
              <li className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Physical Cores</span>
                <span className="font-mono text-slate-200">{hardwareSpecs.cpu.cores} Cores</span>
              </li>
              <li className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Motherboard Socket</span>
                <span className="font-mono text-slate-200">{hardwareSpecs.cpu.socket}</span>
              </li>
              <li className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Thermal Design Power</span>
                <span className="font-mono text-slate-200">{hardwareSpecs.cpu.tdpWatts}W TDP</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-400">RigPulse Tier Score</span>
                <span className="font-mono text-indigo-400 font-semibold">{hardwareSpecs.cpu.tierScore} / 200</span>
              </li>
            </ul>
          </div>

          {/* GPU Card */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Graphics Card (GPU)</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                {hardwareSpecs.gpu.segment}
              </span>
            </div>
            <p className="text-lg font-bold text-slate-100">{hardwareSpecs.gpu.name}</p>
            <ul className="text-xs sm:text-sm space-y-1.5 text-slate-300">
              <li className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Video Memory</span>
                <span className="font-mono text-slate-200">{hardwareSpecs.gpu.vramGb} GB VRAM</span>
              </li>
              <li className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Board Power</span>
                <span className="font-mono text-slate-200">{hardwareSpecs.gpu.tdpWatts}W TDP</span>
              </li>
              <li className="flex justify-between border-b border-slate-800/60 pb-1">
                <span className="text-slate-400">Frame-Gen Feature</span>
                <span className="font-mono text-slate-200">{hardwareSpecs.gpu.dlssTech}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-400">RigPulse Tier Score</span>
                <span className="font-mono text-emerald-400 font-semibold">{hardwareSpecs.gpu.tierScore} / 200</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs sm:text-sm text-indigo-200 leading-relaxed">
          <span className="font-semibold text-indigo-300">Synergy Analysis: </span>
          {hardwareSpecs.synergyAnalysis}
        </div>
      </section>

      {/* ─── 3. Neighbouring Comparisons ("How this compares") ─────────────── */}
      {comparisons.length > 0 && (
        <section className="glass-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <GitCompare className="w-4 h-4" />
            <span>How This Rig Compares</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
            Performance Deltas vs. Neighbouring Hardware
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Real performance differences calculated against alternative CPU and GPU pairings
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {comparisons.map((comp) => (
              <div
                key={comp.title}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <span className="text-xs font-mono text-slate-400">
                    {comp.type === "faster-cpu"
                      ? "Faster CPU Option"
                      : comp.type === "slower-cpu"
                      ? "Budget CPU Option"
                      : "Higher-Tier GPU"}
                  </span>
                  <h3 className="font-bold text-slate-100 text-sm">{comp.componentName}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{comp.analysis}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400">CP:</span>
                    <span className={comp.cyberpunkFpsDelta >= 0 ? "text-emerald-400" : "text-rose-400"}>
                      {comp.cyberpunkFpsDelta >= 0 ? `+${comp.cyberpunkFpsDelta}` : comp.cyberpunkFpsDelta} fps
                    </span>
                    <span className="text-slate-400">CS2:</span>
                    <span className={comp.cs2FpsDelta >= 0 ? "text-emerald-400" : "text-rose-400"}>
                      {comp.cs2FpsDelta >= 0 ? `+${comp.cs2FpsDelta}` : comp.cs2FpsDelta} fps
                    </span>
                  </div>
                  <Link
                    href={`/combo/${comp.slug}`}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                  >
                    View <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── 4. Multi-Resolution Performance Table ─────────────────────────── */}
      <section className="glass-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Multi-Resolution Bottleneck &amp; Estimated FPS
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Deterministic estimates across 1080p, 1440p, and 4K under standard gaming loads
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
            Medium Settings · Native
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Resolution</th>
                <th className="py-3 px-4">Limiter Status</th>
                <th className="py-3 px-4 text-right">Cyberpunk 2077</th>
                <th className="py-3 px-4 text-right">CS2 / R6 Siege</th>
                <th className="py-3 px-4 text-right">Forza Horizon 5</th>
                <th className="py-3 px-4 text-right">Elden Ring</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs sm:text-sm">
              {multiResTable.map((row) => (
                <tr key={row.resolution} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-200">
                    {row.label}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-sans font-medium ${
                        row.bottleneckType === "GPU Bottleneck" || row.bottleneckSeverity === "optimal"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : row.bottleneckSeverity === "moderate"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {row.bottleneckType === "GPU Bottleneck"
                        ? `✓ GPU-Limited (${row.bottleneckPercent.toFixed(1)}%)`
                        : row.bottleneckSeverity === "optimal"
                        ? `✓ Balanced (${row.bottleneckPercent.toFixed(1)}%)`
                        : `⚠ CPU-Limited (${row.bottleneckPercent.toFixed(1)}%)`}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-200">{row.cyberpunkFps} fps</td>
                  <td className="py-3.5 px-4 text-right text-slate-200">{row.cs2Fps} fps</td>
                  <td className="py-3.5 px-4 text-right text-slate-200">{row.forzaFps} fps</td>
                  <td className="py-3.5 px-4 text-right text-slate-200">{row.eldenFps} fps</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── 5. Graphic Presets Table (Low / Medium / Ultra) ────────────────── */}
      <section className="glass-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              Estimated FPS Across Graphic Presets
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Estimated 1080p performance scaling across Low, Medium, and Ultra graphics settings
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
            1080p Scaled
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Game Title</th>
                <th className="py-3 px-4 text-right">Low Preset</th>
                <th className="py-3 px-4 text-right">Medium Preset</th>
                <th className="py-3 px-4 text-right">Ultra Preset</th>
                <th className="py-3 px-4 text-right">With Frame Generation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs sm:text-sm">
              {gamePresetsTable.map((g) => (
                <tr key={g.game} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-medium text-slate-200">
                    {g.game}
                  </td>
                  <td className="py-3.5 px-4 text-right text-emerald-400">{g.lowFps} fps</td>
                  <td className="py-3.5 px-4 text-right text-slate-200">{g.medFps} fps</td>
                  <td className="py-3.5 px-4 text-right text-indigo-300">{g.highFps} fps</td>
                  <td className="py-3.5 px-4 text-right text-amber-400 font-semibold">
                    {g.frameGenRange}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── 6. Frame Generation & Upscaling Intelligence ──────────────────── */}
      <section className="glass-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
          <Zap className="w-4 h-4" />
          <span>Frame Generation Intelligence</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
          {frameGenAdvice.technology} with the {gpu.name}
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          {frameGenAdvice.description}
        </p>
        {frameGenAdvice.warning && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Frame Generation Latency Warning</p>
              <p className="mt-0.5 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                {frameGenAdvice.warning}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ─── 7. Mathematical Modeling & Draw Call Architecture ─────────────── */}
      <section className="glass-card p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          Mathematical Bottleneck Modeling &amp; Resolution Scaling
        </h2>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs sm:text-sm font-mono text-slate-300">
          <p className="text-slate-400 font-sans">Formula verification for Cyberpunk 2077:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-indigo-400">CPU Cap: </span>
              {deepDive.formulaBreakdown.cpuCapCyberpunk} FPS (Resolution Independent)
            </div>
            <div>
              <span className="text-emerald-400">GPU Cap (1080p): </span>
              {deepDive.formulaBreakdown.gpuCapCyberpunk1080} FPS (1.00 Factor)
            </div>
            <div>
              <span className="text-emerald-400">GPU Cap (1440p): </span>
              {deepDive.formulaBreakdown.gpuCapCyberpunk1440} FPS (0.68 Factor)
            </div>
            <div>
              <span className="text-emerald-400">GPU Cap (4K): </span>
              {deepDive.formulaBreakdown.gpuCapCyberpunk4k} FPS (0.38 Factor)
            </div>
          </div>
          <p className="text-slate-400 font-sans pt-1">
            Blended Native Medium (1080p via softMin, k=6):{" "}
            <span className="text-slate-100 font-semibold">{deepDive.formulaBreakdown.blendedMed1080} FPS</span>
          </p>
        </div>

        <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
          {deepDive.drawCallPipelineNotes.map((note, index) => (
            <li key={index} className="leading-relaxed">
              {note}
            </li>
          ))}
        </ul>
      </section>

      {/* ─── 8. Thermal & Power Delivery Guide ─────────────────────────────── */}
      <section className="glass-card p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-amber-400" />
          Thermal Dissipation &amp; Power Requirements
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          {psuAdvice.description}
        </p>
        <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
          {deepDive.thermalPointers.map((pointer, index) => (
            <li key={index} className="leading-relaxed">
              {pointer}
            </li>
          ))}
        </ul>
      </section>

      {/* ─── 9. Upgrade Recommendations & Headroom ─────────────────────────── */}
      {(upgradeAdvice.cpuUpgradeText || upgradeAdvice.gpuUpgradeText) && (
        <section className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            Upgrade Pathways &amp; Hardware Compatibility
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-slate-300">
            {upgradeAdvice.cpuUpgradeText && (
              <div className="space-y-2">
                <p>{upgradeAdvice.cpuUpgradeText}</p>
                {upgradeAdvice.cpuUpgradeWarning && (
                  <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{upgradeAdvice.cpuUpgradeWarning}</span>
                  </div>
                )}
              </div>
            )}
            {upgradeAdvice.gpuUpgradeText && (
              <div className="space-y-2">
                <p>{upgradeAdvice.gpuUpgradeText}</p>
                {upgradeAdvice.gpuUpgradeWarning && (
                  <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-amber-300 flex items-center gap-2">
                    <Zap className="w-4 h-4 flex-shrink-0 text-amber-400" />
                    <span>{upgradeAdvice.gpuUpgradeWarning}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── 10. Frequently Asked Questions ────────────────────────────────── */}
      <section className="glass-card p-6 sm:p-8 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          Frequently Asked Questions
        </h2>
        <dl className="space-y-4">
          {faq.map((item, index) => (
            <div key={index} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <dt className="font-semibold text-slate-100 text-sm sm:text-base">
                {item.question}
              </dt>
              <dd className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ─── 11. Similar Plausible Combinations ────────────────────────────── */}
      {similarCombos.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100">
              Related Hardware Combinations
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Plausible builds
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {similarCombos.map((item) => (
              <Link
                key={item.slug}
                href={`/combo/${item.slug}`}
                className="group p-4 rounded-xl glass-card hover:border-slate-600 transition-all flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {item.relation === "same-cpu" ? "Alt GPU" : "Alt CPU"}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-indigo-300">{item.cpuName}</p>
                  <p className="text-xs font-semibold text-emerald-400">{item.gpuName}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── 12. Methodology Disclaimer Note ───────────────────────────────── */}
      <footer className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-center text-xs text-slate-500">
        <p>
          Estimates based on relative performance indices, not lab measurements. Read our{" "}
          <Link href="/methodology" className="text-emerald-400 hover:underline">
            calculation methodology
          </Link>
          .
        </p>
      </footer>
    </article>
  );
}
