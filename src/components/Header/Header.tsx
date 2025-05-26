import Link from "../common/link/link";
import Nav from "../Navigation/Navigation";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { TokenService } from "../../services/TokenService";

import "./Header.scss";

function Header() {
  const navigate = useNavigate();

  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!TokenService.getLogin());

  useEffect(() => {
    setIsAuthenticated(!!TokenService.getLogin());
  }, [location]);

  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className={`header${menuOpen ? " menu-open" : ""}`}>
      <Link
        className="home-logo"
        text="Sport Gear"
        href="/"
        onClick={(e) => {
          e.preventDefault();
          navigate("/");
        }}
      />
      <Nav className="nav" isAuthenticated={isAuthenticated} />

      <div
        className="burger-menu"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? "×" : "☰"}
      </div>
      {menuOpen && <Nav className="ham-menu" isAuthenticated={isAuthenticated} />}
    </header>
  );
}

export default Header;
