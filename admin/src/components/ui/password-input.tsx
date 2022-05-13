import { Eye } from "@components/icons/eye-icon";
import { EyeOff } from "@components/icons/eye-off-icon";
import cn from "classnames";
import React, { InputHTMLAttributes, useState } from "react";
import Link from "./link";

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  inputClassName?: string;
  label: string;
  name: string;
  forgotPageLink?: string;
  shadow?: boolean;
  variant?: "normal" | "solid" | "outline";
  error: string | undefined;
}
const classes = {
  root:
    "px-4 h-12 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0",
  normal:
    "bg-gray-100 border border-gray-300 focus:shadow focus:bg-white focus:border-primary",
  solid:
    "bg-gray-100 border border-gray-100 focus:bg-white focus:border-primary",
  outline: "border border-gray-300 focus:border-primary",
  shadow: "focus:shadow",
};
const PasswordInput = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      className,
      inputClassName,
      label,
      name,
      error,
      children,
      variant = "normal",
      shadow = false,
      type = "text",
      forgotPageLink = "",
      ...rest
    },
    ref
  ) => {
    const [show, setShow] = useState(false);

    const rootClassName = cn(
      classes.root,
      {
        [classes.normal]: variant === "normal",
        [classes.solid]: variant === "solid",
        [classes.outline]: variant === "outline",
      },
      shadow == true && classes.shadow,
      inputClassName
    );

    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-3">
          <label
            htmlFor={name}
            className="text-gray-600 font-medium text-sm leading-none"
          >
            {label}
          </label>

          
        </div>
        <div className="relative">
          <input
            id={name}
            name={name}
            type={show ? "text" : "password"}
            ref={ref}
            className={rootClassName}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            {...rest}
          />
          <label
            htmlFor={name}
            className="absolute right-4 top-5 -mt-2 text-gray-500"
            onClick={() => setShow((prev) => !prev)}
          >
            {show ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </label>
          {forgotPageLink && (
            <Link
              href={forgotPageLink}
              className="text-xs text-primary transition-colors duration-200 focus:outline-none focus:text-blue-500 hover:text-primary-2"
            >
              Recuperar Password
            </Link>
          )}
        </div>
        {error && (
          <p className="my-2 text-xs text-left text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

export default PasswordInput;
