import usePlatesServices from "../../services/plates";
import { useEffect, useState } from "react";
import Loading from "../loading/loading";
import PlateCard from "../../components/plateCard/plateCard";
import styles from "./plates.module.css";
import PlatePopup from "../../components/platePopup/platePopup.jsx";
import { useCartContext } from "../../contexts/useCartContext";

export default function Plates() {
  const { getPlates, plateLoading, refetchPlates, platesList } =
    usePlatesServices();
  const [plateSelected, setPlateSelected] = useState(null);
  const { addToCart } = useCartContext();

  useEffect(() => {
    if (refetchPlates && !platesList.length) {
      getPlates();
    }
  }, [refetchPlates, platesList.length, getPlates]);

  if (plateLoading) {
    return <Loading />;
  }

  const handlePlateSected = (plate) => {
    setPlateSelected(plate);
  };
  const handleClosePopup = () => {
    setPlateSelected(null);
  };

  const handleAddToCart = (itemToAdd, quantity) => {
    addToCart(itemToAdd, quantity);
  }

  return (
    <>
      <div className={styles.cardsGrid}>
        {platesList?.map((plate) => (
          <div
            key={plate._id}
            className={styles.plateCardContainer}
            onClick={() => {handlePlateSected(plate)}}
          >
            <PlateCard plateData={plate} />
          </div>
        ))}

        {plateSelected && (
          <>
            <PlatePopup plateData={plateSelected} onAddToCart={handleAddToCart} onClose={handleClosePopup} />
          </>
        )}
      </div>
    </>
  );
}
