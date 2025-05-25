//import { Link } from "react-router-dom";
import "./Navigation.scss";
import Link from "../common/link/link";
import { useNavigate } from "react-router-dom";

function Nav() {
  const navigate = useNavigate();

  return (
    <nav className="nav">
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
    </nav>
  );
}

export default Nav;
