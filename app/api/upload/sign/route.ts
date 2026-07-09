import { NextRequest } from "next/server";
import { generateSignature } from "@/lib/media/cloudinary";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const timestamp = Math.round(Date.now() / 1000);
  const folder = "portfolio";
  const publicId = searchParams.get("publicId") || undefined;

  const signature = await generateSignature({
    timestamp,
    folder,
    source: "uw",
    ...(publicId ? { publicId } : {}),
  });

  return Response.json({
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder,
    ...(publicId ? { publicId } : {}),
  });
}
