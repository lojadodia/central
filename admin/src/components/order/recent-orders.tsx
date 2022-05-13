import dayjs from "dayjs";
import { Table } from "@components/ui/table";
import usePrice from "@utils/use-price";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Order, OrderStatus } from "@ts-types/generated";

const columns = [
  {
    title: "Código de rastreio",
    dataIndex: "tracking_number",
    key: "tracking_number",
    align: "center",
    width: 150,
    render: (tracking_number: string) => (
      <span className="uppercase ">#{tracking_number?.slice(-5)}</span>
    ),
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    align: "center",
    render: (value: any) => {
      const { price } = usePrice({
        amount: value,
      });
      return <span className="whitespace-nowrap">{price}</span>;
    },
  },
  {
    title: "Data do Pedido",
    dataIndex: "created_at",
    key: "created_at",
    align: "center",
    render: (date: string) => {
      dayjs.extend(relativeTime);
      dayjs.extend(utc);
      dayjs.extend(timezone);
      return (
        <span className="whitespace-nowrap">
          {dayjs.utc(date).tz(dayjs.tz.guess()).fromNow()}
        </span>
      );
    },
  },
  {
    title: "Estado",
    dataIndex: "status",
    key: "status",
    align: "center",
    render: (status: OrderStatus) => (
      <span
        className="whitespace-nowrap font-semibold"
        style={{ color: status?.color! }}
      >
        {status?.name}
      </span>
    ),
  },
];

type IProps = {
  orders: Order[];
  title?: string;
};

const RecentOrders = ({ orders, title }: IProps) => {
  return (
    <>
      <div className="rounded overflow-hidden shadow mb-6">
        <h3 className="text-heading text-center font-semibold px-4 py-3 bg-white border-b border-gray-200">
          {title}
        </h3>
        <Table
          //@ts-ignore
          columns={columns}
          data={orders}
          rowKey="id"
          scroll={{ x: 700 }}
        />
      </div>
    </>
  );
};

export default RecentOrders;
