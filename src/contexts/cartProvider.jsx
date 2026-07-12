import { useCallback, useMemo, useState } from "react";
import { CartContext } from "./cartContext";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = useCallback((itemToAdd, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cardItem) => cardItem._id === itemToAdd._id);

      if (!existingItem) {
        return [...prevItems, { ...itemToAdd, quantity }];
      }

      return prevItems.map((cardItem) =>
        cardItem._id === itemToAdd._id
          ? { ...cardItem, quantity: cardItem.quantity + quantity }
          : cardItem
      );
    });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCartItems((items) => items.filter((item) => item._id !== itemId));
  }, []);

  const updateCartItems = useCallback((items) => setCartItems(items), []);
  const clearCart = useCallback(() => setCartItems([]), []);
  const contextValue = useMemo(
    () => ({ removeFromCart, addToCart, cartItems, updateCartItems, clearCart }),
    [addToCart, cartItems, clearCart, removeFromCart, updateCartItems]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}
