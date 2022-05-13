import Layout from "@components/common/layout";
import { useRouter } from "next/router";
import CreateOrUpdateTypeForm from "@components/type/type-form";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useTypeQuery } from "@data/type/use-type.query";

export default function UpdateTypePage() {
  const { query } = useRouter();
  const { data, isLoading: loading, error } = useTypeQuery(query?.id as string);
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading dark:text-white">Editar Tipo</h1>
      </div>
      <CreateOrUpdateTypeForm initialValues={data} />
    </>
  );
}
UpdateTypePage.Layout = Layout;
