import Layout from "@components/common/layout";
import CreateOrUpdateTypeForm from "@components/type/type-form";

export default function CreateTypePage() {
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading">Criar Novo Tipo</h1>
      </div>
      <CreateOrUpdateTypeForm />
    </>
  );
}
CreateTypePage.Layout = Layout;
