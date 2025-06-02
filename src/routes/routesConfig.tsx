import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/Home/Home";
import LoginPage from "../pages/Login/Login";
import RegistrationPage from "../pages/Registration/Registration";
import NotFoundPage from "../pages/NotFound/NotFound";
import UserPage from "../pages/User/User";
import CatalogPage from "../pages/Catalog/Catalog";
import AboutPage from "../pages/About/About";
import { ProfileFallBack } from "../pages/Fallback/ProfileFallBack";
import { getCustomer } from "../services/customerService/customerService";

import { TokenService } from "../services/TokenService";

const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: MainLayout,
      children: [
        { index: true, Component: HomePage },
        { path: "login", Component: LoginPage },
        { path: "sign-up", Component: RegistrationPage },
        {
          path: "profile",
          loader: async () => {
            const customerId = TokenService.getCustomerId();
            const customerData = await getCustomer(customerId);
            return customerData;
          },
          errorElement: <ProfileFallBack />,
          Component: UserPage,
        },
        { path: "catalog", Component: CatalogPage },
        { path: "about", Component: AboutPage },
      ],
    },
    {
      path: "*",
      Component: NotFoundPage,
    },
  ],
  {
    basename: "/",
  }
);

export default router;
