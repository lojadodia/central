import Layout from "@components/common/layout";
import CreateOrUpdateAttributeValueForm from "@components/attribute-values/attribute-values-form";

export default function CreateAttributeValuePage() {
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading">
        Criar Nova Opção de Extra
        </h1>
      </div>
      <CreateOrUpdateAttributeValueForm />
    </>
  );
}
CreateAttributeValuePage.Layout = Layout;
