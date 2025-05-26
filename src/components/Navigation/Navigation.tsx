import Link from "../common/link/link";
import Button from "../common/button/button";
import { useNavigate } from "react-router-dom";
import { TokenService } from "../../services/TokenService";

interface NavProps {
  isAuthenticated: boolean;
  className?: string;
}

function Nav({ isAuthenticated = false, className = "" }: NavProps) {
  const navigate = useNavigate();

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
        <Button className="auth-link btn-medium" text="Sign up" onClick={() => navigate("/sign-up")} />
      )}
    </nav>
  );
}

export default Nav;
