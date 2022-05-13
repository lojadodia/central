import Pagination from "@components/ui/pagination";
import dayjs from "dayjs";
require('dayjs/locale/pt')
//import { Table } from "@components/ui/table";
//import ActionButtons from "@components/common/action-buttons";
//import usePrice from "@utils/use-price";
//import { formatAddress } from "@utils/format-address";
//import { ROUTES } from "@utils/routes";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useOrdersQuery } from "@data/order/use-orders.query";
//import Image from "next/image";
//import { siteSettings } from "@settings/site.settings";
import {
//  Order,
  OrderPaginator,
  OrderStatus,
  UserAddress,
} from "@ts-types/generated";
//import InvoicePdf from "./invoice-pdf";
//import { PDFViewer } from "@react-pdf/renderer";
import moment from 'moment';
import Color from "color";
import { useUI } from "@contexts/ui.context";
import { RiShoppingBagFill, RiMotorbikeFill, RiUserFill } from "react-icons/ri";
import { useEffect, useState, useRef } from "react";

const columns = [
  {
    title: "Estado",
    dataIndex: "status",
    key: "status",
    align: "left",
    width: 150,
    render: (status: OrderStatus, { cancelled_at, tracking_number }: any) => (
      <>
       <span
        className="whitespace-nowrap font-semibold"
        style={{ color: !!!cancelled_at ? status?.color! : '#ef4444' }}
      >
        { !!!cancelled_at ? status?.name.substr(0, 10) : 'CANCELADO'}
      </span> <br />
      <span className="uppercase ">#{tracking_number?.slice(-5)}</span>
      </>
     
    ),
  },
  {
    title: "Hora",
    dataIndex: "delivery_time",
    key: "delivery_time", 
    align: "left",
    render: (delivery_time: string, { customer, customer_contact, delivery_hour }: any) => {
      dayjs.extend(relativeTime);
      dayjs.extend(utc);
      dayjs.extend(timezone);
      return (
        <>
          <span className="whitespace-nowrap">
            {/* {dayjs.utc(date).tz(dayjs.tz.guess()).locale('pt').fromNow()} */}
            {dayjs(moment(delivery_time+" "+delivery_hour,'YYYY-MM-DD HH:mm:ss HH:mm').toDate()).format('HH:mm DD/MM')}
          </span> <br />
          <span><b>{customer?.name.replace(/ .*/,'')}</b> {(customer?.name && customer_contact) && (" - ")} {customer_contact && (<>{customer_contact}</>)}</span>
        </>
      );
    },
  },
  {
    title: "Hora",
    dataIndex: "delivery_time",
    key: "delivery_time", 
    align: "left",
    render: (delivery_time: string, { customer, customer_contact, delivery_hour }: any) => {
      dayjs.extend(relativeTime);
      dayjs.extend(utc);
      dayjs.extend(timezone);
      return (
        <>
          <span className="whitespace-nowrap">
            {/* {dayjs.utc(date).tz(dayjs.tz.guess()).locale('pt').fromNow()} */}
            {dayjs(moment(delivery_time+" "+delivery_hour,'YYYY-MM-DD HH:mm:ss HH:mm').toDate()).format('HH:mm DD/MM')}
          </span> <br />
          <span><b>{customer?.name.replace(/ .*/,'')}</b> {(customer?.name && customer_contact) && (" - ")} {customer_contact && (<>{customer_contact}</>)}</span>
        </>
      );
    },
  },
  {
    title: "Entrega",
    dataIndex: "billing_address",
    key: "billing_address",
    align: "left",
    render: (billing_address: UserAddress, { order_type, shipping_info }: any) => (
    
    <div>



{ order_type === 'delivery' ? 
       
       <div>{billing_address?.street_address} </div> : (<>
        <div>
         <span className="uppercase">{order_type}</span> <br />
     </div> <br />
     </> 
         
         )}

         {shipping_info?.courier?.name}
    </div>
     
        
    ),
  },
 
];

type IProps = {
  orders: OrderPaginator | null | undefined;
  onPagination: (current: number) => void;
};



