import Layout from "@components/common/layout";
import CreateOrUpdateCategoriesForm from "@components/category/category-form";
import { useRouter } from "next/router";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useCategoryQuery } from "@data/category/use-category.query";

export default function UpdateCategoriesPage() {
  const { query } = useRouter();
  const { data, isLoading: loading, error } = useCategoryQuery(
    query.id as string
  );

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading">Editar categoria</h1>
      </div>

      <CreateOrUpdateCategoriesForm initialValues={data} />
    </>
  );
}

UpdateCategoriesPage.Layout = Layout;
