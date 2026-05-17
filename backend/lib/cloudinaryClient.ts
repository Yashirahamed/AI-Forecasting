// ─────────────────────────────────────────────────────────────
// Cloudinary Server Configuration
//
// SETUP:
//   1. cloudinary.com → Dashboard → API Keys
//   2. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY,
//      CLOUDINARY_API_SECRET to .env
// ─────────────────────────────────────────────────────────────

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

/**
 * Generate a signed upload signature for secure frontend uploads
 */
export const generateSignature = (
  folder: string,
): { signature: string; timestamp: number; apiKey: string; cloudName: string } => {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET ?? '',
  )
  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY ?? '',
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
  }
}

/**
 * Delete a file from Cloudinary by its public_id
 */
export const deleteFile = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId)
}

export { cloudinary }
