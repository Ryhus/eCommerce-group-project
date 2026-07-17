import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { CartDataProvider } from "../components/context/CartContextProvider";
import { AuthProvider } from "../components/context/AuthContextProvider";

function MainLayout() {
  return (
    <div>
      <AuthProvider>
        <CartDataProvider>
          <Header />
          <main>
            <Outlet />
          </main>
        </CartDataProvider>
      </AuthProvider>
      <Footer />
    </div>
  );
}

export default MainLayout;
