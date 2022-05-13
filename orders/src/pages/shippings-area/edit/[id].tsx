import Layout from "@components/common/layout";
import { useRouter } from "next/router";
import CreateOrUpdateShippingForm from "@components/shipping/shipping-form";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useShippingQuery } from "@data/shipping/use-shipping.query";

export default function UpdateShippingPage() {
  const { query } = useRouter();
  const { data, isLoading: loading, error } = useShippingQuery(
    query.id as string
  );
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading dark:text-white">
        Envio de atualização #{data?.id}
        </h1>
      </div>
      <CreateOrUpdateShippingForm initialValues={data} />
    </>
  );
}
UpdateShippingPage.Layout = Layout;
