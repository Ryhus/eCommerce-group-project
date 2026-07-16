import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "../common/button/button";
import Link from "../common/link/link";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";

interface NavProps {
  isAuthenticated: boolean;
  className?: string;
}

function Nav({ isAuthenticated, className = "" }: NavProps) {
  const navigate = useNavigate();
  const { cart, calculateTotalQuantity, refreshCart } = useCart();
  const { logout } = useAuth();

  const navLink = (text: string, href: string) => (
    <Link
      className="nav-link"
      text={text}
      href={href}
      onClick={(event) => {
        event.preventDefault();
        navigate(href);
      }}
    />
  );

  return (
    <nav className={className}>
      {navLink("Home", "/")}
      {navLink("Catalog", "/catalog")}
      {navLink("About", "/about")}
      <Link
        className="nav-link nav-basket"
        text={cart ? `(${calculateTotalQuantity()})` : "(0)"}
        icon={<FaShoppingCart />}
        href="/basket"
        onClick={(event) => {
          event.preventDefault();
          navigate("/basket");
        }}
      />
      <Button
        className="auth-link btn-medium"
        text={isAuthenticated ? "Log out" : "Log in"}
        onClick={async () => {
          if (isAuthenticated) {
            await logout();
            await refreshCart();
          }
          navigate("/login");
        }}
      />
      {isAuthenticated ? (
        <Button className="auth-link btn-medium" text="Profile" onClick={() => navigate("/profile")} />
      ) : (
        <Button className="auth-link btn-medium" text="Sign up" onClick={() => navigate("/sign-up")} />
      )}
    </nav>
  );
}

export default Nav;
