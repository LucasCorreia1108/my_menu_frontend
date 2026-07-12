import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthServices from "../../services/auth";
import useOrderServices from "../../services/order";
import styles from "./profile.module.css";
import { LuLogOut } from "react-icons/lu";
import Loading from "../loading/loading";
import { getStoredAuth } from "../../utils/authStorage";

export default function Profile() {
  const { logout } = useAuthServices();
  const { getUserOrders, orderLoading, refetchOrders } = useOrderServices();
  const navigate = useNavigate();
  const [authData, setAuthData] = useState(() => getStoredAuth());

  useEffect(() => {
    const updateAuthData = () => setAuthData(getStoredAuth());

    updateAuthData();
    window.addEventListener("authChanged", updateAuthData);

    return () => window.removeEventListener("authChanged", updateAuthData);
  }, []);

  useEffect(() => {
    if (!authData) {
      navigate("/auth");
      return;
    }

    if (refetchOrders && authData?.user?._id) {
      getUserOrders(authData?.user?._id);
    }
  }, [authData, refetchOrders, navigate, getUserOrders]);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  if (orderLoading) {
    return <Loading />;
  }

  const user = authData?.user;

  return (
    <div className={styles.pageContainer}>
      <section className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {user?.fullname?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className={styles.profileInfo}>
            <p className={styles.greeting}>Bem-vindo(a)</p>
            <h1>{user?.fullname || "Usuário"}</h1>
            <p className={styles.email}>{user?.email || "Nenhum e-mail cadastrado"}</p>
          </div>
        </div>

        <button className={styles.logoutButton} onClick={handleLogout}>
          Sair <LuLogOut />
        </button>
      </section>

      <section className={styles.infoCard}>
        <h2>Informações da conta</h2>
        <div className={styles.infoRow}>
          <span>Nome completo</span>
          <strong>{user?.fullname || "-"}</strong>
        </div>
        <div className={styles.infoRow}>
          <span>E-mail</span>
          <strong>{user?.email || "-"}</strong>
        </div>
      </section>
    </div>
  );
}
