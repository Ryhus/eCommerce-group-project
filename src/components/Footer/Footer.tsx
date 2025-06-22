import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__content">
        <a href="https://rs.school/" target="_blank" rel="noopener noreferrer" className="footer__logo-link">
          <img src="/logos/rs-school-logo.svg" alt="RS School Logo" className="footer__logo" />
        </a>

        <p className="footer__year">© 2025</p>

        <a href="https://github.com/ryhus" target="_blank" rel="noopener noreferrer" className="footer__logo-link">
          <img src="/logos/gh-logo.png" alt="Github Logo" className="footer__logo" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
