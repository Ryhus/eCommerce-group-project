import "./NotFound.scss";
import Button from "../../components/common/button/button";
import { H1 } from "../../components/common/headings/H1";
import Paragraph from "../../components/common/paragraph/paragraph";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="error-page">
      <div className="error-content">
        <H1 className="error-code" text="404"></H1>
        <Paragraph className="error-message" text="Page not found"></Paragraph>
        <Paragraph className="error-description" text="The page you are looking for does not exist."></Paragraph>
        <Button className="home-button" text="Go to homepage" onClick={() => navigate("/")}></Button>
      </div>
    </div>
  );
}

export default NotFoundPage;
