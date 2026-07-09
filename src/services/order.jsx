import { useState } from "react";
import { useCartContext } from "../contexts/useCartContext";

export default function orderServices() {
    const [orderLoading, setOrderLoading] = useState(false)
    const [refetchOrders, setRefetchOrders] = useState(true)
    const [ordersList, setOrdersList] = useState([])
    const { clearCart } = useCartContext();
   

    const url = `${import.meta.env.VITE_API_URL}/orders`;

    const getUserOrders = (userId) => {
        setOrderLoading(true)
        
        fetch(`${url}/userorders/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        })
        .then((response) => response.json())
        .then((result) => {
            if(result.success) {
                setOrdersList(result.body)
            } else {
                console.log("Failed to fetch orders:", result);
            }
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            setOrderLoading(false)
            setRefetchOrders(false)
        })
    }
   
    const sendOrder = (orderData) => {
        setOrderLoading(true)
        
        fetch(`${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(orderData)
        })
        .then((response) => response.json())
        .then((result) => {
           console.log(result)
           clearCart()
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            setOrderLoading(false)
        })
    }


    return {
       getUserOrders,
       orderLoading,
       refetchOrders,
       ordersList,
       sendOrder
    }
}