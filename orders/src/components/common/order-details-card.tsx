
//import CourierList from "@components/courier/courier-list";
//import ErrorMessage from "@components/ui/error-message";
import { Table } from "@components/ui/table";
//import Loader from "@components/ui/loader/loader";
//import { OrderField } from "@ts-types/index";
import dayjs from "dayjs";
require('dayjs/locale/pt');
import moment from 'moment';
//import { SortOrder } from "@ts-types/generated";
import { useState } from "react";
//import { useCouriersQuery } from "@data/courier/use-couriers.query";
//import ActionButtons from "@components/common/action-buttons";
import usePrice from "@utils/use-price";
import Button from "@components/ui/button";
//import { ROUTES } from "@utils/routes";
//import { useOrdersQuery } from "@data/order/use-orders.query";
import Image from "next/image";
import { useUI } from "@contexts/ui.context";
import { siteSettings } from "@settings/site.settings";
import { toast } from "react-toastify";
import { useOrderQuery } from "@data/order/use-order.query";
import Color from "color";
import { Attachment } from "@ts-types/generated";
import { formatAddress } from "@utils/format-address";
import { RiShoppingBagFill, RiSendPlane2Fill, RiMenuFill, RiCloseLine, RiMotorbikeFill, RiCloseCircleLine, RiTimeLine, RiTimeFill } from "react-icons/ri";
import http from '@utils/api/http'
import { API_ENDPOINTS } from "@utils/api/endpoints";

