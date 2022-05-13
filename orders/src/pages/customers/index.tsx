import Card from "@components/common/card";
import Layout from "@components/common/layout";
import Search from "@components/common/search";
import CustomerList from "@components/customer/customer-list";
import LinkButton from "@components/ui/link-button";
import { useState } from "react";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useUsersQuery } from "@data/user/use-users.query";

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading: loading, error } = useUsersQuery({
    limit: 20,
    page,
    text: searchTerm,
  });

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;
  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }
  function handlePagination(current: any) {
    setPage(current);
  }
  return (
    <>
      <Card className="flex flex-col md:flex-row items-center mb-8">
        <div className="md:w-1/4 mb-4 md:mb-0">
          <h1 className="text-lg font-semibold text-heading dark:text-white">Utilizadores</h1>
        </div>

        <div className="w-full md:w-3/4 flex items-center ml-auto">
          <Search onSearch={handleSearch} />
          <LinkButton href="/customers/create" className="h-12 ml-4 md:ml-6">
            <span className="hidden md:block">+ Adicionar</span>
            <span className="md:hidden">+ Adicionar</span>
          </LinkButton>
        </div>
      </Card>

      {loading ? null : (
        <CustomerList customers={data?.users} onPagination={handlePagination} />
      )}
    </>
  );
}
Customers.Layout = Layout;
