import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site-config";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
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
          justifyContent: "center",
          background: "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
          padding: "80px",
          color: "#fafafa",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#34d399",
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          Portfolio
        </div>
        <div style={{ display: "flex", fontSize: 88, fontWeight: 700, lineHeight: 1.05 }}>
          {SITE_NAME}
        </div>
        <div style={{ display: "flex", fontSize: 38, color: "#a1a1aa", marginTop: 24 }}>
          {SITE_TAGLINE}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 26,
            color: "#34d399",
          }}
        >
          subeshyadav.com.np
        </div>
      </div>
    ),
    { ...size }
  );
}
