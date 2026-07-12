import { describe, it, expect } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { CartProvider, useCartContext } from './useCartContext'

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>

const renderCart = () => renderHook(() => useCartContext(), { wrapper })

const plateA = { _id: 'a', name: 'Rice', price: 10 }
const plateB = { _id: 'b', name: 'Beans', price: 8 }

describe('useCartContext', () => {
  it('throws when used outside of a CartProvider', () => {
    expect(() => renderHook(() => useCartContext())).toThrow(
      'useCartContext must be used within a CartProvider'
    )
  })

  it('starts with an empty cart', () => {
    const { result } = renderCart()
    expect(result.current.cartItems).toEqual([])
  })

  it('adds a new item with a default quantity of 1', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart(plateA))
    expect(result.current.cartItems).toEqual([{ ...plateA, quantity: 1 }])
  })

  it('adds a new item with the provided quantity', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart(plateA, 3))
    expect(result.current.cartItems).toEqual([{ ...plateA, quantity: 3 }])
  })

  it('increments quantity when adding an item already in the cart', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart(plateA, 2))
    act(() => result.current.addToCart(plateA, 3))
    expect(result.current.cartItems).toEqual([{ ...plateA, quantity: 5 }])
  })

  it('keeps distinct items separate', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart(plateA))
    act(() => result.current.addToCart(plateB, 2))
    expect(result.current.cartItems).toEqual([
      { ...plateA, quantity: 1 },
      { ...plateB, quantity: 2 },
    ])
  })

  it('removes an item by id', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart(plateA))
    act(() => result.current.addToCart(plateB))
    act(() => result.current.removeFromCart('a'))
    expect(result.current.cartItems).toEqual([{ ...plateB, quantity: 1 }])
  })

  it('leaves the cart unchanged when removing an unknown id', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart(plateA))
    act(() => result.current.removeFromCart('does-not-exist'))
    expect(result.current.cartItems).toEqual([{ ...plateA, quantity: 1 }])
  })

  it('replaces the cart contents with updateCartItems', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart(plateA))
    const newItems = [{ ...plateB, quantity: 4 }]
    act(() => result.current.updateCartItems(newItems))
    expect(result.current.cartItems).toEqual(newItems)
  })

  it('empties the cart with clearCart', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart(plateA))
    act(() => result.current.addToCart(plateB))
    act(() => result.current.clearCart())
    expect(result.current.cartItems).toEqual([])
  })
})
