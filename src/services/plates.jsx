import { useState } from "react";

export default function platesServices() {
    const [plateLoading, setPlateLoading] = useState(false)
    const [refetchPlates, setRefetchPlates] = useState(true)
    const [platesList, setPlatesList] = useState([])

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
            }
        })
        .catch((error) => {
            console.log(error)
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