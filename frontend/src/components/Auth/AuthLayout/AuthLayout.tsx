import type { ReactNode } from "react";

import { PageContainer } from "../../common/PageContainer/PageContainer";

import "./AuthLayout.scss";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <PageContainer className="auth-layout">
      <div className="auth-layout__form-column">{children}</div>
    </PageContainer>
  );
}
