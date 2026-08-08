import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { IconButton } from "../../common/IconButton/IconButton";
import { PageContainer } from "../../common/PageContainer/PageContainer";

import "./AnnouncementBar.scss";

export function AnnouncementBar() {
  const { t } = useTranslation("common");
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <aside aria-label={t("announcement.region")} className="announcement-bar">
      <PageContainer className="announcement-bar__inner">
        <p className="announcement-bar__message">
          {t("announcement.message")}{" "}
          <Link className="announcement-bar__link" to="/sign-up">
            {t("announcement.signUp")}
          </Link>
        </p>
        <IconButton
          className="announcement-bar__dismiss"
          icon={<IoCloseOutline />}
          label={t("announcement.dismiss")}
          onClick={() => setIsVisible(false)}
          size="small"
        />
      </PageContainer>
    </aside>
  );
}
