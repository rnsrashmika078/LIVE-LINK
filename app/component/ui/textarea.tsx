import { TextareaHTMLAttributes } from "react";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    type?: string;
};

export function TextArea({ type, ...props }: TextAreaProps) {
    return <textarea placeholder="" {...props}></textarea>;
}
