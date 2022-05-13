import Layout from "@components/common/layout";
import CreateOrUpdateFaqForm from "@components/faq/faq-form";

export default function CreateFaqPage() {
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading dark:text-white">Criar Nova FAQ</h1>
      </div>
      <CreateOrUpdateFaqForm />
    </>
  );
}
CreateFaqPage.Layout = Layout;
