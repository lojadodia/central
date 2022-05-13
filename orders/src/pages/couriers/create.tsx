import Layout from "@components/common/layout";
import CreateOrUpdateCourierForm from "@components/courier/courier-form";

export default function CreateCourierPage() {
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading dark:text-white">Criar Novo Estafeta</h1>
      </div>
      <CreateOrUpdateCourierForm />
    </>
  );
}
CreateCourierPage.Layout = Layout;
