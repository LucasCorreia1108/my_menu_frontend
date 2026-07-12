import { useState } from "react";
import { useSnackbar } from "../contexts/useSnackbarContext";

export default function platesServices() {
    const [plateLoading, setPlateLoading] = useState(false)
    const [refetchPlates, setRefetchPlates] = useState(true)
    const [platesList, setPlatesList] = useState([])
    const { showError } = useSnackbar();

    const url = `${import.meta.env.VITE_API_URL}/plates`

    const getPlates = () => {
        setPlateLoading(true)

        fetch(`${url}/available`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        })
        .then((response) => response.json())
        .then((result) => {
            if(result.success) {
                setPlatesList(result.body)
            } else {
                console.log("Failed to fetch plates:", result);
                showError(result.message || "Não foi possível carregar os pratos.");
            }
        })
        .catch((error) => {
            console.log(error)
            showError("Erro ao carregar os pratos.");
        })
        .finally(() => {
            setPlateLoading(false)
            setRefetchPlates(false)
        })
    }


    return {
       getPlates,
       plateLoading,
       refetchPlates,
       platesList
    }
}