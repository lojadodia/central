import Card from "@components/common/card";
import Layout from "@components/common/layout";
import ShippingList from "@components/shipping/shipping-list";
import Search from "@components/common/search";

import LinkButton from "@components/ui/link-button";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useState } from "react";
import { useShippingClassesQuery } from "@data/shipping/use-shippingClasses.query";

export default function ShippingsPage() {
  const [searchTerm, setSearch] = useState("");
  const { data, isLoading: loading, error } = useShippingClassesQuery({
    text: searchTerm,
  });
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearch(searchText);
  }
  return (
    <>
      <Card className="flex flex-col md:flex-row items-center mb-8">
        <div className="md:w-1/4 mb-4 md:mb-0">
          <h1 className="text-xl font-semibold text-heading dark:text-white">Taxa de Entrega</h1>
        </div>

        <div className="w-full md:w-3/4 flex items-center ml-auto">
          <Search onSearch={handleSearch} />
          <LinkButton href="/shippings/create" className="h-12 ml-4 md:ml-6">
            <span className="hidden md:block">+ Adicionar Taxa</span>
            <span className="md:hidden">+ Adicionar</span>
          </LinkButton>
        </div>
      </Card>
      <ShippingList shippings={data?.shippingClasses} />
    </>
  );
}
ShippingsPage.Layout = Layout;
