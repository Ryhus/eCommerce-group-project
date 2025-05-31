import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/Home/Home";
import LoginPage from "../pages/Login/Login";
import RegistrationPage from "../pages/Registration/Registration";
import NotFoundPage from "../pages/NotFound/NotFound";
import UserPage from "../pages/User/User";
import CategoryPage from "../pages/Category/Category";
import AboutPage from "../pages/About/About";
import ProductPage from "../pages/Product/Product";

const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: MainLayout,
      children: [
        { index: true, Component: HomePage },
        { path: "login", Component: LoginPage },
        { path: "sign-up", Component: RegistrationPage },
        { path: "profile", Component: UserPage },
        { path: "about", Component: AboutPage },
        { path: "catalog/*", Component: CategoryPage },
        { path: "product/*", Component: ProductPage },
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
