import type { ComponentPropsWithoutRef } from "react";

import "./PageContainer.scss";

type PageContainerProps = ComponentPropsWithoutRef<"div">;

export function PageContainer({ className = "", ...props }: PageContainerProps) {
  const classes = `page-container ${className}`.trim();

  return <div className={classes} {...props} />;
}
