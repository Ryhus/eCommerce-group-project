import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

import { IconButton } from "../../common/IconButton/IconButton";
import { PageContainer } from "../../common/PageContainer/PageContainer";

import "./AnnouncementBar.scss";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <aside aria-label="Promotional announcement" className="announcement-bar">
      <PageContainer className="announcement-bar__inner">
        <p className="announcement-bar__message">
          Sign up and get 20% off to your first order.{" "}
          <Link className="announcement-bar__link" to="/sign-up">
            Sign Up Now
          </Link>
        </p>
        <IconButton
          className="announcement-bar__dismiss"
          icon={<IoCloseOutline />}
          label="Dismiss promotion"
          onClick={() => setIsVisible(false)}
          size="small"
        />
      </PageContainer>
    </aside>
  );
}
