import SelectInput from "@components/ui/select-input";
import Label from "@components/ui/label";
import ValidationError from "@components/ui/form-validation-error";
import { Control } from "react-hook-form";
import { useTypesQuery } from "@data/type/use-types.query";

interface Props {
	control: Control<any>;
	error: string | undefined;
	[key: string]: unknown
}

const ProductGroupInput = ({ control, error, ...rest }: Props) => {
	const { data, isLoading: loading } = useTypesQuery({
		limit: 200,
	});
	return (
		<div className="mb-5">
			<Label>Grupo*</Label>
			<SelectInput
				name="type"
				control={control}
				getOptionLabel={(option: any) => option.name}
				getOptionValue={(option: any) => option.id}
				{...rest}
				options={data?.types!}
				isLoading={loading}
			/>
			<ValidationError message={error} />
		</div>
	);
};

export default ProductGroupInput;
