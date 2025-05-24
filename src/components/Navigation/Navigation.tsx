//import { Link } from "react-router-dom";
import "./Navigation.scss";
import Link from "../common/link/link";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TokenService } from "../../services/TokenService";

function Nav() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!TokenService.getAccessToken());

  useEffect(() => {
    setIsAuthenticated(!!TokenService.getAccessToken());
  }, [location]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, action?: () => void) => {
    e.preventDefault();
    if (action) action();
    navigate(href);
  };

  return (
    <nav className="nav">
      <Link className="home-logo" text="Sport Gear" href="/" onClick={(e) => handleClick(e, "/")} />

      <div className="auth-links-container">
        <Link
          className="auth-link"
          text={isAuthenticated ? "Log out" : "Log in"}
          href={isAuthenticated ? "/login" : "/login"}
          onClick={(e) => handleClick(e, "/login", isAuthenticated ? TokenService.clearTokens : undefined)}
        />
        {isAuthenticated ? (
          <Link
            className="auth-link"
            text="Profile"
            href="/profile"
            onClick={(e) => {
              e.preventDefault();
              navigate("/profile");
            }}
          />
        ) : (
          <Link
            className="auth-link"
            text="Register"
            href="/register"
            onClick={(e) => {
              e.preventDefault();
              navigate("/register");
            }}
          />
        )}
      </div>
    </nav>
  );
}

export default Nav;
