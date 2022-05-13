import Card from "@components/common/card";
import Layout from "@components/common/layout";
import Search from "@components/common/search";
import FaqList from "@components/faq/faq-list";
import ErrorMessage from "@components/ui/error-message";
import LinkButton from "@components/ui/link-button";
import Loader from "@components/ui/loader/loader";
import { OrderField } from "@ts-types/index";
import { SortOrder } from "@ts-types/generated";
import { useState } from "react";
import { useFaqsQuery } from "@data/faq/use-faqs.query";

export default function FaqsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading: loading, error } = useFaqsQuery({
    text: searchTerm,
    orderBy: OrderField.UpdatedAt,
    sortedBy: SortOrder.Desc,
  });

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;
  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }

  return (
    <>
      <Card className="flex flex-col md:flex-row items-center mb-8">
        <div className="md:w-1/4 mb-4 md:mb-0">
          <h1 className="text-xl font-semibold text-heading dark:text-white">Perguntas Frequentes</h1>
        </div>

        <div className="w-full md:w-3/4 flex items-center ml-auto">
          <Search onSearch={handleSearch} />

          <LinkButton href="/faqs/create" className="h-12 ml-4 md:ml-6">
            <span className="hidden md:block">+ Adicionar FAQs</span>
            <span className="md:hidden">+ Adicionar</span>
          </LinkButton>
        </div>
      </Card>
      <FaqList faqs={data?.faqs} />
    </>
  );
}

FaqsPage.Layout = Layout;
