import { CircularProgress } from "@mui/material"
import styles from "./loading.module.css";

export default function Loading() {

  return (
    <>
      <div className={styles.loadingContainer}>
        <CircularProgress style={{color: '#FF8C42'}}/>
      </div>
    </>
  )
}