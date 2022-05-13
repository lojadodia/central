import Card from "@components/common/card";
import Layout from "@components/common/layout";

import InvoiceList from "@components/invoice/invoice-list";
import ErrorMessage from "@components/ui/error-message";

import Loader from "@components/ui/loader/loader";
import { useInvoicesQuery } from "@data/invoice/use-invoices.query";
import { useState } from "react";
import LinkButton from "@components/ui/link-button";

export default function InvoicesPage() {
  const [searchTerm] = useState("");
  const { data, isLoading: loading, error } = useInvoicesQuery({
    text: searchTerm,
  });
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;
 

  return (
    <>
      <Card className="flex flex-col md:flex-row items-center mb-8">
        <div className="md:w-1/4">
          <h1 className="text-xl font-semibold text-heading dark:text-white">Faturas</h1>
        </div>
        <div className="w-full md:w-3/4 flex items-center ml-auto">

         
        </div>
      </Card>
      {!loading ? <InvoiceList invoices={data?.invoices} /> : null}
    </>
  );
}
InvoicesPage.Layout = Layout;
