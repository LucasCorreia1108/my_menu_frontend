import Navbar from "./components/navbar/navbar";
import { Outlet } from "react-router-dom";
import Footer from "./components/footer/footer";
import { CartProvider } from "./contexts/useCartContext";
import { SnackbarProvider } from "./contexts/useSnackbarContext";

export default function App() {
  return (
    <>
      <SnackbarProvider>
        <CartProvider>
          <Navbar />
          <main>
            <Outlet />
          </main>
          <Footer />
        </CartProvider>
      </SnackbarProvider>
    </>
  );
}
