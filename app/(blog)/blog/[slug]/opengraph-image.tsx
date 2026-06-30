import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog/posts";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const title = post?.title || "Subesh Yadav Blog";
  const category = post?.category || "Article";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #fafaf9 0%, #e7e5e4 100%)",
          padding: "64px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#059669",
            }}
          />
          <span
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#1c1917",
            }}
          >
            Subesh.Blog
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <span
            style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#059669",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {category}
          </span>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 800,
              color: "#1c1917",
              lineHeight: 1.15,
              maxWidth: "1000px",
            }}
          >
            {title}
          </h1>
        </div>

        <div
          style={{
            fontSize: "24px",
            color: "#57534e",
          }}
        >
          subeshyadav.com.np/blog
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
