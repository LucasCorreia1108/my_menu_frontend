import { useCallback, useState } from "react";
import { getApiUrl } from "../utils/api";

export default function usePlatesServices() {
    const [plateLoading, setPlateLoading] = useState(false)
    const [refetchPlates, setRefetchPlates] = useState(true)
    const [platesList, setPlatesList] = useState([])

    const getPlates = useCallback(() => {
        setPlateLoading(true)

        fetch(getApiUrl("/plates/available"), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => response.json())
        .then((result) => {
            if(result.success) {
                setPlatesList(result.body)
            } else {
                setPlatesList([])
            }
        })
        .catch(() => {
            setPlatesList([])
        })
        .finally(() => {
            setPlateLoading(false)
            setRefetchPlates(false)
        })
    }, [])


    return {
       getPlates,
       plateLoading,
       refetchPlates,
       platesList
    }
}