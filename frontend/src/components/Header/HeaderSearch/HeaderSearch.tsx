import { useEffect, useState, type ComponentPropsWithoutRef, type FormEvent } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

import { IconButton } from "../../common/IconButton/IconButton";

import "./HeaderSearch.scss";

type HeaderSearchProps = Omit<ComponentPropsWithoutRef<"form">, "aria-label" | "onSubmit" | "role"> & {
  autoFocus?: boolean;
  onSearch?: () => void;
};

function getSearchTerm(search: string) {
  return new URLSearchParams(search).get("search") ?? "";
}

export function HeaderSearch({ autoFocus = false, className = "", onSearch, ...props }: HeaderSearchProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState(() => getSearchTerm(location.search));

  useEffect(() => {
    setQuery(getSearchTerm(location.search));
  }, [location.search]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedQuery = query.trim();
    const searchParams = new URLSearchParams();
    if (normalizedQuery) searchParams.set("search", normalizedQuery);

    navigate({
      pathname: "/catalog",
      search: searchParams.size > 0 ? `?${searchParams.toString()}` : "",
    });
    onSearch?.();
  };

  const classes = `header-search ${className}`.trim();

  return (
    <form {...props} aria-label="Product search" className={classes} onSubmit={handleSubmit} role="search">
      <IconButton
        className="header-search__submit"
        icon={<IoSearchOutline />}
        label="Search products"
        size="small"
        type="submit"
      />
      <input
        aria-label="Search for products"
        autoComplete="off"
        autoFocus={autoFocus}
        className="header-search__input"
        maxLength={100}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search for products..."
        type="search"
        value={query}
      />
    </form>
  );
}
