import React from "react";
import "./paragraph.scss";
type ParagraphProps = {
    text: string;
    isError?: boolean;
    className?: string;
};
declare const Paragraph: React.FC<ParagraphProps>;
export default Paragraph;
