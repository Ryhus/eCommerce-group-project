import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { CartDataProvider } from "../components/context/CartContext";

function MainLayout() {
  return (
    <div>
      <CartDataProvider>
        <Header />
        <main>
          <Outlet />
        </main>
      </CartDataProvider>
      <Footer />
    </div>
  );
}

export default MainLayout;
