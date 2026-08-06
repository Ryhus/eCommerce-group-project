import { useEffect, useState } from "react";
import { IoCloseOutline, IoMenuOutline, IoSearchOutline } from "react-icons/io5";
import { useLocation } from "react-router-dom";

import { IconButton } from "../common/IconButton/IconButton";
import { PageContainer } from "../common/PageContainer/PageContainer";
import { StoreLogo } from "../common/StoreLogo/StoreLogo";
import { HeaderActions } from "./HeaderActions/HeaderActions";
import { HeaderNavigation } from "./HeaderNavigation/HeaderNavigation";
import { HeaderSearch } from "./HeaderSearch/HeaderSearch";

import "./Header.scss";

function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", isMenuOpen);

    return () => document.body.classList.remove("no-scroll");
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsSearchOpen(false);
    setIsMenuOpen((isOpen) => !isOpen);
  };

  const toggleSearch = () => {
    setIsMenuOpen(false);
    setIsSearchOpen((isOpen) => !isOpen);
  };

  return (
    <header className="site-header">
      <PageContainer className="site-header__inner">
        <IconButton
          aria-controls="mobile-navigation"
          aria-expanded={isMenuOpen}
          className="site-header__menu-toggle"
          icon={isMenuOpen ? <IoCloseOutline /> : <IoMenuOutline />}
          label={isMenuOpen ? "Close menu" : "Open menu"}
          onClick={toggleMenu}
        />
        <StoreLogo className="site-header__logo" />
        <HeaderNavigation className="site-header__desktop-navigation" />
        <HeaderSearch className="site-header__desktop-search" />
        <IconButton
          aria-controls="mobile-search"
          aria-expanded={isSearchOpen}
          className="site-header__search-toggle"
          icon={isSearchOpen ? <IoCloseOutline /> : <IoSearchOutline />}
          label={isSearchOpen ? "Close search" : "Open search"}
          onClick={toggleSearch}
        />
        <HeaderActions />
      </PageContainer>

      {isSearchOpen && (
        <PageContainer className="site-header__mobile-search" id="mobile-search">
          <HeaderSearch autoFocus onSearch={() => setIsSearchOpen(false)} />
        </PageContainer>
      )}

      {isMenuOpen && (
        <div className="site-header__mobile-menu" id="mobile-navigation">
          <PageContainer className="site-header__mobile-menu-inner">
            <HeaderNavigation onNavigate={() => setIsMenuOpen(false)} orientation="vertical" />
          </PageContainer>
        </div>
      )}
    </header>
  );
}

export default Header;
