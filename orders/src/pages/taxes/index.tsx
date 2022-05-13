import Card from "@components/common/card";
import Layout from "@components/common/layout";
import Search from "@components/common/search";
import TaxList from "@components/tax/tax-list";
import ErrorMessage from "@components/ui/error-message";
import LinkButton from "@components/ui/link-button";
import Loader from "@components/ui/loader/loader";
import { useTaxesQuery } from "@data/tax/use-taxes.query";
import { useState } from "react";

export default function TaxesPage() {
  const [searchTerm, setSearch] = useState("");
  const { data, isLoading: loading, error } = useTaxesQuery({
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
          <h1 className="text-xl font-semibold text-heading dark:text-white">Taxas</h1>
        </div>

        <div className="w-full md:w-3/4 flex items-center ml-auto">
          <Search onSearch={handleSearch} />
          <LinkButton href="/taxes/create" className="h-12 ml-4 md:ml-6">
            <span className="hidden md:block">+ Adicionar Taxa</span>
            <span className="md:hidden">+ Adicionar</span>
          </LinkButton>
        </div>
      </Card>
      {!loading ? <TaxList taxes={data?.taxes} /> : null}
    </>
  );
}
TaxesPage.Layout = Layout;
