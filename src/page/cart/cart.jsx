import { useCartContext } from "../../contexts/cartContext";
import styles from "./cart.module.css";
import { CiCircleMinus } from "react-icons/ci";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmOrderPopup from "../../components/confirmOrderPopup/confirmOrderPopup";
import useOrderServices from "../../services/order";
import { adjustQuantity } from "../../utils/quantity";
import { formatCurrency } from "../../utils/formatCurrency";

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
    const updatedCartItems = cartItems.map((item) =>
      item._id === itemId
        ? { ...item, quantity: adjustQuantity(item.quantity, mode) }
        : item
    );
    updateCartItems(updatedCartItems);
  };

  const handleOpenPopup = () => {
    setConfirmPopupOpen(!confirmPopupOpen);
  };

  const handleConfirmOrder = (orderData) => {
   orderData.items = cartItems.map((item) => {
    return {
        plateId: item._id,
        quantity: item.quantity
    }
   });
   sendOrder(orderData);
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
                {console.log(item)}
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
            <strong>{formatCurrency(totalValue)}</strong>
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
