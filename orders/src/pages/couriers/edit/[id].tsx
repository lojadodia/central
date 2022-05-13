import Layout from "@components/common/layout";
import { useRouter } from "next/router";
import CreateOrUpdateCourierForm from "@components/courier/courier-form";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useCourierQuery } from "@data/courier/use-courier.query";

export default function UpdateCourierPage() {
  const { query } = useRouter();
  const { data, isLoading: loading, error } = useCourierQuery(query?.id as string);
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading dark:text-white">Editar Estafeta</h1>
      </div>
      <CreateOrUpdateCourierForm initialValues={data} />
    </>
  );
}
UpdateCourierPage.Layout = Layout;
