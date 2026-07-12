import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import orderServices from './order'
import { CartProvider, useCartContext } from '../contexts/useCartContext'

const API_URL = 'http://api.test'

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>

const resolvedFetch = (result) =>
  vi.fn().mockResolvedValue({ json: () => Promise.resolve(result) })

describe('orderServices', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_API_URL', API_URL)
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('starts with sensible defaults', () => {
    const { result } = renderHook(() => orderServices(), { wrapper })
    expect(result.current.orderLoading).toBe(false)
    expect(result.current.refetchOrders).toBe(true)
    expect(result.current.ordersList).toEqual([])
    expect(typeof result.current.getUserOrders).toBe('function')
    expect(typeof result.current.sendOrder).toBe('function')
  })

  describe('getUserOrders', () => {
    it('requests the orders for a given user id', async () => {
      vi.stubGlobal('fetch', resolvedFetch({ success: true, body: [] }))
      const { result } = renderHook(() => orderServices(), { wrapper })

      await act(async () => {
        result.current.getUserOrders('user-42')
      })

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/orders/userorders/user-42`,
        expect.objectContaining({ method: 'GET' })
      )
    })

    it('stores the fetched orders on success', async () => {
      const orders = [{ _id: 'o1' }]
      vi.stubGlobal('fetch', resolvedFetch({ success: true, body: orders }))
      const { result } = renderHook(() => orderServices(), { wrapper })

      await act(async () => {
        result.current.getUserOrders('user-42')
      })

      await waitFor(() => expect(result.current.ordersList).toEqual(orders))
      expect(result.current.orderLoading).toBe(false)
      expect(result.current.refetchOrders).toBe(false)
    })

    it('does not store orders when unsuccessful', async () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      vi.stubGlobal('fetch', resolvedFetch({ success: false }))
      const { result } = renderHook(() => orderServices(), { wrapper })

      await act(async () => {
        result.current.getUserOrders('user-42')
      })

      await waitFor(() => expect(result.current.orderLoading).toBe(false))
      expect(result.current.ordersList).toEqual([])
      expect(logSpy).toHaveBeenCalled()
    })
  })

  describe('sendOrder', () => {
    it('posts the order and clears the cart', async () => {
      vi.stubGlobal('fetch', resolvedFetch({ success: true }))
      vi.spyOn(console, 'log').mockImplementation(() => {})

      const { result } = renderHook(
        () => ({ order: orderServices(), cart: useCartContext() }),
        { wrapper }
      )

      act(() => result.current.cart.addToCart({ _id: 'p1', name: 'Rice' }))
      expect(result.current.cart.cartItems).toHaveLength(1)

      const orderData = { userId: 'u1', items: [] }
      await act(async () => {
        result.current.order.sendOrder(orderData)
      })

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/orders`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(orderData),
        })
      )
      await waitFor(() => expect(result.current.cart.cartItems).toEqual([]))
      expect(result.current.order.orderLoading).toBe(false)
    })

    it('handles fetch rejection without throwing', async () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('down')))
      const { result } = renderHook(() => orderServices(), { wrapper })

      await act(async () => {
        result.current.sendOrder({ userId: 'u1' })
      })

      await waitFor(() => expect(result.current.orderLoading).toBe(false))
      expect(logSpy).toHaveBeenCalled()
    })
  })
})
