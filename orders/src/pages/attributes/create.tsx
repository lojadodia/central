import Layout from "@components/common/layout";
import CreateOrUpdateAttributeForm from "@components/attribute/attribute-form";

export default function CreateAttributePage() {
	return (
		<>
			<div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
				<h1 className="text-lg font-semibold text-heading dark:text-white">
				Criar Novo Extra
				</h1>
			</div>
			<CreateOrUpdateAttributeForm />
		</>
	);
}
CreateAttributePage.Layout = Layout;
