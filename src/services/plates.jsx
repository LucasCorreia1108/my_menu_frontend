import { useState } from "react";

export default function platesServices() {
    const [plateLoading, setPlateLoading] = useState(false)
    const [refetchPlates, setRefetchPlates] = useState(true)
    const [platesList, setPlatesList] = useState([])
    const [plateError, setPlateError] = useState(null)

    const url = `${import.meta.env.VITE_API_URL}/plates`

    const getPlates = async () => {
        setPlateLoading(true)
        setPlateError(null)

        try {
            const response = await fetch(`${url}/available`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
            })

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`)
            }

            const result = await response.json()

            if (result.success) {
                setPlatesList(result.body)
            } else {
                throw new Error(result.message || "Failed to fetch plates.")
            }
        } catch (error) {
            console.error("Failed to fetch plates:", error)
            setPlateError(error.message || "Failed to fetch plates.")
        } finally {
            setPlateLoading(false)
            setRefetchPlates(false)
        }
    }


    return {
       getPlates,
       plateLoading,
       refetchPlates,
       platesList,
       plateError
    }
}
