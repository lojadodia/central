import Layout from "@components/common/layout";
import CreateOrUpdateTaxForm from "@components/tax/tax-form";

export default function CreateTaxPage() {
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading dark:text-white">Criar Novo Imposto</h1>
      </div>
      <CreateOrUpdateTaxForm />
    </>
  );
}
CreateTaxPage.Layout = Layout;
