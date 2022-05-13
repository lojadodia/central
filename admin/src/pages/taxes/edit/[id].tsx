import Layout from "@components/common/layout";
import { useRouter } from "next/router";
import CreateOrUpdateTaxForm from "@components/tax/tax-form";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useTaxQuery } from "@data/tax/use-tax.query";

export default function UpdateTaxPage() {
  const { query } = useRouter();
  const { data, isLoading: loading, error } = useTaxQuery(query.id as string);
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading">
        Atualizar imposto #{data?.id}
        </h1>
      </div>
      <CreateOrUpdateTaxForm initialValues={data} />
    </>
  );
}
UpdateTaxPage.Layout = Layout;
