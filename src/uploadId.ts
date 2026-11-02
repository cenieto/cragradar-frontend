/**
 * Get the image id at the end of an upload URL, such as `/api/uploads/<id>`.
 *
 * @param uploadUrl URL of the upload, given by the server when it was created.
 * @returns The image id, or an empty string without URL.
 */
export function readImageId(uploadUrl: string | null): string {
  return (uploadUrl ?? '').replace(/\/+$/, '').split('/').pop() ?? ''
}
