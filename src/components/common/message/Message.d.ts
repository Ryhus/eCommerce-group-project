import "./Message.scss";
interface MessageProps {
  text: string;
  duration?: number;
  onClose: () => void;
}
export default function Message({ text, duration, onClose }: MessageProps): import("react/jsx-runtime").JSX.Element;
export {};
