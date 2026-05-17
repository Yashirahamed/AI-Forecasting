// ─────────────────────────────────────────────────────────────
// Cloudinary Upload Helper
//
// CLOUDINARY CONSOLE SETUP (cloudinary.com):
//   1. Create free account
//   2. Settings → Upload Presets → Add unsigned preset
//      → name it: "weathercast_uploads"
//   3. Create folders: avatars/, itineraries/, community/, badges/
//   4. Dashboard → Cloud Name, API Key, API Secret → add to .env
// ─────────────────────────────────────────────────────────────

export interface UploadResult {
  secure_url: string
  public_id: string
  width?: number
  height?: number
  format?: string
  bytes?: number
}

export interface UploadOptions {
  folder?: string
  onProgress?: (percent: number) => void
}

/**
 * Upload a file to Cloudinary using unsigned upload preset.
 * Returns the secure Cloudinary URL.
 */
export const uploadToCloudinary = async (
  file: File,
  options: UploadOptions = {},
): Promise<UploadResult> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string

  if (!cloudName || !uploadPreset) {
    throw new Error('Missing Cloudinary environment variables.')
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  if (options.folder) {
    formData.append('folder', options.folder)
  }

  return new Promise<UploadResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && options.onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100)
        options.onProgress(percent)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText) as UploadResult
        resolve(data)
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    })

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'))
    })

    xhr.open('POST', url)
    xhr.send(formData)
  })
}

/**
 * Upload an avatar image to the avatars/ folder
 */
export const uploadAvatar = (
  file: File,
  onProgress?: (percent: number) => void,
): Promise<UploadResult> =>
  uploadToCloudinary(file, { folder: 'avatars', onProgress })

/**
 * Upload a community report photo
 */
export const uploadReportPhoto = (
  file: File,
  onProgress?: (percent: number) => void,
): Promise<UploadResult> =>
  uploadToCloudinary(file, { folder: 'community', onProgress })
