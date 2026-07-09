import styles from "./navbar.module.css";
import { LuShoppingCart, LuUser, LuMenu } from "react-icons/lu";
import { Drawer } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCartContext } from "../../contexts/useCartContext";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(JSON.parse(localStorage.getItem("auth"))?.token)
  );
  const { cartItems } = useCartContext();
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  const orderButtonLabel = isLoggedIn ? "Perfil" : "Fazer login";
  const orderButtonLink = isLoggedIn ? "/profile" : "/auth";

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(Boolean(JSON.parse(localStorage.getItem("auth"))?.token));
    };
    window.addEventListener("authChanged", handleAuthChange);
    return () => window.removeEventListener("authChanged", handleAuthChange);
  }, []);

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <>
      <nav className={styles.navbarContainer}>
        <div className={styles.navbarItems}>
          <Link to={"/"}>
            <img className={styles.logo} src="/logo_mymenu.png" alt="My Menu logo" />
          </Link>
          <div className={styles.navbarActions}>
          <div className={styles.navbarLinksContainer}>
            <Link to={"/plates"} className={styles.navbarLink}>
              Cardápio
            </Link>
            <Link to={"/"} className={styles.navbarLink}>
              Sobre Nós
            </Link>
            <Link to={"/orders"} className={styles.navbarLink}>
              Pedidos
            </Link>
          </div>
            <Link to={"/cart"} className={styles.cartButton}>
              <LuShoppingCart className={styles.navbarLink} />
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </Link>
            <Link to={orderButtonLink} className={styles.orderButton}>
              {orderButtonLabel}
            </Link>
          </div>
        </div>

        <div className={styles.mobileNavbarItems}>
          <Link to={"/"}>
            <img className={styles.logo} src="/logo_mymenu.png" alt="My Menu logo" />
          </Link>
          <div className={styles.navbarMobileButtons}>
            <Link to={"/cart"} className={styles.cartButton}>
              <LuShoppingCart className={styles.navbarLink} />
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </Link>
            <LuMenu className={styles.navbarLink} onClick={handleOpenMenu} />
          </div>
        </div>

        <Drawer anchor="right" open={openMenu} onClose={handleOpenMenu}>
          <div className={styles.drawer}>
            <Link to={"/"} className={styles.navbarLink} onClick={handleOpenMenu}>
              Home
            </Link>
            <Link to={"/plates"} className={styles.navbarLink} onClick={handleOpenMenu}>
              Cardápio
            </Link>
            <Link to={"/orders"} className={styles.navbarLink} onClick={handleOpenMenu}>
              Pedidos
            </Link>
            <Link to={"/profile"} className={styles.navbarLink} onClick={handleOpenMenu}>
              Perfil
            </Link>
          </div>
        </Drawer>
      </nav>
    </>
  );
}
