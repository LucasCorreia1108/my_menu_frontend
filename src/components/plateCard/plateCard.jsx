import styles from "./plateCard.module.css";
import { formatCurrency } from "../../utils/formatCurrency";

export default function PlateCard({ plateData }) {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.imageWrapper}>
        <img src={plateData.imgUrl} alt={plateData.name} />
      </div>
      <div className={styles.cardContent}>
        <h4>{plateData.name}</h4>
        <p>{plateData.description}</p>
        <div className={styles.cardFooter}>
          <span className={styles.price}>{formatCurrency(plateData.price)}</span>
        </div>
      </div>
    </div>
  );
}
