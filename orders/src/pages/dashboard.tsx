import Layout from "@components/common/layout";
import { CartIconBig } from "@components/icons/cart-icon-bag";
import { CoinIcon } from "@components/icons/coin-icon";
import { UserIcon } from "@components/icons/user-icon";
import ColumnChart from "@components/widgets/column-chart";
import StickerCard from "@components/widgets/sticker-card";
import ErrorMessage from "@components/ui/error-message";
import usePrice from "@utils/use-price";
import Loader from "@components/ui/loader/loader";
import RecentOrders from "@components/order/recent-orders";
import PopularProductList from "@components/product/popular-product-list";
import { useOrdersQuery } from "@data/order/use-orders.query";
import { usePopularProductsQuery } from "@data/analytics/use-popular-products.query";
import { useAnalyticsQuery } from "@data/analytics/use-analytics.query";
import { useMeQuery } from "@data/user/use-me.query";
import { useSettings } from "@contexts/settings.context";

export default function Dashboard() {
  const { data, isLoading: loading } = useAnalyticsQuery();
  const { price: total_revenue } = usePrice(
    data && {
      amount: data?.totalRevenue!,
    }
  );
  const { price: todays_revenue } = usePrice(
    data && {
      amount: data?.todaysRevenue!,
    }
  );

  const user : any  = useMeQuery();
  const permission = user['data']?.permission;
  const settings = useSettings();

  const {
    data: orderData,
    isLoading: orderLoading,
    error: orderError,
  } = useOrdersQuery({
    limit: 10,
    page: 1,
  });
  const {
    data: popularProductData,
    isLoading: popularProductLoading,
    error: popularProductError,
  } = usePopularProductsQuery({ limit: 10 });

  if (loading || orderLoading || popularProductLoading) return <Loader />;
  if (orderError || popularProductError)
    return (
      <ErrorMessage
        message={orderError?.message || popularProductError?.message}
      />
    );
  let salesByYear: number[] = Array.from({ length: 12 }, (_) => 0);
  if (!!data?.totalYearSaleByMonth?.length) {
    salesByYear = data.totalYearSaleByMonth.map((item: any) =>
      item.total.toFixed(2)
    );
  }
  return (
    <>
      <div className="w-full flex flex-wrap mb-6">
      {(permission == "super_admin" || permission == "admin" || permission == "billing") && (
        <div className="w-full sm:w-2/4 xl:w-1/4 sm:px-3 sm:pl-0 mb-6 xl:mb-0">
          <StickerCard
            title="Total Receita"
            subtitle="(Saldo Acumulado)"
            icon={<CoinIcon />}
            price={total_revenue}
          />
        </div>
      )}
      {(permission == "super_admin" || permission == "admin" || permission == "billing" || permission == "billing") && (
        <div className="w-full sm:w-2/4 xl:w-1/4 sm:px-3 sm:pr-0 xl:pr-3 mb-6 xl:mb-0">
          <StickerCard
            title="Total Pedidos"
            subtitle="(Pedidos Acumulados)"
            icon={<CartIconBig />}
            price={data?.totalOrders} 
          />
        </div>
        )}
        {(permission == "super_admin" || permission == "admin" || permission == "billing" || permission == "logistics") && (
        <div className="w-full sm:w-2/4 xl:w-1/4 sm:px-3 sm:pl-0 xl:pl-3 mb-6 xl:mb-0">
          <StickerCard
            title="Novo Cliente"
            subtitle="(Últimos 30 dias)"
            icon={<UserIcon />}
            price={data?.newCustomers}
          />
        </div>
        )}


        {(permission == "super_admin" || permission == "admin" || permission == "billing") && (
        <div className="w-full sm:w-2/4 xl:w-1/4 sm:px-3 sm:pr-0 xl:pl-3 mb-6 xl:mb-0">
          <StickerCard
            title="Receita Hoje"
            icon={<CoinIcon />}
            price={todays_revenue}
          />
        </div>
        )}
      </div>
      {(permission == "super_admin" || permission == "admin" || permission == "billing") && (
        <div className="w-full flex shadow flex-wrap mb-6">
          <ColumnChart
            widgetTitle="Histórico de Vendas"
            colors={[settings?.site?.color]}
            series={salesByYear}
            categories={[
              "Janeiro",
              "Fevereiro",
              "Março",
              "Abril",
              "Maio",
              "Junho",
              "Julho",
              "Agosto",
              "Setembro",
              "Outubro",
              "Novembro",
              "Dezembro",
            ]}
          />
        </div>
      )}
    
      <div className="w-full flex flex-wrap mb-6">
      {(permission == "super_admin" || permission == "admin" || permission == "billing") && (
        <div className="w-full sm:w-1/2 xl:w-1/2 sm:px-3 sm:pl-0 mb-6 xl:mb-0">
          <RecentOrders
            orders={orderData?.orders?.data}
            title="Pedidos Recentes"
          />
        </div>
         )}
        {(permission == "super_admin" || permission == "admin" || permission == "stock") && (
        <div className="w-full sm:w-1/2 xl:w-1/2 sm:px-3 sm:pr-0 mb-6 xl:mb-0">
          <PopularProductList
            products={popularProductData}
            title="Produtos Populares"
          />
        </div>
         )}
      </div>
     
    </>
  );
}
Dashboard.Layout = Layout;
