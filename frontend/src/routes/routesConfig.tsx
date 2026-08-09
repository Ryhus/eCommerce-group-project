import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/Home/Home";
import LoginPage from "../pages/Login/Login";
import RegistrationPage from "../pages/Registration/Registration";
import NotFoundPage from "../pages/NotFound/NotFound";
import UserPage from "../pages/User/User";
import CategoryPage from "../pages/Category/Category";
import AboutPage from "../pages/About/About";
import { ProfileFallBack } from "../pages/Fallback/ProfileFallBack";
import { loadCutomerData } from "./DataHandlers/Profile/ProfileLoaders";
import { actionCustomerData } from "./DataHandlers/Profile/ProfileActions";
import ProductPage from "../pages/Product/Product";
import BasketPage from "../pages/Basket/Basket";
import { GuestOnlyRoute } from "./guards/GuestOnlyRoute";
import { ScrollToTopLayout } from "./ScrollToTopLayout";

const router = createBrowserRouter(
  [
    {
      Component: ScrollToTopLayout,
      errorElement: <NotFoundPage />,
      children: [
        {
          path: "/",
          Component: MainLayout,
          errorElement: <NotFoundPage />,
          children: [
            { index: true, Component: HomePage },
            {
              Component: GuestOnlyRoute,
              children: [
                { path: "login", Component: LoginPage },
                { path: "sign-up", Component: RegistrationPage },
              ],
            },
            {
              path: "profile",
              loader: loadCutomerData,
              action: actionCustomerData,
              Component: UserPage,
              errorElement: <ProfileFallBack />,
            },
            {
              path: "catalog/*",
              Component: CategoryPage,
            },
            { path: "product/:id", Component: ProductPage },
            { path: "about", Component: AboutPage },
            {
              path: "basket",
              Component: BasketPage,
            },
          ],
        },
        { path: "*", Component: NotFoundPage },
      ],
    },
  ],
  {
    basename: "/",
  }
);

export default router;
