import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import platesServices from './plates'

const API_URL = 'http://api.test'

const resolvedFetch = (result) =>
  vi.fn().mockResolvedValue({ json: () => Promise.resolve(result) })

describe('platesServices', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_API_URL', API_URL)
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('starts with sensible defaults', () => {
    const { result } = renderHook(() => platesServices())
    expect(result.current.plateLoading).toBe(false)
    expect(result.current.refetchPlates).toBe(true)
    expect(result.current.platesList).toEqual([])
    expect(typeof result.current.getPlates).toBe('function')
  })

  it('fetches available plates from the correct endpoint', async () => {
    vi.stubGlobal('fetch', resolvedFetch({ success: true, body: [] }))
    const { result } = renderHook(() => platesServices())

    await act(async () => {
      result.current.getPlates()
    })

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/plates/available`,
      expect.objectContaining({ method: 'GET' })
    )
  })

  it('populates platesList and clears loading flags on success', async () => {
    const plates = [{ _id: '1', name: 'Rice' }]
    vi.stubGlobal('fetch', resolvedFetch({ success: true, body: plates }))
    const { result } = renderHook(() => platesServices())

    await act(async () => {
      result.current.getPlates()
    })

    await waitFor(() => expect(result.current.platesList).toEqual(plates))
    expect(result.current.plateLoading).toBe(false)
    expect(result.current.refetchPlates).toBe(false)
  })

  it('leaves platesList empty and logs when response is unsuccessful', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.stubGlobal('fetch', resolvedFetch({ success: false }))
    const { result } = renderHook(() => platesServices())

    await act(async () => {
      result.current.getPlates()
    })

    await waitFor(() => expect(result.current.plateLoading).toBe(false))
    expect(result.current.platesList).toEqual([])
    expect(logSpy).toHaveBeenCalled()
  })

  it('handles fetch rejection without throwing', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('boom')))
    const { result } = renderHook(() => platesServices())

    await act(async () => {
      result.current.getPlates()
    })

    await waitFor(() => expect(result.current.plateLoading).toBe(false))
    expect(result.current.refetchPlates).toBe(false)
    expect(logSpy).toHaveBeenCalled()
  })
})
