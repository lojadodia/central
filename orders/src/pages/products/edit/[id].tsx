import Layout from "@components/common/layout";
import CreateOrUpdateProductForm from "@components/product/product-form";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useAttributesQuery } from "@data/attributes/use-attributes.query";
import { useProductQuery } from "@data/product/product.query";
import { useRouter } from "next/router";

export default function UpdateProductPage() {
  const { query } = useRouter();
  const { data, isLoading: loading, error } = useProductQuery(
    query.id as string
  );
  const {
    data: attributeData,
    isLoading: attributeLoading,
    error: attributeError,
  } = useAttributesQuery();
  if (loading || attributeLoading) return <Loader />;
  if (error || attributeError) return <ErrorMessage message={error?.message} />;
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading dark:text-white">Editar Produto</h1>
      </div>
      <CreateOrUpdateProductForm
        initialValues={data}
        attributes={attributeData?.attributes}
      />
    </>
  );
}
UpdateProductPage.Layout = Layout;
