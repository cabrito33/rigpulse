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
  TrendingUp,
} from "lucide-react";

interface ComboVerdictSectionProps {
  verdict: VerdictData;
}

export default function ComboVerdictSection({ verdict }: ComboVerdictSectionProps) {
  const {
    cpu,
    gpu,
    summaryVerdict,
    resolutionAnalysis,
    platformAnalysis,
    multiResTable,
    frameGenAdvice,
    upgradeAdvice,
    psuAdvice,
    faq,
    similarCombos,
    architecturalDeepDive,
    gamePerformanceDeepDive,
    hardwareThermalGuide,
    bottleneckPhysicsAnalysis,
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
          <p>{summaryVerdict}</p>
          <p>{resolutionAnalysis}</p>
          <p>{platformAnalysis}</p>
        </div>
      </section>

      {/* ─── 2. Multi-Resolution Performance Table ─────────────────────────── */}
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

      {/* ─── 3. Frame Generation & Upscaling Intelligence ──────────────────── */}
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

      {/* ─── 4. Architectural Deep Dive ────────────────────────────────────── */}
      <section className="glass-card p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-400" />
          Hardware Architecture &amp; System Synergy
        </h2>
        <div className="prose prose-invert prose-slate max-w-none text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
          {architecturalDeepDive}
        </div>
      </section>

      {/* ─── 5. Game-by-Game Breakdown ─────────────────────────────────────── */}
      <section className="glass-card p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          Game-by-Game Workload Analysis
        </h2>
        <div className="prose prose-invert prose-slate max-w-none text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
          {gamePerformanceDeepDive}
        </div>
      </section>

      {/* ─── 6. Bottleneck Physics Analysis ────────────────────────────────── */}
      <section className="glass-card p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          Mathematical Bottleneck Modeling &amp; Resolution Scaling
        </h2>
        <div className="prose prose-invert prose-slate max-w-none text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
          {bottleneckPhysicsAnalysis}
        </div>
      </section>

      {/* ─── 7. Thermal & Power Delivery Guide ─────────────────────────────── */}
      <section className="glass-card p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-amber-400" />
          Thermal Dissipation &amp; Power Requirements
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          {psuAdvice.description}
        </p>
        <div className="prose prose-invert prose-slate max-w-none text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
          {hardwareThermalGuide}
        </div>
      </section>

      {/* ─── 8. Upgrade Recommendations & Headroom ─────────────────────────── */}
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

      {/* ─── 9. Frequently Asked Questions ─────────────────────────────────── */}
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

      {/* ─── 10. Similar Plausible Combinations ────────────────────────────── */}
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

      {/* ─── 11. Methodology Disclaimer Note ───────────────────────────────── */}
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
