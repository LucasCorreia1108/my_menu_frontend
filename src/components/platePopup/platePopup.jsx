import { Dialog } from "@mui/material"
import { useState } from "react"
import styles from './platePopup.module.css'
import { adjustQuantity } from "../../utils/quantity"
import { formatCurrency } from "../../utils/formatCurrency"

export default function PlatePopup({ plateData, onClose, onAddToCart }) {
    const [quantity, setQuantity] = useState(1)
    const totalPrice = (Number(plateData.price) || 0) * quantity

    const handleQuantity = (mode) => {
        setQuantity((current) => adjustQuantity(current, mode))
    }

    const handleAdd = () => {
      onAddToCart(plateData, quantity)
      onClose()
    }

    return(
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm" scroll="body">
            <div className={styles.popupContainer}>
                <img src={plateData.imgUrl} alt="" />
                <div className={styles.popupContent}>
                    <h2>{plateData.name}</h2>
                    <p className={styles.ingredients}>[{String(plateData.ingredients)}]</p>
                    <p>{plateData.description}</p>
                    <div className={styles.priceRow}>
                      <span>Preço</span>
                      <strong>{formatCurrency(plateData.price)}</strong>
                    </div>
                    <div className={styles.quantityRow}>
                      <span>Quantidade</span>
                      <div className={styles.quantityControls}>
                        <button type="button" onClick={() => handleQuantity('less')}>-</button>
                        <span>{quantity}</span>
                        <button type="button" onClick={() => handleQuantity('more')}>+</button>
                      </div>
                    </div>
                    <div className={styles.totalRow}>
                      <span>Total</span>
                      <strong>{formatCurrency(totalPrice)}</strong>
                    </div>
                    <div className={styles.buttonRow}>
                      <button onClick={handleAdd}>Add to cart</button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}