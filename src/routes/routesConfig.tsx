import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/Home/Home";
import LoginPage from "../pages/Login/Login";
import RegistrationPage from "../pages/Registration/Registration";
import NotFoundPage from "../pages/NotFound/NotFound";

const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: MainLayout,
      children: [
        { index: true, Component: HomePage },
        { path: "login", Component: LoginPage },
        { path: "register", Component: RegistrationPage },
      ],
    },
    {
      path: "*",
      Component: NotFoundPage,
    },
  ],
  {
    basename: "/eCommerce-group-project",
  }
);

export default router;
