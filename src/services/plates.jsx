import { useCallback, useState } from "react";
import { requestJson } from "../utils/api";

export default function usePlatesServices() {
  const [plateLoading, setPlateLoading] = useState(false);
  const [refetchPlates, setRefetchPlates] = useState(true);
  const [platesList, setPlatesList] = useState([]);

  const getPlates = useCallback(() => {
    setPlateLoading(true);

    requestJson("/plates/available", {
      method: "GET",
    })
      .then((result) => {
        if (result.success) {
          setPlatesList(result.body);
        } else {
          console.log("Failed to fetch plates:", result);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setPlateLoading(false);
        setRefetchPlates(false);
      });
  }, []);

  return {
    getPlates,
    plateLoading,
    refetchPlates,
    platesList,
  };
}