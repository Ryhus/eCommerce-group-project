import { useEffect } from "react";
import "./Message.scss";

interface MessageProps {
  text: string;
  duration?: number;
  onClose: () => void;
}

export default function Message({ text, duration = 3000, onClose }: MessageProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return <div className="message">{text}</div>;
}
