import Layout from "@components/common/layout";
import { useRouter } from "next/router";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import CreateOrUpdateAttributeForm from "@components/attribute/attribute-form";
import { useAttributeQuery } from "@data/attributes/use-attribute.query";

export default function UpdateAttributePage() {
  const router = useRouter();
  const { data, isLoading: loading, error } = useAttributeQuery(
    router.query.id as string
  );
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading dark:text-white">Editar Extra</h1>
      </div>
      <CreateOrUpdateAttributeForm initialValues={data?.attribute} />
    </>
  );
}
UpdateAttributePage.Layout = Layout;
