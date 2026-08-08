import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { H1 } from "../../components/common/headings/H1";
import Paragraph from "../../components/common/paragraph/paragraph";
import Button from "../../components/common/button/button";
import { PageContainer } from "../../components/common/PageContainer/PageContainer";

import "./NotFound.scss";

function NotFoundPage() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();

  return (
    <PageContainer className="not-found-page">
      <section aria-labelledby="not-found-title" className="not-found-page__content">
        <p aria-hidden="true" className="not-found-page__code">
          404
        </p>
        <H1 className="not-found-page__title" id="not-found-title" text={t("notFound.title")} />
        <Paragraph className="not-found-page__description" text={t("notFound.description")} />
        <div className="not-found-page__actions">
          <Button text={t("notFound.backHome")} onClick={() => navigate("/")} />
          <Button text={t("notFound.browseGear")} onClick={() => navigate("/catalog")} variant="light" />
        </div>
      </section>
    </PageContainer>
  );
}

export default NotFoundPage;
