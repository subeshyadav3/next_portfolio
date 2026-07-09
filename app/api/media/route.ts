import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/config";
import { saveMedia } from "@/services/media.service";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const media = await saveMedia({
    ...body,
    uploadedById: session.user.id,
  });

  return Response.json(media);
}
