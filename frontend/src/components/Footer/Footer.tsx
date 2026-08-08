import { useTranslation } from "react-i18next";

import { PageContainer } from "../common/PageContainer/PageContainer";
import { StoreLogo } from "../common/StoreLogo/StoreLogo";

import FooterLinkColumn, { type FooterLinkItem } from "./FooterLinkColumn/FooterLinkColumn";
import FooterProjectLinks from "./FooterProjectLinks/FooterProjectLinks";
import NewsletterSignup from "./NewsletterSignup/NewsletterSignup";
import "./Footer.scss";

const footerNavigation = [
  {
    titleKey: "footer.company",
    links: [
      { href: "/", labelKey: "footer.home" },
      { href: "/about", labelKey: "footer.about" },
    ],
  },
  {
    titleKey: "footer.shop",
    links: [
      { href: "/catalog", labelKey: "footer.catalog" },
      { href: "/basket", labelKey: "footer.basket" },
    ],
  },
  {
    titleKey: "footer.account",
    links: [
      { href: "/profile", labelKey: "footer.profile" },
      { href: "/login", labelKey: "footer.signIn" },
      { href: "/sign-up", labelKey: "footer.createAccount" },
    ],
  },
  {
    titleKey: "footer.resources",
    links: [
      {
        external: true,
        href: "https://github.com/Ryhus/eCommerce-group-project",
        labelKey: "footer.sourceCode",
      },
      {
        external: true,
        href: "https://www.figma.com/design/5YOFNziZ7GHoRl7tgAo3ii/E-commerce-Website-Template--Freebie---Community-",
        labelKey: "footer.designReference",
      },
      { external: true, href: "https://rs.school/", labelKey: "footer.rsSchool" },
    ],
  },
] as const;

const Footer = () => {
  const { t } = useTranslation("common");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <PageContainer className="site-footer__container">
        <NewsletterSignup className="site-footer__newsletter" />

        <div className="site-footer__content">
          <div className="site-footer__brand">
            <StoreLogo />
            <p className="site-footer__description">{t("footer.description")}</p>
            <FooterProjectLinks />
          </div>

          <div className="site-footer__navigation">
            {footerNavigation.map(({ links, titleKey }) => {
              const translatedLinks: FooterLinkItem[] = links.map(({ labelKey, ...link }) => ({
                ...link,
                label: t(labelKey),
              }));

              return <FooterLinkColumn key={titleKey} links={translatedLinks} title={t(titleKey)} />;
            })}
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>{t("footer.rightsReserved", { year: currentYear })}</p>
          <p className="site-footer__demo-note">{t("footer.demoNote")}</p>
        </div>
      </PageContainer>
    </footer>
  );
};

export default Footer;
