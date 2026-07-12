import { describe, it, expect, beforeEach, vi } from 'vitest'
import { handleNavigate } from './handleNavigate'

describe('handleNavigate', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    window.scrollTo = vi.fn()
    window.history.pushState({}, '', '/')
  })

  it('scrolls to the top when navigating to the current path', () => {
    handleNavigate(window.location.pathname)
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })

  it('returns early (does not attempt navigation) for the current path', () => {
    // For the current path the function short-circuits before reaching the
    // (undefined) `navigate` reference, so it must not throw.
    expect(() => handleNavigate(window.location.pathname)).not.toThrow()
  })

  it('references an undefined `navigate` when the path differs from the current one', () => {
    // Documents current behaviour: `navigate` is not in scope in this module,
    // so navigating to a different path throws a ReferenceError.
    expect(() => handleNavigate('/some-other-path')).toThrow(ReferenceError)
  })
})
