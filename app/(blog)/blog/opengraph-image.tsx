import { ImageResponse } from "next/og";

export const alt = "Subesh Yadav Blog";
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
          background: "linear-gradient(135deg, #fafaf9 0%, #e7e5e4 100%)",
          padding: "64px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "#059669",
            }}
          />
          <span
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#1c1917",
            }}
          >
            Subesh.Blog
          </span>
        </div>
        <h1
          style={{
            fontSize: "64px",
            fontWeight: 800,
            color: "#1c1917",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          Essay, Poems & Notes
        </h1>
        <p
          style={{
            fontSize: "28px",
            color: "#57534e",
            marginTop: "24px",
            textAlign: "center",
          }}
        >
          Nepali educational content for students and readers
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
