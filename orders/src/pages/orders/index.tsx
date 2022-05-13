
import Layout from "@components/common/layout";
import OrderList from "@components/order/order-list";
import { useEffect, useState } from "react";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useOrdersQuery } from "@data/order/use-orders.query";
import { useUI } from "@contexts/ui.context";

export default function Orders() {
  const { displayModal } = useUI();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading: loading, error } = useOrdersQuery({
    limit: 50,
    page,
    text: "",
    updated: searchTerm
  });
  
  useEffect(() => {
    if(!displayModal) {
      setSearchTerm(Date.now().toString())
    }

  }, [displayModal])
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  function handlePagination(current: any) {
    setPage(current);
  }
  return (
    <>
      <OrderList  orders={data?.orders} onPagination={handlePagination} />
    </>
  );
}
Orders.Layout = Layout;
