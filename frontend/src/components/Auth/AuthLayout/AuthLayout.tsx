import type { ReactNode } from "react";

import { PageContainer } from "../../common/PageContainer/PageContainer";

import "./AuthLayout.scss";

type AuthLayoutProps = {
  children: ReactNode;
  panelDescription: string;
  panelTitle: string;
};

export function AuthLayout({ children, panelDescription, panelTitle }: AuthLayoutProps) {
  return (
    <PageContainer className="auth-layout">
      <aside aria-label="Sport Gear account benefits" className="auth-layout__panel">
        <div aria-hidden="true" className="auth-layout__decoration" />

        <div className="auth-layout__panel-content">
          <p className="auth-layout__eyebrow">Sport Gear account</p>
          <p className="auth-layout__panel-title">{panelTitle}</p>
          <p className="auth-layout__panel-description">{panelDescription}</p>
        </div>
      </aside>

      <div className="auth-layout__form-column">{children}</div>
    </PageContainer>
  );
}
