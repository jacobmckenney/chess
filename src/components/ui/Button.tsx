import type { PropsWithChildren } from "react";
import React from "react";

interface Props extends PropsWithChildren {
  action?: () => any;
  type?: "submit" | "reset" | "button" | undefined;
  className?: string;
}

const defaultStyling = "rounded-lg bg-black p-2 hover:bg-gray-700";

const Button: React.FC<Props> = ({ type, action, children, className }) => {
  return (
    <button
      type={type ?? "button"}
      onClick={() => {
        action && action();
      }}
      className={className ?? defaultStyling}
    >
      {children}
    </button>
  );
};

export default Button;
