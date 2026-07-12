import { useCartContext } from "../../contexts/useCartContext";
import styles from "./cart.module.css";
import { CiCircleMinus } from "react-icons/ci";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmOrderPopup from "../../components/confirmOrderPopup/confirmOrderPopup";
import useOrderServices from "../../services/order";

export default function Cart() {
  const { cartItems, updateCartItems, removeFromCart } = useCartContext();
  const [confirmPopupOpen, setConfirmPopupOpen] = useState(false);
  const { sendOrder } = useOrderServices();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <>
        <p>Your cart is empty.</p>
        <button onClick={() => navigate("/plates")}>See our specialities !</button>
      </>
    );
  }

  const handleChangeItemQty = (mode, itemId) => {
    const upadatedCartItems = cartItems.map((item) => {
      if (item._id === itemId) {
        if (mode === "less" && item.quantity > 1) {
          item.quantity -= 1;
        } else if (mode === "more") {
          item.quantity += 1;
        }
      }
      return item;
    });
    updateCartItems(upadatedCartItems);
  };

  const handleOpenPopup = () => {
    setConfirmPopupOpen(!confirmPopupOpen);
  };

  const handleConfirmOrder = (orderData) => {
   const sanitizedOrder = {
    ...orderData,
    items: cartItems.map((item) => ({
      plateId: item._id,
      quantity: Math.min(Math.max(Number(item.quantity) || 1, 1), 99),
    })),
   };
   sendOrder(sanitizedOrder);
   setConfirmPopupOpen(!confirmPopupOpen);
  };

  const totalValue = cartItems.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <>
      <div className={styles.pageContainer}>
        <h1>Your Items:</h1>
        <section>
          <div className={styles.itemListContainer}>
            {cartItems.map((item) => (
              <div className={styles.itemContainer} key={item._id}>
                <img src={item.imgUrl} />
                <div className={styles.itemContent}>
                  <h2>{item.name}</h2>
                  <p>[{String(item.ingredients)}]</p>
                  <p>{item.description}</p>
                  <div className={styles.portionsContainer}>
                    <p>portions:</p>
                    <p>{item?.quantity}</p>
                    <div className={styles.portionsButtons}>
                      <button
                        onClick={() => handleChangeItemQty("less", item._id)}
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleChangeItemQty("more", item._id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item._id)}>
                    <CiCircleMinus /> Remove item
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.cartSummary}>
          <div className={styles.cartTotal}>
            <span>Total</span>
            <strong>R$ {totalValue.toFixed(2)}</strong>
          </div>
          <button
            className={styles.confirmButton}
            onClick={() => handleOpenPopup()}
          >
            Confirm your order
          </button>
        </div>
      </div>
      {confirmPopupOpen && (
        <ConfirmOrderPopup
          open={confirmPopupOpen}
          onClose={() => setConfirmPopupOpen(false)}
          onConfirm={handleConfirmOrder}
        />
      )}
    </>
  );
}
