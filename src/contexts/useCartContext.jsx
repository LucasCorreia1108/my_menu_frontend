import { createContext, useContext, useState } from "react";
import { useSnackbar } from "./useSnackbarContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { showSuccess,  showError} = useSnackbar();

  const addToCart = (itemToAdd, quantity = 1) => {
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
    showSuccess(`${itemToAdd.name} adicionado ao carrinho!`);''
  };
  const removeFromCart = (itemId) => {
    const cartItemsSanitized = cartItems.filter((item) => item._id !== itemId);
    setCartItems(cartItemsSanitized);
    showError("Item removido do carrinho!");
  };

  const updateCartItems = (items) => {
    setCartItems(items);
  };

  const clearCart = () => {
    setCartItems([]);
  };
  return (
    <CartContext.Provider
      value={{ removeFromCart, addToCart, cartItems, updateCartItems, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}
