import { useState } from "react";
import { useCartContext } from "../contexts/useCartContext";

export default function orderServices() {
    const [orderLoading, setOrderLoading] = useState(false)
    const [refetchOrders, setRefetchOrders] = useState(true)
    const [ordersList, setOrdersList] = useState([])
    const [orderError, setOrderError] = useState(null)
    const { clearCart } = useCartContext();
   

    const url = `${import.meta.env.VITE_API_URL}/orders`;

    const getUserOrders = async (userId) => {
        setOrderLoading(true)
        setOrderError(null)

        try {
            const response = await fetch(`${url}/userorders/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
            })

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`)
            }

            const result = await response.json()

            if (result.success) {
                setOrdersList(result.body)
            } else {
                throw new Error(result.message || "Failed to fetch orders.")
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error)
            setOrderError(error.message || "Failed to fetch orders.")
        } finally {
            setOrderLoading(false)
            setRefetchOrders(false)
        }
    }
   
    const sendOrder = async (orderData) => {
        setOrderLoading(true)
        setOrderError(null)

        try {
            const response = await fetch(`${url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(orderData)
            })

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`)
            }

            const result = await response.json()

            if (!result.success) {
                throw new Error(result.message || "Failed to place order.")
            }

            clearCart()
            return result
        } catch (error) {
            console.error("Failed to place order:", error)
            setOrderError(error.message || "Failed to place order.")
            throw error
        } finally {
            setOrderLoading(false)
        }
    }


    return {
       getUserOrders,
       orderLoading,
       refetchOrders,
       ordersList,
       sendOrder,
       orderError
    }
}
