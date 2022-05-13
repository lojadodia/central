import cn from "classnames";
import { LabelHTMLAttributes } from "react";

export interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

const Title: React.FC<Props> = ({ className = "mb-3", ...rest }) => {
  return (
    <span
      className={cn(
        "block text-gray-600 dark:text-neutral font-semibold text-sm leading-none",
        className
      )}
      {...rest}
    />
  );
};

export default Title;
