import cn from "classnames";
import { forwardRef } from "react";

type RadioGroupProps = {
  label?: string;
  onClick: () => void;
  active?: boolean;
  className?: string;
  color?: string;
};

const RadioGroup: React.FC<RadioGroupProps> = forwardRef(({
  label,
  active,
  onClick,
  className,
  color,
}, ref) => { 
  const classes = cn(
    {
      "px-4 py-3 my-1 mr-2 text-lg border border-gray-100 bg-white rounded text-heading dark:text-white   dark:bg-neutral-600 dark:border-neutral-300 absolute-capitalize":
        className !== "color",
      "!text-white !bg-primary !border-primary":
        active && className !== "color",
      "h-11 w-11 p-0.5 flex items-center justify-center border-2 rounded-full border-transparent":

        className === "color",
      "!border-primary": active && className === "color",
    },
    "cursor-pointer"
  );
  return (
    <div ref={ref} className={classes.concat(' ').concat(className)} onClick={onClick}>
      {className === "color" ? (
        <span
          className="w-full h-full rounded-full border dark:border-neutral-700 border-gray-200"
          style={{ backgroundColor: color }}
        />
      ) : (
        label
      )} 
    </div>
  );
});

export default RadioGroup;
