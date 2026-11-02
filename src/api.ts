import { getAccessToken } from './auth'

export type ImageStatus = 'uploading' | 'uploaded' | 'processing' | 'ready' | 'failed'

/** An image as returned by `/api/images`. */
export interface ImageSummary {
  id: string
  file_name: string
  size_bytes: number
  status: ImageStatus
  width: number | null
  height: number | null
  version: number
  error: string | null
  dzi_url: string | null
  created_at: string
}

/** States in which an image still changes without user action. */
export const PENDING_IMAGE_STATUSES: readonly ImageStatus[] = ['uploading', 'uploaded', 'processing']

export class ApiError extends Error {
  constructor(readonly status: number) {
    super(`The server answered ${status}`)
  }
}

async function getJson<ResponseBody>(path: string): Promise<ResponseBody> {
  const response: Response = await fetch(path, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  })
  if (!response.ok) {
    throw new ApiError(response.status)
  }
  return (await response.json()) as ResponseBody
}

/** List every image, newest first. Content creators only. */
export function listImages(): Promise<ImageSummary[]> {
  return getJson<ImageSummary[]>('/api/images')
}
