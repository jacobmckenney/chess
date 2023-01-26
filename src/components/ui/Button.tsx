import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import React from "react";

interface Props extends PropsWithChildren {
  action?: () => void;
  type?: "submit" | "reset" | "button" | undefined;
}

const Button: React.FC<Props> = ({ type, action, children }) => {
  return (
    <button type={type} onClick={() => action && action()}>
      {children}
    </button>
  );
};

export default Button;
