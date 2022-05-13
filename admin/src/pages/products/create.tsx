import Layout from "@components/common/layout";
import CreateOrUpdateProductForm from "@components/product/product-form";
import { useAttributesQuery } from "@data/attributes/use-attributes.query";

export default function CreateProductPage() {
	const { data } = useAttributesQuery();
	return (
		<>
			<div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
				<h1 className="text-lg font-semibold text-heading">
				Criar Novo Produto
				</h1>
			</div>
			<CreateOrUpdateProductForm attributes={data?.attributes} />
		</>
	);
}
CreateProductPage.Layout = Layout;
