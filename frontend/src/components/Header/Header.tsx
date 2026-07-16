import Link from "../common/link/link";
import Nav from "../Navigation/Navigation";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";

import "./Header.scss";

function Header() {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll-body");
    };
  }, [menuOpen]);

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
