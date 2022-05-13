import cn from "classnames";
import React, { TextareaHTMLAttributes } from "react";

export interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  inputClassName?: string;
  label?: string;
  name: string;
  error?: string;
  shadow?: boolean;
  variant?: "normal" | "solid" | "outline";
  // onChange?: (...args: any[]) => any;
}

const classes = {
  root:
    "py-3 px-4 w-full rounded appearance-none transition duration-300 ease-in-out text-heading dark:text-white text-sm focus:outline-none focus:ring-0",
  normal:
    "bg-gray-100 dark:bg-black  border border-gray-300 dark:border-neutral-500 focus:shadow focus:bg-white dark:bg-neutral-900  focus:border-primary",
  solid:
    "bg-gray-100 dark:bg-black  border border-gray-100 dark:border-neutral-700 focus:bg-white dark:bg-neutral-900  focus:border-primary",
  outline: "border border-gray-300 dark:border-neutral-500 focus:border-primary",
  shadow: "focus:shadow",
};

const TextArea = React.forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  const {
    className,
    label,
    name,
    error,
    variant = "normal",
    shadow = false,
    inputClassName,
    // onChange,
    ...rest
  } = props;

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

  // const handleOnChange = (e: any) => {
  //   if (onChange) {
  //     onChange(e.target.value);
  //   }
  //   return null;
  // };

  return (
    <div className={className}>
      {label && (
        <label className="block text-gray-600 dark:text-neutral font-medium text-sm leading-none mb-3">
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        className={rootClassName}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        rows={4}
        // onChange={handleOnChange}
        ref={ref}
        {...rest}
      />
      {error && <p className="my-2 text-xs text-right text-red-500">{error}</p>}
    </div>
  );
});

export default TextArea;
