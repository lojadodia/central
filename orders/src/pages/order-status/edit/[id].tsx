import Layout from "@components/common/layout";
import CreateOrUpdateOrderStatusForm from "@components/order-status/order-status-form";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useOrderStatusQuery } from "@data/order-status/use-order-status.query";
import { useRouter } from "next/router";

export default function UpdateOrderStatusPage() {
  const { query } = useRouter();
  const { data, isLoading: loading, error } = useOrderStatusQuery(
    query.id as string
  );
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading dark:text-white">
        Editar status do pedido
        </h1>
      </div>
      <CreateOrUpdateOrderStatusForm initialValues={data} />
    </>
  );
}
UpdateOrderStatusPage.Layout = Layout;
