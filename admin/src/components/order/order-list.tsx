import Pagination from "@components/ui/pagination";
import dayjs from "dayjs";
require('dayjs/locale/pt')
import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import usePrice from "@utils/use-price";
import { formatAddress } from "@utils/format-address";
import { ROUTES } from "@utils/routes";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Image from "next/image";
import { siteSettings } from "@settings/site.settings";
import {
  Order,
  OrderPaginator,
  OrderStatus,
  UserAddress,
} from "@ts-types/generated";
import InvoicePdf from "./invoice-pdf";
import { PDFViewer } from "@react-pdf/renderer";
import moment from 'moment';

const columns = [
  {
    title: "REF",
    dataIndex: "tracking_number",
    key: "tracking_number",
    align: "left",
    width: 120,
    render: (tracking_number: string) => (
      <span className="uppercase ">#{tracking_number?.slice(-5)}</span>
    ),
  },
  
  {
    title: "Data Ent/L",
    dataIndex: "delivery_time",
    key: "delivery_time", 
    align: "center",
    
    render: (delivery_time: string, { delivery_hour }: any) => {
      dayjs.extend(relativeTime);
      dayjs.extend(utc);
      dayjs.extend(timezone);
      return (
        <span className="whitespace-nowrap">
          {/* {dayjs.utc(date).tz(dayjs.tz.guess()).locale('pt').fromNow()} */}
          {dayjs(moment(delivery_time+" "+delivery_hour,'YYYY-MM-DD HH:mm:ss HH:mm').toDate()).format('HH:mm DD/MM')}
        </span>
      );
    },
  },
  {
    title: "Cliente",
    dataIndex: "customer",
    key: "customer",
    align: "left",
    width: 150,
    render: (customer: any) => customer?.name && (
          <span>{customer?.name}</span>
      )
      
      
  },
  {
      title: "Estafeta",
      dataIndex: "shipping_info",
      key: "shipping_info",
      align: "left",
      render: (shipping_info: any) => shipping_info?.courier?.name && (
          <>
       {shipping_info?.courier?.name}
        
          </>
        )
        
        
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      align: "left",
      width: 150,
      render: (status: OrderStatus, { cancelled_at }: any) => (
        <span
          className="whitespace-nowrap font-semibold"
          style={{ color: !!!cancelled_at ? status?.color! : '#ef4444' }}
        >
          { !!!cancelled_at ? status?.name.substr(0, 10) : 'CANCELADO'}
        </span>
      ),
    },
  {
    title: "Endereço",
    dataIndex: "billing_address",
    key: "billing_address",
    align: "left",
    render: (billing_address: UserAddress, { order_type }: any) => (
      order_type === 'delivery' ? <div>{billing_address?.street_address} </div> : 
      <span className="uppercase">{order_type}</span>
    ),
  },
  
  //{
    //   title: "Documento",
    //   dataIndex: "id",
    //   key: "download",
    //   align: "center",
    //   render: (id: string) => (
    //     <a href={`${ROUTES.ORDERS}/pdf/${id}`}>
    //       VER PDF
    //     </a>
       
    //   ),
    // },
  // {
  //   title: "Entrega",
  //   dataIndex: "delivery_fee",
  //   key: "delivery_fee",
  //   align: "center",
  //   render: (value: any) => {
  //     const delivery_fee = value ? value : 0;
  //     const { price } = usePrice({
  //       amount: delivery_fee,
  //     });
  //     return <span>{price}</span>;
  //   },
  // },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    align: "center",
    width: 120,
    render: (value: any) => {
      const { price } = usePrice({
        amount: Number(value),
      });
      return <span className="whitespace-nowrap">{price}</span>;
    },
  },
  {
    title: "Ações",
    dataIndex: "id",
    key: "actions",
    align: "center",
    width: 100,
    render: (id: string) => (
      <a href={`${ROUTES.ORDERS}/details/${id}`}  className="inline-flex items-center justify-center flex-shrink-0 font-semibold leading-none rounded outline-none transition duration-300 ease-in-out focus:outline-none focus:shadow bg-primary text-white border border-transparent hover:bg-primary-2 px-2 py-2 ">
        Gerir
      </a>
      // <ActionButtons
      //   id={id}
      //   deleteButton={false}
      //   editButtonText="Details"
      //   navigationPath={`${ROUTES.ORDERS}/details/${id}`}
      //   modalActionType="DELETE_ORDER"
      // />
      
    ),
  },
];

type IProps = {
  orders: OrderPaginator | null | undefined;
  onPagination: (current: number) => void;
};

const OrderList = ({ orders, onPagination }: IProps) => {
  const { data, paginatorInfo } = orders!;

  return (
    <>
      <div className="rounded overflow-hidden shadow mb-6">
        <Table
          //@ts-ignore
          columns={columns}
          data={data}
          rowKey="id"
          scroll={{ x: 1000 }}
        />
      </div>

      {!!paginatorInfo.total && (
        <div className="flex justify-end items-center">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default OrderList;
