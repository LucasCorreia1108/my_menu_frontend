import { Dialog } from "@mui/material"
import styles from './confirmOrderPopup.module.css'
import { useState } from "react"
import { TextField } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { getStoredAuth } from "../../utils/authStorage"

export default function ConfirmOrderPopup({ open, onClose, onConfirm }) {
    const [formData, setFormData] = useState({})
    const authData = getStoredAuth()
    const navigate = useNavigate()

    const handleConfirm = (e) => {
        e.preventDefault()

        if(!authData?.user?._id) {
            return navigate('/auth')
        } else {
            if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(formData?.pickupTime || "")) {
                return 
            } else {
                const orderData = {
                    userId: authData?.user?._id,
                    pickupTime: formData?.pickupTime
                }

                onConfirm(orderData)
            }
        }
    }

    const handleFormDataChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return(
        <Dialog open={open} onClose={onClose}>
            <div className={styles.popupContainer}>
                <h2>Já estamos quase lá...</h2>
                <p>Confirme seu pedido com a data atual: <strong>{(new Date()).toLocaleDateString()}</strong>. Que horas você vem buscar seu pedido?</p>
                <form className={styles.formContainer}>
                    <TextField
                    onChange={handleFormDataChange}
                    required
                    type="time"
                    name='pickupTime'
                    />
                    <div className={styles.confirmBtns}>
                        <button className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
                        <button onClick={handleConfirm}>Confirmar</button>
                    </div>
                </form>
            </div>
        </Dialog>
    )
}