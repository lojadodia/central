import usePrice from "@utils/use-price";
import dayjs from "dayjs";
import cn from "classnames";
import Color from "color";

type OrderCardProps = {
  order: any;
  isActive: boolean;
  onClick?: (e: any) => void;
}; 

const OrderCard: React.FC<OrderCardProps> = ({ onClick, order, isActive }) => {
  const { id, status, created_at, delivery_time , delivery_hour } = order;
  const { price: amount } = usePrice({
    amount: order?.amount,
  });
  const { price: total } = usePrice({
    amount: order?.total,
  });
  const color = !order?.cancelled_at ? order?.status?.color : "#ef4444";
  return (
    <div
      onClick={onClick}
      role="button"
      className={cn(
        "  rounded overflow-hidden w-full flex flex-shrink-0 flex-col mb-2 border-2 border-transparent cursor-pointer last:mb-0",
        isActive === true && "border-primary"
      )}
      style={{background:Color(color).darken(0.7),borderColor:Color(color).darken(0.4)}}
    >
      <div className="flex justify-between items-center border-b dark:border-neutral-700 border-gray-200 py-1 px-2 md:px-2 lg:px-2" style={{borderColor:Color(color).darken(0.4)}}>
        <span className="font-bold text-base md:text-sm lg:text-base text-heading mr-4 flex-shrink-0 dark:text-white">
        {order?.id} -
          <span className="font-normal"> #{order?.tracking_number?.slice(-5)}</span>
        </span>
        {!order?.cancelled_at ? <>
        <span
          className="text-sm text-blue-500 bg-blue-100 px-3 py-1 rounded whitespace-nowrap truncate max-w-full"
          title={status.name}
        >
          {status.name}
        </span>
        </> :
              <>
               <span
          className="text-sm text-red-500 bg-red-100 px-3 py-1 rounded whitespace-nowrap truncate max-w-full"
          title="PEDIDO CANCELADO"
        >
          CANCELADO
        </span>
              </>
            }
      </div>

      <div className="flex flex-col p-2 md:p-2 lg:px-2 lg:py-2">
        {/* <p className="text-base sm:text-sm text-heading w-full flex justify-between items-center mb-4 last:mb-0">
          <span className="w-24 overflow-hidden flex-shrink-0">Data</span>
          <span className="mr-auto">:</span>
          <span className="ml-1">
            {dayjs(created_at).format("DD-MM-YYYY")}
          </span>
        </p> */}
        <p className="text-base sm:text-sm text-heading dark:text-neutral w-full flex justify-between items-center mb-2 last:mb-0">
          <span className="w- overflow-hidden flex-shrink-0 uppercase text-heading dark:text-white">
          {order?.customer?.name} - {order?.customer_contact}
          </span>
          <span className="mr-auto"></span>
          <span className="ml-1 truncate">{dayjs(dayjs(delivery_time,'YYYY-MM-DD HH:mm:ss')).format('DD/MM/YYYY')} {delivery_hour}</span>
        </p>

        <p className="text-base sm:text-sm font-bold text-heading dark:text-white w-full flex justify-between items-center mb-2 last:mb-0">
          <span className="w- overflow-hidden flex-shrink-0">
         Total
          </span>
          <span className="mr-auto"></span>
          <span className="ml-1">{total}</span>
        </p>
      </div>
    </div>
  );
};

export default OrderCard;
