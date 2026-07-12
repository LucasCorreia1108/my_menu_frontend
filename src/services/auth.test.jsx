import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import authServices from './auth'

const API_URL = 'http://api.test'

const resolvedFetch = (result) =>
  vi.fn().mockResolvedValue({ json: () => Promise.resolve(result) })

describe('authServices', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_API_URL', API_URL)
    localStorage.clear()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('exposes the expected api', () => {
    const { result } = renderHook(() => authServices())
    expect(result.current.authLoading).toBe(false)
    expect(typeof result.current.login).toBe('function')
    expect(typeof result.current.logout).toBe('function')
    expect(typeof result.current.signup).toBe('function')
  })

  describe('login', () => {
    it('posts credentials to the login endpoint', async () => {
      vi.stubGlobal('fetch', resolvedFetch({ success: true, body: { token: 't', user: { id: 1 } } }))
      const { result } = renderHook(() => authServices())

      await act(async () => {
        result.current.login({ email: 'a@b.com', password: 'pw' })
      })

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/auth/login`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'a@b.com', password: 'pw' }),
        })
      )
    })

    it('stores auth data and dispatches authChanged on success', async () => {
      vi.stubGlobal('fetch', resolvedFetch({ success: true, body: { token: 'tok', user: { id: 7 } } }))
      const dispatchSpy = vi.spyOn(window, 'dispatchEvent')
      const { result } = renderHook(() => authServices())

      await act(async () => {
        result.current.login({ email: 'a@b.com', password: 'pw' })
      })

      await waitFor(() => {
        expect(JSON.parse(localStorage.getItem('auth'))).toEqual({
          token: 'tok',
          user: { id: 7 },
        })
      })
      expect(dispatchSpy.mock.calls.some(([e]) => e.type === 'authChanged')).toBe(true)
    })

    it('does not store auth data when the response is unsuccessful', async () => {
      vi.stubGlobal('fetch', resolvedFetch({ success: false }))
      const { result } = renderHook(() => authServices())

      await act(async () => {
        result.current.login({ email: 'a@b.com', password: 'pw' })
      })

      await waitFor(() => expect(result.current.authLoading).toBe(false))
      expect(localStorage.getItem('auth')).toBeNull()
    })

    it('logs an error and resets loading when the request fails', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')))
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const { result } = renderHook(() => authServices())

      await act(async () => {
        result.current.login({ email: 'a@b.com', password: 'pw' })
      })

      await waitFor(() => expect(result.current.authLoading).toBe(false))
      expect(errorSpy).toHaveBeenCalled()
      expect(localStorage.getItem('auth')).toBeNull()
    })
  })

  describe('signup', () => {
    it('posts to the signup endpoint and stores auth data on success', async () => {
      vi.stubGlobal('fetch', resolvedFetch({ success: true, body: { token: 'st', user: { id: 9 } } }))
      const { result } = renderHook(() => authServices())

      await act(async () => {
        result.current.signup({ email: 'a@b.com', password: 'pw' })
      })

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/auth/signup`,
        expect.objectContaining({ method: 'POST' })
      )
      await waitFor(() => {
        expect(JSON.parse(localStorage.getItem('auth'))).toEqual({
          token: 'st',
          user: { id: 9 },
        })
      })
    })
  })

  describe('logout', () => {
    it('removes stored auth data and dispatches authChanged', async () => {
      localStorage.setItem('auth', JSON.stringify({ token: 'x' }))
      const dispatchSpy = vi.spyOn(window, 'dispatchEvent')
      const { result } = renderHook(() => authServices())

      await act(async () => {
        await result.current.logout()
      })

      expect(localStorage.getItem('auth')).toBeNull()
      expect(dispatchSpy.mock.calls.some(([e]) => e.type === 'authChanged')).toBe(true)
    })
  })
})
