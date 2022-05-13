import Layout from "@components/common/layout";
import { useRouter } from "next/router";
import Loader from "@components/ui/loader/loader";
import ErrorMessage from "@components/ui/error-message";
import CreateOrUpdateAttributeValueForm from "@components/attribute-values/attribute-values-form";
import { useAttributeValueQuery } from "@data/attribute-value/use-attribute-value.query";

export default function CreateAttributeValuePage() {
  const router = useRouter();
  const { data, isLoading: loading, error } = useAttributeValueQuery(
    router.query.id as string
  );
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading dark:text-white">
        Atualizar Opção de Extra
        </h1>
      </div>
      <CreateOrUpdateAttributeValueForm initialValues={data?.attributeValue} />
    </>
  );
}
CreateAttributeValuePage.Layout = Layout;
