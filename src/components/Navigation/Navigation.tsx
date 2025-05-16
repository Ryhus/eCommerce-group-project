import { Link } from "react-router-dom";
import "./Navigation.scss";

function Nav() {
  return (
    <nav className="nav">
      <Link className="home-logo" to="/">
        Sport Gear
      </Link>

      <div className="auth-links-container">
        <Link className="auth-link" to="/login">
          Log in
        </Link>
        <Link className="auth-link" to="/register">
          Sign up
        </Link>
      </div>
    </nav>
  );
}

export default Nav;
