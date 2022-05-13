import CategoryListPosition from "@components/category/category-list-position";
import Card from "@components/common/card";
import Layout from "@components/common/layout";
import Search from "@components/common/search";
import LinkButton from "@components/ui/link-button";
import { useState } from "react";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { OrderField } from "@ts-types/index";
import { SortOrder } from "@ts-types/generated";
import { useParentCategoriesQuery } from "@data/category/use-parent-categories.query";

export default function Categories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading: loading, error } = useParentCategoriesQuery({
    limit: 20,
    page,
    text: searchTerm,
    orderBy: OrderField.UpdatedAt,
    sortedBy: SortOrder.Desc,
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
          <h1 className="text-xl font-semibold text-heading dark:text-white">Ordenar Categorias</h1>
        </div>


      </Card>
      <CategoryListPosition
        categories={data?.categories}
        onPagination={handlePagination}
      />
    </>
  );
}
Categories.Layout = Layout;
