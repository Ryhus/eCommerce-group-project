import Link from "../common/link/link";
import Button from "../common/button/button";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { TokenService } from "../../services/TokenService";
import { AuthService } from "../../services/AuthService";
import { createCart } from "../../services/cartService/cartService";
import { useCart } from "../context/CartContext";

interface NavProps {
  isAuthenticated: boolean;
  className?: string;
}

function Nav({ isAuthenticated = false, className = "" }: NavProps) {
  const navigate = useNavigate();
  const { cart, calculateTotalQuantity } = useCart();
  const { setNewCart } = useCart();
  return (
    <nav className={className}>
      <Link
        className="nav-link"
        text="Home"
        href="/"
        onClick={(e) => {
          e.preventDefault();
          navigate("/");
        }}
      />
      <Link
        className="nav-link"
        text="Catalog"
        href="/catalog"
        onClick={(e) => {
          e.preventDefault();
          navigate("/catalog");
        }}
      />

      <Link
        className="nav-link"
        text="About"
        href="/about"
        onClick={(e) => {
          e.preventDefault();
          navigate("/about");
        }}
      />

      <Link
        className="nav-link nav-basket"
        text={cart ? `|${calculateTotalQuantity()}` : "|0"}
        icon={<FaShoppingCart />}
        href="/basket"
        onClick={(e) => {
          e.preventDefault();
          navigate("/basket");
        }}
      />

      <Button
        className="auth-link btn-medium"
        text={isAuthenticated ? "Log out" : "Log in"}
        onClick={async () => {
          if (isAuthenticated) {
            TokenService.clearTokens();
            const anonymousSessionData = await AuthService.anonymousAuthenticate();
            const anonymousId = anonymousSessionData?.scope.split(" ").at(-1)?.split(":").at(-1) as string;
            TokenService.setAnonSessionId(anonymousId);
            const anonymousCartData = await createCart({ currency: "EUR", anonymousId: anonymousId });
            const { id } = anonymousCartData;
            TokenService.setCartId(id);
            setNewCart(anonymousCartData);
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
