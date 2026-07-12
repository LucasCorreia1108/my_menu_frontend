import { Dialog } from "@mui/material"
import { useState } from "react"
import styles from './platePopup.module.css'

export default function PlatePopup({ plateData, onClose, onAddToCart }) {
    const [quantity, setQuantity] = useState(1)
    const totalPrice = (Number(plateData.price) || 0) * quantity

    const handleQuantity = (mode) => {
        setQuantity((current) => {
            if (mode === 'less' && current > 1) return current - 1
            if (mode === 'more') return current + 1
            return current
        })
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
                      <strong>R$ {Number(plateData.price).toFixed(2)}</strong>
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
                      <strong>R$ {totalPrice.toFixed(2)}</strong>
                    </div>
                    <div className={styles.buttonRow}>
                      <button onClick={handleAdd}>Adicionar ao carrinho</button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}