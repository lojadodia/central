import cn from "classnames";
import React, { InputHTMLAttributes } from "react";

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  inputClassName?: string;
  label?: string;
  note?: string;
  name: string;
  min?: any;
  max?: any;
  step?: any;
  value?: any;
  error?: string;
  type?: string;
  shadow?: boolean;
  variant?: "normal" | "solid" | "outline";
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
const Input = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      className,
      label,
      note,
      name,
      min,
      max,
      value,
      step,
      error,
      children,
      variant = "normal",
      shadow = false,
      type = "text",
      inputClassName,
      ...rest
    },
    ref
  ) => {
    const rootClassName = cn(
      classes.root,
      {
        [classes.normal]: variant === "normal",
        [classes.solid]: variant === "solid",
        [classes.outline]: variant === "outline",
      },
      {
        [classes.shadow]: shadow,
      },
      inputClassName
    );

    return (
      <div className={className}>
        <label
          htmlFor={name}
          className="block text-gray-600 font-semibold text-sm leading-none mb-3"
        >
          {label}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          step={step}
          min={min}
          max={max}
          value={value}
          
          ref={ref}
          className={rootClassName}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          aria-invalid={error ? "true" : "false"}
          {...rest}
        />
        {note && <p className="mt-2 text-xs text-gray-500">{note}</p>}
        {error && (
          <p className="my-2 text-xs text-left text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

export default Input;
