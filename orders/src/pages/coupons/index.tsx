import Card from "@components/common/card";
import Layout from "@components/common/layout";
import Search from "@components/common/search";
import CouponList from "@components/coupon/coupon-list";
import LinkButton from "@components/ui/link-button";
import { useState } from "react";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useCouponsQuery } from "@data/coupon/use-coupons.query";

export default function Coupons() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading: loading, error } = useCouponsQuery({
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
  function handlePagination(current: number) {
    setPage(current);
  }
  return (
    <>
      <Card className="flex flex-col md:flex-row items-center mb-8">
        <div className="md:w-1/4 mb-4 md:mb-0">
          <h1 className="text-xl font-semibold text-heading dark:text-white">Coupons</h1>
        </div>
        <div className="w-full md:w-3/4 flex items-center ml-auto">
          <Search onSearch={handleSearch} />
          <LinkButton href="/coupons/create" className="h-12 ml-4 md:ml-6">
            <span className="hidden md:block">+ Adicionar cupom</span>
            <span className="md:hidden">+ Adicionar</span>
          </LinkButton>
        </div>
      </Card>
      <CouponList coupons={data?.coupons} onPagination={handlePagination} />
    </>
  );
}
Coupons.Layout = Layout;
