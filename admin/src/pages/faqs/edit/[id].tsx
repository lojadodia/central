import Layout from "@components/common/layout";
import { useRouter } from "next/router";
import CreateOrUpdateFaqForm from "@components/faq/faq-form";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useFaqQuery } from "@data/faq/use-faq.query";

export default function UpdateFaqPage() {
  const { query } = useRouter();
  const { data, isLoading: loading, error } = useFaqQuery(query?.id as string);
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading">Editar FAQ</h1>
      </div>
      <CreateOrUpdateFaqForm initialValues={data} />
    </>
  );
}
UpdateFaqPage.Layout = Layout;
