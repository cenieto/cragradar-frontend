import { Upload } from 'tus-js-client'

import { getAccessToken } from './auth'
import { UPLOAD_CHUNK_SIZE_BYTES, UPLOAD_ENDPOINT } from './config'
import { readImageId } from './uploadId'

export interface UploadCallbacks {
  onProgress: (sentBytes: number, totalBytes: number) => void
  onSuccess: (imageId: string) => void
  onError: (message: string) => void
}

/**
 * Upload an image with the tus protocol, in chunks that are retried when the network fails.
 *
 * Each request carries the current access token, so a long upload survives token renewals.
 *
 * @param file Image chosen by the user.
 * @param callbacks Progress, completion and failure of the upload.
 * @returns The running upload, which can be aborted.
 */
export function startImageUpload(file: File, callbacks: UploadCallbacks): Upload {
  const upload: Upload = new Upload(file, {
    endpoint: UPLOAD_ENDPOINT,
    chunkSize: UPLOAD_CHUNK_SIZE_BYTES,
    retryDelays: [0, 1000, 3000, 10000],
    metadata: { filename: file.name, filetype: file.type },
    removeFingerprintOnSuccess: true,
    onBeforeRequest: (request) => {
      request.setHeader('Authorization', `Bearer ${getAccessToken()}`)
    },
    onProgress: callbacks.onProgress,
    onSuccess: () => callbacks.onSuccess(readImageId(upload.url)),
    onError: (error) => callbacks.onError(error.message),
  })
  upload.start()
  return upload
}
