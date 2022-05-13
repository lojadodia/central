import SelectInput from "@components/ui/select-input";
import Label from "@components/ui/label";
import { Control, useFormState, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { useProductsQuery } from "@data/product/products.query";

interface Props {
	control: Control<any>;
	setValue: any;
}

const ProductCouponList = ({ control, setValue }: Props) => {
	const type = useWatch({
		control,

	});
	const { dirtyFields } = useFormState({
		control,
	});
	useEffect(() => {
		if (type?.slug && dirtyFields?.type) {
			setValue("products", []);
		}
	}, [type?.slug]);

	const { data, isLoading: loading } = useProductsQuery({
		limit: 999,
		type: type.slug,
	});

	return (
		<div>
			<Label>Produtos</Label>
			<SelectInput
			className="mb-5" 
				name="products"
				isMulti
				control={control}
				getOptionLabel={(option: any) => option.name}
				getOptionValue={(option: any) => option.id}
				// @ts-ignore
				options={data?.products?.data}
				isLoading={loading}
			/>
		</div>
	);
};

export default ProductCouponList;
