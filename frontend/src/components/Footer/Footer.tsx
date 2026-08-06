import { PageContainer } from "../common/PageContainer/PageContainer";
import { StoreLogo } from "../common/StoreLogo/StoreLogo";

import FooterLinkColumn, { type FooterLinkItem } from "./FooterLinkColumn/FooterLinkColumn";
import FooterProjectLinks from "./FooterProjectLinks/FooterProjectLinks";
import NewsletterSignup from "./NewsletterSignup/NewsletterSignup";
import "./Footer.scss";

type FooterNavigationGroup = {
  title: string;
  links: FooterLinkItem[];
};

const footerNavigation: FooterNavigationGroup[] = [
  {
    title: "Company",
    links: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
    ],
  },
  {
    title: "Shop",
    links: [
      { href: "/catalog", label: "Catalog" },
      { href: "/basket", label: "Basket" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/profile", label: "Profile" },
      { href: "/login", label: "Sign in" },
      { href: "/sign-up", label: "Create account" },
    ],
  },
  {
    title: "Resources",
    links: [
      {
        external: true,
        href: "https://github.com/Ryhus/eCommerce-group-project",
        label: "Source code",
      },
      {
        external: true,
        href: "https://www.figma.com/design/5YOFNziZ7GHoRl7tgAo3ii/E-commerce-Website-Template--Freebie---Community-",
        label: "Design reference",
      },
      { external: true, href: "https://rs.school/", label: "RS School" },
    ],
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <PageContainer className="site-footer__container">
        <NewsletterSignup className="site-footer__newsletter" />

        <div className="site-footer__content">
          <div className="site-footer__brand">
            <StoreLogo />
            <p className="site-footer__description">
              Performance-ready sportswear and equipment for training, competition, and everyday movement.
            </p>
            <FooterProjectLinks />
          </div>

          <div className="site-footer__navigation">
            {footerNavigation.map((group) => (
              <FooterLinkColumn key={group.title} links={group.links} title={group.title} />
            ))}
          </div>
        </div>

        <div className="site-footer__bottom">
          <p>Sport Gear © {currentYear}. All rights reserved.</p>
          <p className="site-footer__demo-note">Demo store · Payments are not processed</p>
        </div>
      </PageContainer>
    </footer>
  );
};

export default Footer;