const OrderList = ({ orders, onPagination }: IProps) => {

  const { data, paginatorInfo } = orders!;

  const { openModal, setModalData, setModalView, modalData, displayModal } = useUI();
  const [timeIntervale, setTimeInterval] = useState<number>(1000)
  const [animated, setAnimationd] = useState(false)
  useOrdersQuery({
    limit: 50,
    page: 1,
    text: "",
  });
  const audioRef = useRef<HTMLAudioElement>(new Audio("/audio/alarm.mp3"))
  function handleOrder(id:string|{id: string, status: string}) {
    setModalView("ORDER_DETAILS");
    setModalData(id);
    return openModal();
  }

  useEffect(() => {
    const ctr = new AbortController()
    const signal = ctr.signal
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.remove()
    }
    audioRef.current.loop = true;
    audioRef.current.id = "audio_alarm_task"
    if (!displayModal) setAnimationd(false)
   // if (!displayModal) return
    const timeId = setInterval(async () => {
      try {
        const request = await fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}app/v1/orders?key=6cee5c6343776604b7fe209b28b`, {signal})
        const data = await request.json()
        if (data.message == "order_not_found") {
          throw new Error("not found resource")
        }
        clearInterval(timeId)
        handleOrder({id: data.id, status: 'api'})
        // /audio/alarm.mp3
        setAnimationd(true)
 
        audioRef.current.play(); 
      } catch(err: any) {
        setAnimationd(false)
      } finally {
        setTimeInterval(30000)
      }
      
    }, timeIntervale)

    return () => {
      ctr.abort()
      clearInterval(timeId)
      
    }
  }, [displayModal])


  return (
    <>
      <div className={"rounded shadow mb-6 w-full flex flex-wrap ".concat(animated ? "alarm-animation": "")}>

      {data?.map((order: any, index: number) => {
        const color = !order?.cancelled_at ? order?.status?.color : "#ef4444";
        return (
          <a key={index} onClick={() => handleOrder({id: order?.id, status: 'list'})} className="w-full xl:w-1/3 p-1">
          <div className="block p-4 bg-white rounded-lg border border-gray-200 dark:border-neutral-600 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700" style={{background:Color(color).darken(0.7),borderColor:Color(color).darken(0.4)}}>
            <p className="mb-2 font-bold tracking-tight text-gray-900 dark:text-white">
              <span className="rounded px-2 py-1" style={{background:color}} >{order?.tracking_number?.slice(-5)} - {!order?.cancelled_at ? order?.status?.name : "CANCELADO"}</span> 
             
              <span className="rounded px-2 py-1 ml-3 font-normal float-right text-sm" style={{opacity:"0.8",border:`${ order?.order_type === 'delivery' ? "dashed" : "dashed"}`,borderColor:"white"}} >
                  <i>{ order?.order_type === 'delivery' ? <RiMotorbikeFill className="inline-block text-xl" style={{marginTop:"-3px"}}/> : <RiShoppingBagFill className="inline-block text-xl" style={{marginTop:"-3px"}}/>} </i><b>{dayjs(moment(order?.delivery_time+" "+order?.delivery_hour,'YYYY-MM-DD HH:mm:ss HH:mm').toDate()).format('DD/MM HH:mm')}</b> 
              </span> </p>  
              <p className="float-right mt-2 uppercase"> {order?.shipping_info?.courier?.name && <p className="font-normal text-gray-700 dark:text-white  text-sm mb-2"> <span className="rounded mt-2 px-2 py-1" style={{background:Color(color).darken(0.6)}} ><RiUserFill className="inline-block " style={{marginTop:"-3px"}}/> {order?.shipping_info?.courier?.name}</span> </p>}</p>
            
            <p className="font-normal text-gray-700 mb-0 dark:text-gray"><b className="uppercase">{order?.customer?.name.replace(/ .*/,'')}</b> {(order?.customer?.name && order?.customer_contact) && (" - ")} {order?.customer_contact && (<>{order?.customer_contact}</>)}
            { order?.order_type === 'delivery' && <span> - {order?.billing_address?.street_address} {order?.billing_address?.door},  {order?.billing_address?.zip},  {order?.billing_address?.city}</span> }
            </p>

            <p className="font-normal text-gray-700 dark:text-gray hidden text-xs">{dayjs(moment(order?.delivery_time+" "+order?.delivery_hour,'YYYY-MM-DD HH:mm:ss HH:mm').toDate()).format('DD/MM/YYYY HH:mm')}</p>
        </div>
        </a>
  )})}
       {/*

   <Table
          //@ts-ignore
          columns={columns}
          data={data}
          rowKey="id"
          scroll={{ x: 1000 }}
        />
       */}   
     
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
