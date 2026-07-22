"use client";

import { useCallback, useRef } from "react";

interface CloudinaryUploadWidgetProps {
  onUploadComplete: (result: { publicId: string; secureUrl: string }) => void;
  onUploadStart?: () => void;
  onUploadError?: () => void;
  publicId?: string;
  compress?: boolean;
}

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: Record<string, unknown>,
        callback: (error: unknown, result: { event: string; info: { public_id: string; secure_url: string } }) => void
      ) => { open: () => void };
    };
  }
}

function compressImage(file: File, maxW = 1920, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let w = img.width;
      let h = img.height;
      if (w > maxW) { h = (h / w) * maxW; w = maxW; }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Compression failed"));
      }, "image/jpeg", quality);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export function CloudinaryUploadWidget({
  onUploadComplete,
  onUploadStart,
  onUploadError,
  publicId,
  compress,
}: CloudinaryUploadWidgetProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleClick = useCallback(async () => {
    if (compress) {
      fileRef.current?.click();
      return;
    }

    // Load widget script on demand
    const script = document.createElement("script");
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    await new Promise((resolve) => { script.onload = resolve; document.body.appendChild(script); });

    const params = new URLSearchParams();
    if (publicId) params.set("publicId", publicId);
    const res = await fetch(`/api/upload/sign?${params}`);
    const { signature, timestamp, cloudName, apiKey, folder, publicId: signedPublicId } = await res.json();

    if (!window.cloudinary) { onUploadError?.(); return; }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        apiKey,
        uploadSignature: signature,
        uploadSignatureTimestamp: timestamp,
        folder,
        publicId: signedPublicId,
        sources: ["local", "url", "camera"],
        multiple: false,
        maxFileSize: 10 * 1024 * 1024,
      },
      (error, result) => {
        if (error) { onUploadError?.(); return; }
        if (result.event === "upload-added") onUploadStart?.();
        if (result.event === "success") {
          onUploadComplete({
            publicId: result.info.public_id,
            secureUrl: result.info.secure_url,
          });
        }
      }
    );
    widget.open();
  }, [onUploadComplete, onUploadStart, onUploadError, publicId, compress]);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onUploadStart?.();

    try {
      const compressed = await compressImage(file);

      const params = new URLSearchParams();
      if (publicId) params.set("publicId", publicId);
      const res = await fetch(`/api/upload/sign?${params}`);
      const { signature, timestamp, cloudName, apiKey, folder } = await res.json();

      const form = new FormData();
      form.append("file", compressed, file.name);
      form.append("timestamp", String(timestamp));
      form.append("folder", folder);
      form.append("signature", signature);
      form.append("api_key", apiKey);
      if (publicId) form.append("public_id", publicId);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: "POST",
        body: form,
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      const result = await uploadRes.json();
      onUploadComplete({ publicId: result.public_id, secureUrl: result.secure_url });
    } catch {
      onUploadError?.();
    }
  }, [onUploadComplete, onUploadStart, onUploadError, publicId]);

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      <button
        type="button"
        onClick={handleClick}
        className="rounded-lg border-2 border-dashed border-gray-300 px-6 py-4 text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-blue-400"
      >
        {compress ? "Choose Image (auto-compress)" : "Upload Media"}
      </button>
    </>
  );
}
