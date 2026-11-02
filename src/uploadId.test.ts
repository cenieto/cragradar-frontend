import { describe, expect, it } from 'vitest'

import { readImageId } from './uploadId'

describe('readImageId', () => {
  it('reads the id of a relative upload URL', () => {
    expect(readImageId('/api/uploads/427a3d5b-b45c-4805-8411-6db9c8d6929a')).toBe(
      '427a3d5b-b45c-4805-8411-6db9c8d6929a',
    )
  })

  it('reads the id of an absolute upload URL with a trailing slash', () => {
    expect(readImageId('https://cragradar.example/api/uploads/abc/')).toBe('abc')
  })

  it('gives an empty id without URL', () => {
    expect(readImageId(null)).toBe('')
  })
})
