import Layout from "@components/common/layout";
import CreateOrUpdateShippingForm from "@components/shipping/shipping-form";

export default function CreateShippingPage() {
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading">
          Criar Novo Envio
        </h1>
      </div>
      <CreateOrUpdateShippingForm />
    </>
  );
}
CreateShippingPage.Layout = Layout;
