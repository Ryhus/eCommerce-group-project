import { RouterProvider } from "react-router-dom";
import router from "./routesConfig";

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
