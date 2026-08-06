import { useEffect, type ComponentPropsWithoutRef } from "react";

import "./Message.scss";

type MessageVariant = "error" | "info" | "success";

type MessageProps = Omit<ComponentPropsWithoutRef<"div">, "children" | "onClose"> & {
  text: string;
  duration?: number;
  onClose: () => void;
  variant?: MessageVariant;
};

export default function Message({
  text,
  duration = 3000,
  onClose,
  variant = "success",
  className = "",
  ...props
}: MessageProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const messageClass = `message message--${variant} ${className}`.trim();
  const role = props.role ?? (variant === "error" ? "alert" : "status");
  const ariaLive = props["aria-live"] ?? (variant === "error" ? "assertive" : "polite");

  return (
    <div
      {...props}
      aria-atomic={props["aria-atomic"] ?? true}
      aria-live={ariaLive}
      className={messageClass}
      role={role}
    >
      {text}
    </div>
  );
}
