import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

export function ScrollToTopLayout() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search]);

  return <Outlet />;
}
