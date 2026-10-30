import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "RigPulse — PC Bottleneck, PSU & Frame-Gen Calculator";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
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
          backgroundImage: "radial-gradient(circle at 50% 30%, #064e3b 0%, #020617 70%)",
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
            marginBottom: "24px",
            padding: "8px 24px",
            borderRadius: "9999px",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            border: "1.5px solid rgba(16, 185, 129, 0.3)",
            color: "#34d399",
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          RIGPULSE HARDWARE INTELLIGENCE
        </div>

        <div
          style={{
            fontSize: "64px",
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: "20px",
            letterSpacing: "-2px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span>PC Bottleneck, PSU &amp;</span>
          <span style={{ color: "#10b981" }}>Frame-Gen Calculator</span>
        </div>

        <div
          style={{
            fontSize: "26px",
            color: "#94a3b8",
            maxWidth: "850px",
            lineHeight: 1.4,
            marginBottom: "40px",
          }}
        >
          Deterministic bottleneck analysis, estimated gaming FPS, and power recommendations.
        </div>

        <div
          style={{
            display: "flex",
            gap: "24px",
          }}
        >
          <div
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              backgroundColor: "rgba(30, 41, 59, 0.8)",
              border: "1px solid rgba(51, 65, 85, 0.8)",
              color: "#cbd5e1",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            Accurate Bottleneck %
          </div>
          <div
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              backgroundColor: "rgba(30, 41, 59, 0.8)",
              border: "1px solid rgba(51, 65, 85, 0.8)",
              color: "#cbd5e1",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            DLSS / FSR 3 Frame-Gen
          </div>
          <div
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              backgroundColor: "rgba(30, 41, 59, 0.8)",
              border: "1px solid rgba(51, 65, 85, 0.8)",
              color: "#cbd5e1",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            PSU Sizing &amp; Upgrades
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
