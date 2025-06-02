import { useEffect } from "react";
import { TokenService } from "../../services/TokenService";
import { useNavigate } from "react-router-dom";

export function ProfileFallBack() {
  const isLoggedIn = TokenService.getLogin();
  console.log(isLoggedIn);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);
  return <div>Redirecting to the login page</div>;
}
