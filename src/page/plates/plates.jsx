import platesServices from "../../services/plates";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../loading/loading";
import PlateCard from "../../components/plateCard/plateCard";
import styles from "./plates.module.css";
import PlatePopup from "../../components/platePopup/platePopup.jsx";
import { useCartContext } from "../../contexts/useCartContext";

export default function Plates() {
  const { getPlates, plateLoading, refetchPlates, platesList, plateError } =
    platesServices();
  const [plateSelected, setPlateSelected] = useState(null);
  const { addToCart } = useCartContext();

  useEffect(() => {
    if (refetchPlates && !platesList.length) {
      getPlates();
    }
  }, [refetchPlates]);

  if (plateLoading) {
    return <Loading />;
  }

  if (plateError) {
    return (
      <div role="alert" className={styles.plateError}>
        <p>{plateError}</p>
        <button onClick={() => getPlates()}>Tentar novamente</button>
      </div>
    );
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
