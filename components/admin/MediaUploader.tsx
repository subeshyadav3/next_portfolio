"use client";

import { useState, useCallback } from "react";
import { CloudinaryUploadWidget } from "@/components/admin/CloudinaryUploadWidget";
import { saveMediaAction } from "@/actions/media";

interface MediaUploaderProps {
  onUploadComplete?: (media: { publicId: string; secureUrl: string }) => void;
}

export function MediaUploader({ onUploadComplete }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleUploadComplete = useCallback(
    async (result: { publicId: string; secureUrl: string }) => {
      setPreview(result.secureUrl);
      setUploading(false);
      await saveMediaAction(result);
      onUploadComplete?.(result);
    },
    [onUploadComplete]
  );

  return (
    <div className="space-y-4">
      <CloudinaryUploadWidget
        onUploadComplete={handleUploadComplete}
        onUploadStart={() => setUploading(true)}
        onUploadError={() => setUploading(false)}
      />

      {uploading && (
        <p className="text-sm text-gray-500 dark:text-gray-400">Uploading...</p>
      )}

      {preview && (
        <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
          <img
            src={preview}
            alt="Uploaded preview"
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
