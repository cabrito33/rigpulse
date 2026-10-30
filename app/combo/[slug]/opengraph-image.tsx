import { ImageResponse } from "next/og";
import { getCpuById, getGpuById } from "@/lib/hardware";
import { parseComboSlug, calculate } from "@/lib/calculator";

export const runtime = "nodejs";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parseComboSlug(slug);
  const cpu = parsed ? getCpuById(parsed.cpuId) : null;
  const gpu = parsed ? getGpuById(parsed.gpuId) : null;
  const result = parsed ? calculate(parsed.cpuId, parsed.gpuId, "1080p") : null;

  const cpuName = cpu?.name ?? "Custom CPU";
  const gpuName = gpu?.name ?? "Custom GPU";
  const pct = result ? `${result.bottleneckPercent.toFixed(1)}%` : "";
  const severityText =
    result?.bottleneckSeverity === "gpu-limited"
      ? "GPU-Limited (Normal)"
      : result?.bottleneckSeverity === "optimal"
      ? "Balanced"
      : result?.bottleneckSeverity === "moderate"
      ? "Moderate CPU Bottleneck"
      : "Severe CPU Bottleneck";

  const badgeColor =
    result?.bottleneckSeverity === "gpu-limited" || result?.bottleneckSeverity === "optimal"
      ? "#10b981"
      : result?.bottleneckSeverity === "moderate"
      ? "#f59e0b"
      : "#f43f5e";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#020617",
          backgroundImage: "radial-gradient(circle at 50% 20%, #064e3b 0%, #020617 75%)",
          color: "#f8fafc",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              padding: "8px 20px",
              borderRadius: "9999px",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              border: "1.5px solid rgba(16, 185, 129, 0.4)",
              color: "#34d399",
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "0.5px",
            }}
          >
            ⚡ RigPulse Hardware Analysis
          </div>
          {pct && (
            <div
              style={{
                padding: "8px 20px",
                borderRadius: "9999px",
                backgroundColor: `${badgeColor}22`,
                border: `1.5px solid ${badgeColor}66`,
                color: badgeColor,
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              {severityText} · {pct}
            </div>
          )}
        </div>

        <div
          style={{
            fontSize: "56px",
            fontWeight: 900,
            lineHeight: 1.15,
            marginBottom: "16px",
            letterSpacing: "-1.5px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#818cf8" }}>{cpuName}</span>
          <span style={{ fontSize: "36px", color: "#64748b", margin: "4px 0" }}>+</span>
          <span style={{ color: "#34d399" }}>{gpuName}</span>
        </div>

        <div
          style={{
            fontSize: "24px",
            color: "#94a3b8",
            marginTop: "16px",
          }}
        >
          Bottleneck Analysis · Estimated Gaming FPS · Recommended PSU
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
