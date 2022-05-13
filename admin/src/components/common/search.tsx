import { CloseIcon } from "@components/icons/close-icon";
import { SearchIcon } from "@components/icons/search-icon";
import cn from "classnames";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const classes = {
  root:
    "pl-10 pr-4 h-12 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0",
  normal:
    "bg-gray-100 border border-gray-300 focus:shadow focus:bg-white focus:border-primary",
  solid:
    "bg-gray-100 border border-gray-100 focus:bg-white focus:border-primary",
  outline: "border border-gray-300 focus:border-primary",
  shadow: "focus:shadow",
};

type SearchProps = {
  className?: string;
  shadow?: boolean;
  variant?: "normal" | "solid" | "outline";
  inputClassName?: string;
  onSearch: (data: SearchValue) => void;
};

type SearchValue = {
  searchText: string;
};

const Search: React.FC<SearchProps> = ({
  className,
  onSearch,
  variant = "outline",
  shadow = false,
  inputClassName,
  ...rest
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,

    formState: { errors },
  } = useForm<SearchValue>({
    defaultValues: {
      searchText: "",
    },
  });
  const searchText = watch("searchText");

  useEffect(() => {
    if (!searchText) {
      onSearch({ searchText: "" });
    }
  }, [searchText]);

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

  function clear() {
    reset();
    onSearch({ searchText: "" });
  }

  return (
    <form
      noValidate
      role="search"
      className={cn("w-full flex items-center relative", className)}
      onSubmit={handleSubmit(onSearch)}
    >
      <label htmlFor="search" className="sr-only">
      Procurar
      </label>
      <button className="outline-none absolute left-1 focus:outline-none active:outline-none p-2 text-gray-500">
        <SearchIcon className="w-5 h-5" />
      </button>
      <input
        type="text"
        id="search"
        {...register("searchText")}
        className={rootClassName}
        placeholder="Digite sua consulta e pressione Enter"
        aria-label="Procurar"
        autoComplete="off"
        {...rest}
      />
      {errors.searchText && <p>{errors.searchText.message}</p>}
      {!!searchText && (
        <button
          type="button"
          onClick={clear}
          className="outline-none absolute right-1 focus:outline-none active:outline-none p-2 text-gray-500"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      )}
    </form>
  );
};

export default Search;
