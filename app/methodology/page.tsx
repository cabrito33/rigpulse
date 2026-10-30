import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Cpu, Zap, Calculator, ShieldAlert, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Calculation Methodology — RigPulse",
  description:
    "Detailed engineering documentation of the RigPulse bottleneck formula, softMin frame pacing model, resolution scaling factors, and PSU sizing mathematics.",
};

export default function MethodologyPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-300">
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-300">Methodology</span>
        </nav>

        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <Calculator className="w-3.5 h-3.5" />
            Mathematical Specification · Revision 2026-10-30
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
            RigPulse Calculation Methodology &amp; Engineering Model
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            RigPulse models gaming PC performance deterministically using component performance indices,
            smooth asymptotic minimum functions, and resolution-aware rendering physics.
          </p>
        </header>

        {/* Section 1 */}
        <section className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            1. Component Hardware Indices
          </h2>
          <p className="text-sm leading-relaxed text-slate-300">
            Every desktop processor and graphics card in the RigPulse hardware database is assigned a relative
            <strong> tierScore</strong> (indexed relative to baseline hardware, e.g., Core i5-8400 = 50, Ryzen 5 5600 = 80, RTX 3060 = 80).
            Scores are maintained in our vetted hardware repository (<code className="text-indigo-300 font-mono text-xs">data/hardware.json</code>)
            and updated across public architectural benchmarks and reputable hardware review syntheses.
          </p>
        </section>

        {/* Section 2 */}
        <section className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-400" />
            2. Resolution Factors &amp; Throughput Caps
          </h2>
          <p className="text-sm leading-relaxed text-slate-300">
            For any given game workload, CPU instruction dispatch and GPU rasterization have distinct scaling behaviors across display resolutions:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
            <li>
              <strong>CPU Throughput Cap:</strong> CPU instruction handling (AI, physics, draw call assembly) is predominantly resolution-independent.
              <pre className="mt-1 p-3 rounded-lg bg-slate-900 font-mono text-xs text-indigo-300 overflow-x-auto">
                cpuCapFps = CPU_BASE_FPS[game] * (cpu.tierScore / 100)
              </pre>
            </li>
            <li>
              <strong>GPU Throughput Cap:</strong> Pixel shader and rasterization workload scales directly with display resolution. We apply empirical resolution coefficients:
              <pre className="mt-1 p-3 rounded-lg bg-slate-900 font-mono text-xs text-emerald-300 overflow-x-auto">
                RES_FACTOR = &#123; &quot;1080p&quot;: 1.00, &quot;1440p&quot;: 0.68, &quot;4k&quot;: 0.38 &#125;
                gpuCapFps = GPU_BASE_FPS[game] * (gpu.tierScore / 100) * RES_FACTOR[res]
              </pre>
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-400" />
            3. Frame Pacing Simulation via softMin(k=6)
          </h2>
          <p className="text-sm leading-relaxed text-slate-300">
            In physical gaming computers, frame generation is not governed by a sudden, rigid cliff. Instead, driver scheduling, memory caching,
            and frame buffering cause a smooth transition when one component nears saturation. RigPulse computes native medium FPS using the
            generalized p-norm smooth minimum:
          </p>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs sm:text-sm text-slate-200">
            softMin(a, b, k=6) = (a<sup>-6</sup> + b<sup>-6</sup>)<sup>-1/6</sup>
          </div>
          <p className="text-sm leading-relaxed text-slate-300">
            Setting k=6 models physical hardware frame-time interaction accurately: when one component is significantly weaker, it dominates
            the framerate; when both components operate near parity, micro-stutters and overhead cause a minor, realistic 4–6% penalty.
          </p>
        </section>

        {/* Section 4 */}
        <section className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            4. Bottleneck Direction &amp; Severity Semantics
          </h2>
          <p className="text-sm leading-relaxed text-slate-300">
            Bottleneck percentage evaluates the ratio between effective GPU rendering capacity and CPU throughput at the target resolution:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
            <li>
              <strong>GPU Bottleneck (GPU-Limited):</strong> The graphics card is at 99–100% capacity. In PC gaming, this is the <em>ideal and normal</em> operating condition. We classify this as <strong>optimal / emerald</strong> and never as severe or in red.
            </li>
            <li>
              <strong>Balanced:</strong> CPU and GPU limits align within ±10%.
            </li>
            <li>
              <strong>CPU Bottleneck:</strong> The CPU limits framerate below the graphics card&apos;s rendering headroom. Severity is categorized strictly as:
              <span className="block pl-5 mt-1 font-mono text-xs">
                &lt; 10%: Balanced (optimal)<br />
                10% – 20%: Moderate CPU Bottleneck (amber)<br />
                &gt; 20%: Severe CPU Bottleneck (rose)
              </span>
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" />
            5. Power Supply (PSU) Sizing Formula
          </h2>
          <p className="text-sm leading-relaxed text-slate-300">
            Power supply requirements consider combined maximum processor and graphics thermal design power, motherboard/cooling overhead,
            and a 1.35× headroom buffer for transient current spikes, rounded up to the nearest standard 50W PSU increment:
          </p>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs sm:text-sm text-slate-200">
            peakWatts = cpu.tdpWatts + gpu.tdpWatts + 75<br />
            recommendedWatts = ceil((peakWatts * 1.35) / 50) * 50
          </div>
          <p className="text-sm leading-relaxed text-slate-300">
            Monthly electricity costs are calculated assuming a standard 60% average gaming load factor, 3 hours of gaming per day,
            and a default electricity tariff of 0.20 EUR/kWh.
          </p>
        </section>

        {/* Section 6 */}
        <section className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 text-xs sm:text-sm text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold">
            <ShieldAlert className="w-4 h-4" />
            <span>Important Modeling Notice</span>
          </div>
          <p>
            RigPulse estimates are produced by algorithmic simulation and mathematical modeling, not physical in-lab hardware bench testing.
            Real-world performance may deviate depending on background applications, RAM latency and channel configuration, operating system scheduling,
            thermal throttling, and individual title updates.
          </p>
        </section>
      </main>
    </>
  );
}
