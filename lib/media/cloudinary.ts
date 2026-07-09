import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function cldUrl(publicId: string, transforms = "f_auto,q_auto") {
  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}

export const cldAuto = (id: string) => cldUrl(id);
export const cldResponsive = (id: string, w: number) => cldUrl(id, `f_auto,q_auto,w_${w},c_fill`);

export async function generateSignature(params: {
  folder?: string;
  publicId?: string;
  source?: string;
  timestamp: number;
}) {
  const signParams: Record<string, string | number> = {
    timestamp: params.timestamp,
    folder: params.folder ?? "portfolio",
    source: params.source ?? "uw",
  };
  if (params.publicId) signParams.public_id = params.publicId;

  const signature = cloudinary.utils.api_sign_request(
    signParams,
    process.env.CLOUDINARY_API_SECRET!
  );
  return signature;
}

export { cloudinary };
