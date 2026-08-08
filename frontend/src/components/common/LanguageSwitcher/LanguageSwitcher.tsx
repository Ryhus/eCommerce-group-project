import { useEffect, useId, useRef, useState, type ComponentPropsWithoutRef, type KeyboardEvent } from "react";
import { PiCaretDown, PiCheck, PiTranslate } from "react-icons/pi";
import { useTranslation } from "react-i18next";

import { LANGUAGE_OPTIONS, normalizeLanguage, type SupportedLanguage } from "../../../i18n/languages";

import "./LanguageSwitcher.scss";

type LanguageSwitcherProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  align?: "left" | "right";
};

export function LanguageSwitcher({ align = "right", className = "", ...props }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useId();
  const currentLanguage = normalizeLanguage(i18n.resolvedLanguage) ?? "en";
  const currentOption = LANGUAGE_OPTIONS.find(({ code }) => code === currentLanguage) ?? LANGUAGE_OPTIONS[0];
  const classes = `language-switcher language-switcher--${align} ${className}`.trim();

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [isOpen]);

  const closeMenu = (restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const focusOption = (index: number) => {
    const optionCount = LANGUAGE_OPTIONS.length;
    optionRefs.current[(index + optionCount) % optionCount]?.focus();
  };

  const openMenu = (focus: "current" | "first" | "last" = "current") => {
    setIsOpen(true);
    requestAnimationFrame(() => {
      if (focus === "first") focusOption(0);
      else if (focus === "last") focusOption(LANGUAGE_OPTIONS.length - 1);
      else focusOption(LANGUAGE_OPTIONS.findIndex(({ code }) => code === currentLanguage));
    });
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openMenu("first");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openMenu("last");
    }
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = optionRefs.current.findIndex((option) => option === document.activeElement);

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu(true);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      focusOption(currentIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusOption(currentIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusOption(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusOption(LANGUAGE_OPTIONS.length - 1);
    } else if (event.key === "Tab") {
      setIsOpen(false);
    }
  };

  const selectLanguage = async (language: SupportedLanguage) => {
    await i18n.changeLanguage(language);
    closeMenu(true);
  };

  return (
    <div {...props} className={classes} ref={rootRef}>
      <button
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={t("language.selected", { language: currentOption.label })}
        className="language-switcher__trigger"
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        onKeyDown={handleTriggerKeyDown}
        ref={triggerRef}
        title={t("language.change")}
        type="button"
      >
        <PiTranslate aria-hidden="true" className="language-switcher__translate-icon" />
        <span className="language-switcher__code">{currentOption.code.toUpperCase()}</span>
        <PiCaretDown aria-hidden="true" className="language-switcher__caret" />
      </button>

      {isOpen && (
        <div
          aria-label={t("language.menu")}
          className="language-switcher__menu"
          id={menuId}
          onKeyDown={handleMenuKeyDown}
          role="menu"
        >
          {LANGUAGE_OPTIONS.map((option, index) => {
            const isSelected = option.code === currentLanguage;

            return (
              <button
                aria-checked={isSelected}
                className="language-switcher__option"
                key={option.code}
                onClick={() => void selectLanguage(option.code)}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                role="menuitemradio"
                type="button"
              >
                <span className="language-switcher__option-code">{option.code.toUpperCase()}</span>
                <span className="language-switcher__option-label">{option.label}</span>
                {isSelected && <PiCheck aria-hidden="true" className="language-switcher__check" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
