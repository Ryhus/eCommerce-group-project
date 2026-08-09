import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import { AnnouncementBar } from "../components/Header/AnnouncementBar/AnnouncementBar";
import Footer from "../components/Footer/Footer";
import { CartDataProvider } from "../components/context/CartContextProvider";
import { AuthProvider } from "../components/context/AuthContextProvider";

import "./MainLayout.scss";

function MainLayout() {
  return (
    <div className="app-shell">
      <AuthProvider>
        <AnnouncementBar />
        <CartDataProvider>
          <Header />
          <main className="app-shell__main">
            <Outlet />
          </main>
        </CartDataProvider>
      </AuthProvider>
      <Footer />
    </div>
  );
}

export default MainLayout;
