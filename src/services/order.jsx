import { useState } from "react";
import { useCartContext } from "../contexts/useCartContext";
import { useSnackbar } from "../contexts/useSnackbarContext";

export default function orderServices() {
    const [orderLoading, setOrderLoading] = useState(false)
    const [refetchOrders, setRefetchOrders] = useState(true)
    const [ordersList, setOrdersList] = useState([])
    const { clearCart } = useCartContext();
    const { showSuccess, showError } = useSnackbar();
   

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
                showError(result.message || "Não foi possível carregar seus pedidos.");
            }
        })
        .catch((error) => {
            console.log(error)
            showError("Erro ao carregar seus pedidos.");
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
           if(result.success) {
               clearCart()
               showSuccess("Pedido realizado com sucesso!");
           } else {
               showError(result.message || "Não foi possível concluir seu pedido.");
           }
        })
        .catch((error) => {
            console.log(error)
            showError("Erro ao enviar seu pedido. Tente novamente.");
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