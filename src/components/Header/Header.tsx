import Nav from "../Navigation/Navigation";
import Link from "../common/link/link";
import Button from "../common/button/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { TokenService } from "../../services/TokenService";

import "./Header.scss";

function Header() {
  const navigate = useNavigate();

  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!TokenService.getAccessToken());

  useEffect(() => {
    setIsAuthenticated(!!TokenService.getAccessToken());
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

      <div
        className="burger-menu"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? "×" : "☰"}
      </div>

      <Nav />

      <div className="auth-links-container">
        <Button
          className="auth-link btn-medium"
          text={isAuthenticated ? "Log out" : "Log in"}
          onClick={() => {
            if (isAuthenticated) {
              TokenService.clearTokens();
            }
            navigate("/login");
          }}
        />

        {isAuthenticated ? (
          <Button className="auth-link btn-medium" text="Profile" onClick={() => navigate("/profile")} />
        ) : (
          <Button className="auth-link btn-medium" text="Register" onClick={() => navigate("/register")} />
        )}
      </div>
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}
    </header>
  );
}

export default Header;
