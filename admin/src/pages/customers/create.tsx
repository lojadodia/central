import Layout from "@components/common/layout";
import CustomerCreateForm from "@components/customer/customer-form";

export default function CreateCustomerPage() {
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading">
        Criar Novo Utilizador
        </h1>
      </div>
      <CustomerCreateForm />
    </>
  );
}
CreateCustomerPage.Layout = Layout;
