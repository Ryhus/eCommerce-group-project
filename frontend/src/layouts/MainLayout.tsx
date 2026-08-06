import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import { AnnouncementBar } from "../components/Header/AnnouncementBar/AnnouncementBar";
import Footer from "../components/Footer/Footer";
import { CartDataProvider } from "../components/context/CartContextProvider";
import { AuthProvider } from "../components/context/AuthContextProvider";

function MainLayout() {
  return (
    <div>
      <AnnouncementBar />
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