const OrderDetailsCard = ({ couriers }: IProps) => {

  const columns = [
    {
      dataIndex: "image",
      key: "image",
      width: 70,
      render: (image: Attachment) => (
        <Image
          src={image?.thumbnail ?? siteSettings.product.placeholder}
          alt="alt text"
          layout="fixed"
          width={50}
          height={50}
        />
      ),
    },
    {
      title: "Produtos",
      dataIndex: "name",
      key: "name",
      align: "left",
      render: (name: string, item: any) => {
        let extras: any = null;
        let variations: any = null
        try {
          extras = JSON.parse(item.pivot.extras);
          const { data: { variation_options: { paginatorInfo } } } =
            useOrderVariationQuery({ id: item.pivot.variation_option_id })
          if (paginatorInfo) {
            variations = paginatorInfo
          }
        }
        catch (e) {
        }
        return (
          <div>
            <span className="dark:text-white">{name}</span>
            <span className="mx-2">x</span>
            <span className="font-semibold text-heading  dark:text-white">
              {item.pivot.order_quantity}
            </span>
            {!!variations && <><p className="text-xs mt-1 text-body dark:text-gray"><b>Variações</b></p>
              <ul className="mb-1">
                {Object.keys(variations).map((key: string) => (
                  <li key={key}>{variations[key].name}</li>
                ))}
              </ul>
            </>}
            {!!(extras && extras.length) && <p className="text-xs text-body dark:text-gray"><b>Extras</b> <br />
              {Object.keys(extras).map((key) => {
                const extra = extras[key]
                const { price } = usePrice({
                  amount: +extra.sync_price
                })
                return <span className='block' key={key} >{extra.value} ({price})&nbsp;</span>
              })}
            </p>}
            {item?.pivot?.obs && (
              <>
                <span className="text-sm  mt-2 block text-body dark:text-gray">
                  <i>{'Obs: ' + item?.pivot?.obs}</i>
                </span>
              </>
            )}
          </div>
        )
  
      },
    },
    {
      title: "Total",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (_: any, item: any) => {
        const { price } = usePrice({
          amount: parseFloat(item.pivot.subtotal),
        });
        return <span className=" dark:text-gray">{price}</span>;
      },
    },
  ];
  const { openModal, setModalData, setModalView, modalData, closeModal } = useUI();
  const { data } = useOrderQuery(modalData.id as string);
 
  function onLinkClick(e:any) {
    e.preventDefault();
    // further processing happens here
  }

  async function handleCourier(id:any) {
    closeModal();
    setModalView('CALL_COURIER');
    setModalData(id)
    return openModal();
  }

  const [products, setProduct] = useState([]);
 
  async function toggleProducts() {
    if(products == "show"){
      setProduct("hide");
    }else{
      setProduct("show");
    }
  }    


  async function handleModalMenuOrder() {
    closeModal();
    setModalView('MENU_ORDER');
    setModalData(data?.order)
    return openModal();

  }

  async function handleModalUpdateTime() {
    closeModal();
    setModalView('UPDATE_TIME');
    setModalData(data?.order?.tracking_number)
    return openModal();

  }


  async function handleOrderStatus(status:any) {

    http.post(API_ENDPOINTS.APP_ORDER_STATUS, {
      key: 'ocee5c6349776304b7fe209b29t',
      order: data?.order?.id,
      status: status

    }).then(({ data }) => {
      if(data?.message == "order_status_updated"){
        //toast.info("Estado Atualizado!");
      }else{
        toast.error("Ocorreu um erro");
      }
    })
    onLinkClick
    closeModal();

  }

  const color = !data?.order?.cancelled_at ? data?.order?.status?.color : "#ef4444";
  return (
    <div className="bg-white dark:bg-neutral-900  border rounded-lg" style={{background:Color(color).darken(0.7),borderColor:Color(color).darken(0.4)}}>
      <div className="w-full h-full text-center">
        <div className=" h-full flex-col justify-between">
     
           
        <div className=" overflow-hidden ">
          {/* @ts-ignore */}
          <div className=" overflow-hidden shadow" >
<div className="flex px-5 relative py-4 border-b" style={{borderColor:Color(color).darken(0.4)}}>

    <div className="rounded-lg font-semibold px-4 mr-3 py-3 text-xl" style={{background:color}} >  {data?.order?.order_type == "delivery" ? ( <RiMotorbikeFill className="inline-block text-xl" style={{marginTop:"-3px"}}/>) :  (<RiShoppingBagFill className="inline-block text-xl" style={{marginTop:"-3px"}}/>)}
    &nbsp; {data?.order?.tracking_number?.slice(-5)} - {!data?.order?.cancelled_at ? data?.order?.status?.name: "CANCELADO"}</div>
      <div className="rounded px-5  text-xl py-3">
          <RiTimeFill className="inline-block" style={{marginTop:"-3px"}}/> &nbsp;
          <span className="hidden md:inline">  {dayjs(moment(data?.order?.delivery_time+" "+data?.order?.delivery_hour,'YYYY-MM-DD HH:mm:ss HH:mm').toDate()).format('DD/MM HH:mm')}</span>
                  <span className="md:hidden">  {dayjs(moment(data?.order?.delivery_time+" "+data?.order?.delivery_hour,'YYYY-MM-DD HH:mm:ss HH:mm').toDate()).format('HH:mm')}</span>
          
        
       
         
      </div>

  
    <div className="text-right ml-auto pl-2">
    
      <RiCloseLine className="text-4xl mt-2" onClick={closeModal} />
   

    </div>
 

 
</div>
<div className="py-4 px-5 text-left flex flex-row  ">
 
    <div className="w-full ">
    <p>{data?.order?.customer?.name}{data?.order?.customer_contact && (<> - {data?.order?.customer_contact}</>)}</p>
    {data?.order?.customer?.email && <p>{data?.order?.customer?.email}</p>}
    
    {data?.order?.customer_nif ?
                <span>Contribuinte: {data?.order?.customer_nif}</span>
                :
                <span className="dark:text-neutral"><i>Contribuinte não informado</i></span>
              }


            {data?.order?.order_type != "takeaway" && (<span>
              {data?.order?.billing_address && (
                <div>
                  <span>{formatAddress(data.order.billing_address)}</span> <br />
                  <span><i> {data.order.billing_address?.instructions && <>Instruções: {data.order.billing_address?.instructions}</>}</i> </span>
                </div>
              )}</span>
            )}
          
    </div>
  <div className="w-full text-right">
  {data?.order?.status.id != 4 && (
    data?.order?.order_type == "delivery" && (
      !data?.order?.cancelled_at && (
        <Button className=" text-xl font-semibold dark:bg-yellow-600"  onClick={() => handleCourier(data?.order)}>
         
          <span className="hidden md:block"> ENVIAR PEDIDO</span>
                  <span className="md:hidden">ENVIAR</span>  
           &nbsp;<RiSendPlane2Fill className="inline-block text-xl" style={{marginTop:"-3px"}}/>
        </Button>
      )
    )
  )
}
  </div>
 </div>
<div className="border-b border-t" style={{borderColor:Color(color).darken(0.4)}}>
{(products != "show") && ( <Button className="w-full text-xl font-normal dark:text-gray bg-transparent" onClick={toggleProducts}>
       VER PRODUTOS
      </Button>  )
     
    }  
      {(products == "show") && ( data?.order ? (
        <Table
          //@ts-ignore
          columns={columns}
          data={data?.order?.products!}
          rowKey="id"
          scroll={{ x: 300 }}
        />
      ) : (
        <span>Nenhum pedido encontrado</span>
      ))
     
      }  
        

      </div>
      {data?.order?.status?.id != 4 && 
      !data?.order?.cancelled_at && (
        <div className="p-5 w-full relative  ">
        <div className="flex space-x-2">
          <div className="flex space-x-2">
            <div className="">
              <Button className="w-full text-xl p-0 dark:bg-neutral-600"  onClick={() => handleModalMenuOrder()}>
                <RiMenuFill className="text-2xl" />
              </Button>
            </div>
            <div className="hidden">
              <Button className="w-full text-xl p-0  dark:bg-yellow-600" onClick={() => handleModalUpdateTime()}>
                <RiTimeLine className="text-4xl" />
              </Button>
            </div>
        </div>
        <div className="w-full text-xl flex space-x-2">
          {(!data?.order?.accepted_at || data?.order?.status?.id == 1)  ?
           <Button onClick={() => handleOrderStatus(2)} className="w-full text-xl bg-yellow-600">
              ACEITAR 
            </Button>

            :

            <>
             {data?.order?.status?.id == 2 && 
            <>
              <div className="w-full">
                <Button onClick={() => handleOrderStatus(3)} className="w-full text-xl dark:bg-blue">
                  PRONTO 
                </Button>
              </div>
              <div className="w-full">
                <Button onClick={() => handleOrderStatus(4)} className="w-full text-xl bg-lime">
                  <span className="hidden md:block">FINALIZAR</span>
                  <span className="md:hidden">FINALI.</span> 
                </Button>
              </div>
            </>
          }
          {data?.order?.status?.id == 3 && 
            <Button onClick={() => handleOrderStatus(4)} className="w-full text-xl bg-lime">
                <span className="hidden md:block">FINALIZAR</span>
                <span className="md:hidden">FINALI.</span>  
            </Button>
          }
            
            </>
          }
         
        </div>
      </div>
      </div>
      )
 }
      
   
    
      {/* @ts-ignore */}
    </div>
        </div>
     </div>
      </div>
    </div>
  );
};

export default OrderDetailsCard;
