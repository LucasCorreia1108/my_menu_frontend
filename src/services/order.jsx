import { useCallback, useState } from "react";
import { useCartContext } from "../contexts/useCartContext";
import { getApiUrl, getAuthenticatedHeaders } from "../utils/api";

export default function useOrderServices() {
    const [orderLoading, setOrderLoading] = useState(false)
    const [refetchOrders, setRefetchOrders] = useState(true)
    const [ordersList, setOrdersList] = useState([])
    const { clearCart } = useCartContext();
   

    const getUserOrders = useCallback((userId) => {
        setOrderLoading(true)
        
        fetch(getApiUrl(`/orders/userorders/${encodeURIComponent(userId)}`), {
            method: 'GET',
            headers: getAuthenticatedHeaders(),
        })
        .then((response) => response.json())
        .then((result) => {
            if(result.success) {
                setOrdersList(result.body)
            } else {
                setOrdersList([])
            }
        })
        .catch(() => {
            setOrdersList([])
        })
        .finally(() => {
            setOrderLoading(false)
            setRefetchOrders(false)
        })
    }, [])
   
    const sendOrder = useCallback((orderData) => {
        setOrderLoading(true)
        
        fetch(getApiUrl("/orders"), {
            method: 'POST',
            headers: getAuthenticatedHeaders(),
            body: JSON.stringify(orderData)
        })
        .then((response) => response.json())
        .then((result) => {
           if (result.success) {
               clearCart()
           }
        })
        .catch(() => {})
        .finally(() => {
            setOrderLoading(false)
        })
    }, [clearCart])


    return {
       getUserOrders,
       orderLoading,
       refetchOrders,
       ordersList,
       sendOrder
    }
}