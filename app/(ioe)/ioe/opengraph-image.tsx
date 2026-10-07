import { ImageResponse } from "next/og";

export const alt = "IOE Papers — Past Questions & Syllabus Archive";
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
          background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
          padding: "80px",
          color: "#0f172a",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#2563eb",
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          Free · Tribhuvan University
        </div>
        <div style={{ display: "flex", fontSize: 92, fontWeight: 700, lineHeight: 1.05 }}>
          IOE Papers
        </div>
        <div style={{ display: "flex", fontSize: 38, color: "#334155", marginTop: 24 }}>
          Past questions, syllabus &amp; exam prep for engineering students
        </div>
        <div style={{ display: "flex", marginTop: 48, fontSize: 26, color: "#2563eb" }}>
          subeshyadav.com.np/ioe
        </div>
      </div>
    ),
    { ...size }
  );
}
