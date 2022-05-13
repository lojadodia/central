import Select from "@components/ui/select/select";
import { Controller } from "react-hook-form";

interface SelectInputProps {
  control: any;
  rules?: any;
  name: string;
  options: object[];
  [key: string]: unknown;
}

const SelectInput = ({
  control,
  options,
  name,
  rules,
  ...rest
}: SelectInputProps) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      // defaultValue={[]}
      render={({ field }) => <Select {...field} {...rest} options={options} />}
    />
  );
};

export default SelectInput;
