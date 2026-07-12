import { useEffect } from "react";
import styles from "./orders.module.css";
import useOrderServices from "../../services/order";
import { LuTimer, LuBan } from "react-icons/lu";
import { FaRegCheckCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../loading/loading";
import { getStoredAuth } from "../../utils/authStorage";

export default function Orders() {
  const { getUserOrders, orderLoading, refetchOrders, ordersList } =
    useOrderServices();
  const navigate = useNavigate();

  const authData = getStoredAuth();

  useEffect(() => {
    if (!authData?.user?._id) {
      navigate("/auth");
      return;
    }

    if (refetchOrders) {
      getUserOrders(authData.user._id);
    }
  }, [authData, refetchOrders, navigate, getUserOrders]);

  if (orderLoading) {
    return <Loading />;
  }

  return (
    <>
      {ordersList?.length > 0 ? (
        <div>
          <h2>Meus Pedidos</h2>
          <div className={styles.ordersContainer}>
            {ordersList?.map((order) => (
              <div key={order._id} className={styles.orderContainer}>
                {order.pickupStatus === "Pending" ? (
                  <p className={`${styles.pickupStatus} ${styles.pending}`}>
                    <LuTimer />
                    {order?.pickupStatus}
                  </p>
                ) : null}
                {order.pickupStatus === "Completed" ? (
                  <p className={`${styles.pickupStatus} ${styles.completed}`}>
                    <FaRegCheckCircle />
                    {order?.pickupStatus}
                  </p>
                ) : null}
                {order.pickupStatus === "Canceled" ? (
                  <p className={`${styles.pickupStatus} ${styles.canceled}`}>
                    <LuBan />
                    {order?.pickupStatus}
                  </p>
                ) : null}
                <h3>{order?.pickupTime}</h3>
                {order?.orderItems?.map((item) => (
                  <div key={item._id}>
                    <h4>{item?.itemDetails[0]?.name}</h4>
                    <p>Quantidade: {item?.quantity}</p>
                    <p>Preço: R${item?.itemDetails[0]?.price?.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          Você ainda não tem pedidos.
          <Link to={"/plates"} className={styles.platesLinks}>
            Clique aqui e veja nossas especialidades!
          </Link>
        </div>
      )}
    </>
  );
}
