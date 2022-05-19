import { useEffect, useState } from "react";
import Layout from "@components/layout/layout";
import OrderCard from "@components/order/order-card";
import ErrorMessage from "@components/ui/error-message";
import OrderDetails from "@components/order/order-details";
import Collapse, { Panel } from "rc-collapse";
import "rc-collapse/assets/index.css";
import Spinner from "@components/ui/loaders/spinner/spinner";
import Scrollbar from "@components/ui/scrollbar";
import { useOrdersQuery } from "@data/order/use-orders.query";

interface Props {
  orders: any;
}

export default function OrdersPage({ orders }: Props) {
  const [order, setOrder] = useState<any>({});
  const { data, isLoading: loading, error } = useOrdersQuery();
  const data_orders = orders?.lenght ? orders : data?.orders?.data;
  if (loading) return <Spinner showText={false} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (

            <Collapse
              accordion={true}
              defaultActiveKey="active"
              expandIcon={() => null}
            >
              {data_orders?.length ? (
                data_orders?.map((_order: any, index: number) => (
                  <Panel
                    header={
                      <OrderCard
                        key={`mobile_${index}`}
                        order={_order}
                        onClick={() => setOrder(_order)}
                        isActive={order?.id === _order?.id}
                      />
                    }
                    headerClass="accordion-title"
                    key={index}
                    className="mb-1"
                  >
                    <OrderDetails order={order} />
                  </Panel>
                ))
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center py-10 my-auto">
                  <h4 className="text-sm font-semibold dark:text-neutral text-body text-center mt-22 pt-5">
                  Nenhum pedido realizado até então
                  </h4>
                </div>
              )}
            </Collapse>

  );
}

OrdersPage.Layout = Layout;
