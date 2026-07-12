import { useCallback, useState } from "react";
import { useCartContext } from "../contexts/cartContext";
import { requestJson } from "../utils/api";

export default function useOrderServices() {
  const [orderLoading, setOrderLoading] = useState(false);
  const [refetchOrders, setRefetchOrders] = useState(true);
  const [ordersList, setOrdersList] = useState([]);
  const { clearCart } = useCartContext();

  const getUserOrders = useCallback((userId) => {
    setOrderLoading(true);

    requestJson(`/orders/userorders/${userId}`, {
      method: "GET",
    })
      .then((result) => {
        if (result.success) {
          setOrdersList(result.body);
        } else {
          console.log("Failed to fetch orders:", result);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setOrderLoading(false);
        setRefetchOrders(false);
      });
  }, []);

  const sendOrder = useCallback(
    (orderData) => {
      setOrderLoading(true);

      requestJson("/orders", {
        method: "POST",
        body: orderData,
      })
        .then((result) => {
          console.log(result);
          clearCart();
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setOrderLoading(false);
        });
    },
    [clearCart]
  );

  return {
    getUserOrders,
    orderLoading,
    refetchOrders,
    ordersList,
    sendOrder,
  };
}