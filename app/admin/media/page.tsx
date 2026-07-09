import { getMedia } from "@/services/media.service";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { MediaCard } from "@/components/admin/MediaCard";
import { prisma } from "@/db/prisma";

export default async function AdminMediaPage() {
  const { media } = await getMedia({ limit: 50 });
  const mediaCount = await prisma.media.count();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Media</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {mediaCount} file{mediaCount !== 1 ? "s" : ""} uploaded
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-600">
          <MediaUploader />
        </div>
      </div>

      {media.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {media.map((item) => (
            <MediaCard
              key={item.id}
              id={item.id}
              publicId={item.publicId}
              secureUrl={item.secureUrl}
              width={item.width}
              height={item.height}
              bytes={item.bytes}
            />
          ))}
        </div>
      )}
    </div>
  );
}
