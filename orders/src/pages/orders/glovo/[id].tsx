import Card from "@components/common/card";
import Layout from "@components/common/layout";
import Image from "next/image";
import { Table } from "@components/ui/table";
import ProgressBox from "@components/ui/progress-box/progress-box";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Button from "@components/ui/button";
import ErrorMessage from "@components/ui/error-message";
import { siteSettings } from "@settings/site.settings";
import usePrice from "@utils/use-price";
import { formatAddress } from "@utils/format-address";
import Loader from "@components/ui/loader/loader";
import ValidationError from "@components/ui/form-validation-error";
import { Attachment } from "@ts-types/generated";
import { useOrderQuery } from "@data/order/use-order.query";
import { useUpdateOrderMutation } from "@data/order/use-order-update.mutation";
import { useOrderStatusesQuery } from "@data/order-status/use-order-statuses.query";
import SelectInput from "@components/ui/select-input";
import Input from "@components/ui/input";
import { Glovo } from "@components/icons/glovo";
import { useEffect, useMemo, useState } from "react";
import { withScriptjs } from "react-google-maps";
import Map from "./Map";
import { useUI } from "@contexts/ui.context";





const MapLoader = withScriptjs(Map);

type FormValues = {
  order_status: any;
  delivery_time: string
};
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
    title: "Productos",
    dataIndex: "name",
    key: "name",
    align: "left",
    render: (name: string, item: any) => (
      <div>
        <span>{name}</span>
        <span className="mx-2">x</span>
        <span className="font-semibold text-heading dark:text-white">
          {item.pivot.order_quantity}
        </span>
      </div>
    ),
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
      return <span>{price}</span>;
    },
  },
];
export default function OrderDetailsPage() {
  const { query } = useRouter();
  const { mutate: updateOrder, isLoading: updating } = useUpdateOrderMutation();
  const { data: orderStatusData } = useOrderStatusesQuery({});
  const { data, isLoading: loading, error } = useOrderQuery(query.id as string);


  const [shipping, setShipping] = useState({})
  const [tracking, setTracking] = useState({})
  const [realtracking, setRealTracking] = useState(false)
  useEffect(()=>{
    let timeId = null
    fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/glovo/tracking/${query.id}`)
    .then(res => res.json()).then(res => {
     
        setTracking(res)
        timeId = setInterval(() => setRealTracking(!realtracking), 20000)
    })

    return () => clearInterval(timeId)
  }, [realtracking])

  useEffect(()=>{
    fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}glovo/get/${query.id}`)
    .then(res => res.json()).then(res => {
      setShipping(res)
  })
  }, [])


  

  

  const { openModal, setModalData, setModalView } = useUI();

  async function handleModal() {
    setModalView('CALL_GLOVO');
    await fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}/glovo/estimate/${query.id}`)
    .then(res => res.json()).then(res => {
      if (res.error) {
        return setModalData({hash: query.id, title: 'Agendar Envio', message: 'Lamentamos mas a GLOVO não atende este raio.', disable: false, type: 'confirm'})
      } else 
        setModalData({hash: query.id, title: 'Agendar Envio', message: `ATENÇÃO: Este envio terá um custo de ${res.total.amount/100} € e a recolha está agendada para ${data?.order.delivery_time.split('-').reverse().join('/')}, confirma esta ação?`, disable: true, type: 'confirm'})
    }).finally
    (() =>{

      return openModal();
    })
  }

  async function handleCancel() {
    setModalView('CALL_GLOVO');
    setModalData({hash: query.id, title: 'Cancelar Envio', message: 'Confirma que pretende cancelar o Envio Agendado?', disable: true, type: 'cancel'});
    return openModal();
  }


  const {
    handleSubmit,
    control,
    register,
    
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      order_status: data?.order?.status?.id ?? "",
      delivery_time: data?.order.delivery_time.split('-').reverse().join("-")
     },
  });
  
  let minDate: any = useMemo(() => {
    let min: any = new Date()
    const date:any = data?.order.delivery_time

    if (!date) return min.getFullYear() + '-' + getNumeral(min.getMonth() + 1) + '-' + getNumeral(Math.min(min.getDate()))
    let auxDate = date.split('-')
    auxDate[2] = getNumeral(Math.min(min.getDate(), auxDate[2]))
    return auxDate.join('-')
  }, [data?.order.delivery_time])


  function getNumeral (num: number): string {
    return num < 10 ? '0'+num : num.toString()
  }
  const ChangeStatus = ({ order_status, delivery_time }: FormValues) => {
    updateOrder({
      variables: {
        id: data?.order?.id as string,        
        input: {
          status: order_status?.id as string,
          delivery_time: delivery_time as string
        },
      },
    });
  };
  const { price: subtotal } = usePrice(
    data && {
      amount: data?.order?.amount!,
    }
  );
  const { price: total } = usePrice(
    data && {
      amount: data?.order?.paid_total!,
    }
  );
  const { price: discount } = usePrice(
    data && {
      amount: data?.order?.discount!,
    }
  );
  const { price: delivery_fee } = usePrice(
    data && {
      amount: data?.order?.delivery_fee!,
    }
  );
  const { price: sales_tax } = usePrice(
    data && {
      amount: data?.order?.sales_tax!,
    }
  );

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;

  

  return (
    <Card>
      <div className="flex flex-col lg:flex-row items-center">
        <h3 className="text-2xl font-semibold text-heading dark:text-white text-center lg:text-left w-full lg:w-1/2 mb-8 lg:mb-0 whitespace-nowrap">
          Glovo - Envio: {data?.order?.tracking_number?.slice(-5)} 
          {shipping?.state && (
            <span>
                &nbsp; [
                  {shipping?.state == "ACTIVE" && ("EM PROCESSO")}
                  {shipping?.state == "SCHEDULED" && ("AGENDADO")}
                  {shipping?.state == "DELIVERED" && ("ENTREGUE")}
                  {shipping?.state == "CANCELED" && ("CANCELADO")}
                  ]
            </span>
             
          )}
        </h3>
        {shipping?.state != "DELIVERED" && shipping?.state != "SCHEDULED" && shipping?.state != "ACTIVE" && (
        <div className="w-full lg:w-1/2 text-right">
          <Button 
              loading={updating}
              onClick={handleModal}
              style={{background:'#fec045',border:'1px solid #d8992b',color:'#00a481'}}
            >
            <Glovo className="w-5 h-5 " />
              <span className="block">Agendar Envio</span>
          </Button>
          </div>
          )}
          {shipping?.state == "SCHEDULED" && (
        <div className="w-full lg:w-1/2 text-right">
          <Button 
              loading={updating}
              onClick={handleCancel}
              className=""
            > 
              <span className="block">Cancelar Envio</span>
          </Button>
          </div>
          )}
      </div>
      
     
      
      <div className="mb-10 mt-10">
        <MapLoader location={{from: data?.order.shipping_address, to: data?.order.billing_address, courier: tracking?.position}}
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDLxesZSWwDMbCq7KVWSwQkSmATfWDkyJw"
          loadingElement={<div style={{ width: `100%`, height: `420px` }} />}
        />

      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        <div className="w-full sm:w-1/2 sm:pr-8 mb-10 sm:mb-0">
        
          <h3 className="text-heading dark:text-white font-medium mb-3 pb-2 border-b border-gray-200 dark:border-neutral-600">
          Estafeta
          </h3>
        
          <div className="text-sm text-gray-500 flex flex-col items-start space-y-1">
            <span>Nome: {tracking?.courier?.name}</span>
           
            
              <span>Contato: {tracking?.courier?.phone}</span>

          </div>
        </div>

        <div className="w-full sm:w-1/2 sm:pl-8">
          <h3 className="text-heading dark:text-white text-left font-medium sm:text-right mb-3 pb-2 border-b border-gray-200 dark:border-neutral-600">
         Endereços
          </h3>

          <div className="text-sm text-gray-500 text-left sm:text-right flex flex-col items-start sm:items-end space-y-1">
            <span>Origem: {data?.order?.shipping_address && (
              <span>{formatAddress(data.order.shipping_address)}</span>
              )} </span>
            <span>Destino:  {data?.order?.billing_address && (
              <span>{formatAddress(data.order.billing_address)}</span>
            )} </span>
            {/*
              <span>{data?.order?.customer?.name}</span>
            {data?.order?.shipping_address && (
              <span>{formatAddress(data.order.shipping_address)}</span>
            )}
            {data?.order?.customer_contact && (
              <span>{data?.order?.customer_contact}</span>
            )}
            */
            }
            
          </div>
        </div>
      </div>
    </Card>
  );
}
OrderDetailsPage.Layout = Layout;
