import Layout from "@components/common/layout";
import CreateOrUpdateCategoriesForm from "@components/category/category-form";

export default function CreateCategoriesPage() {
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading">
        Criar nova categoria
        </h1>
      </div>
      <CreateOrUpdateCategoriesForm />
    </>
  );
}

CreateCategoriesPage.Layout = Layout;
