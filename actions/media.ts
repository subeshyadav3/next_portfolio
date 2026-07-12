"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { auth } from "@/lib/auth/config";
import { saveMedia, deleteMedia } from "@/services/media.service";

export async function saveMediaAction(data: {
  publicId: string;
  secureUrl: string;
}) {
  const session = await auth();
  const userId = session?.user?.id;

  const media = await saveMedia({
    publicId: data.publicId,
    secureUrl: data.secureUrl,
    type: "IMAGE",
    uploadedById: userId,
  });

  revalidatePath("/admin/media");
  revalidateTag("admin:media");
  return { id: media.id, publicId: media.publicId, secureUrl: media.secureUrl };
}

export async function deleteMediaAction(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  await deleteMedia(id);
  revalidatePath("/admin/media");
  revalidateTag("admin:media");
}
