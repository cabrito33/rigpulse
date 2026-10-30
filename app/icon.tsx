import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#020617",
          borderRadius: "8px",
          border: "1.5px solid #10b981",
        }}
      >
        <div
          style={{
            color: "#10b981",
            fontWeight: 900,
            fontSize: "18px",
            fontFamily: "system-ui, sans-serif",
            letterSpacing: "-1px",
          }}
        >
          RP
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
