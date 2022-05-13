import Card from "@components/common/card";
import Layout from "@components/common/layout";
import Image from "next/image";
require('dayjs/locale/pt')
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
import { useOrderStatusesQuery, useOrderVariationQuery } from "@data/order-status/use-order-statuses.query";
import SelectInput from "@components/ui/select-input";
import Input from "@components/ui/input";
import { useMemo, useEffect, useState } from "react";
import { useUI } from "@contexts/ui.context";
import moment from 'moment';
import { RiCloseCircleLine, RiSave3Fill, RiTruckLine } from 'react-icons/ri'

type FormValues = {
  order_status: any;
  delivery_time: string;
  delivery_hour: string;
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
          <span>{name}</span>
          <span className="mx-2">x</span>
          <span className="font-semibold text-heading">
            {item.pivot.order_quantity}
          </span>
          {!!variations && <><p className="text-xs mt-1 text-body"><b>Variações</b></p>
            <ul className="mb-1">
              {Object.keys(variations).map((key: string) => (
                <li key={key}>{variations[key].name}</li>
              ))}
            </ul>
          </>}
          {!!(extras && extras.length) && <p className="text-xs text-body"><b>Extras</b> <br />
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
              <span className="text-sm  mt-2 block text-body">
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
      return <span>{price}</span>;
    },
  },
];
export default function OrderDetailsPage() {
  const { query } = useRouter();
  const { mutate: updateOrder, isLoading: updating } = useUpdateOrderMutation();
  const { data: orderStatusData } = useOrderStatusesQuery({});
  const { data, isLoading: loading, error } = useOrderQuery(query.id as string);

  const [cancelledAt, setCancelledAt] = useState(false)
  const [cancelledData, setCancelledData] = useState(new Date())
  const {
    handleSubmit,
    control,
    register,

    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      order_status: data?.order?.status?.id ?? "",
      delivery_hour: data?.order.delivery_hour
    },
  });

  useEffect(() => {
    //cancelledAt = data?.order?.cancelled_at
    setCancelledAt(!!!data?.order.cancelled_at)
    setCancelledData(data?.order?.cancelled_at ? moment(data.order.cancelled_at).format("HH:mm DD/MM/yyyy") : new Date())
  }, [data?.order?.cancelled_at])


  let minDate: any = useMemo(() => {
    let min: any = new Date()
    const date: any = data?.order.delivery_time
    if (!date) return min.getFullYear() + '-' + getNumeral(min.getMonth() + 1) + '-' + getNumeral(Math.min(min.getDate()))
    let auxDate = date.split('-')
    auxDate[2] = getNumeral(Math.min(min.getDate(), auxDate[2]))
    return auxDate.join('-')
  }, [data?.order.delivery_time])


  function getNumeral(num: number): string {
    return num < 10 ? '0' + num : num.toString()
  }
  const ChangeStatus = ({ order_status, delivery_time, delivery_hour }: FormValues) => {
    updateOrder({
      variables: {
        id: data?.order?.id as string,
        input: {
          status: order_status?.id as string,
          delivery_time: moment(moment(delivery_time, 'YYYY-MM-DD').toDate()).format('YYYY-MM-DD HH:mm:ss') as string,
          delivery_hour: delivery_hour as string
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

  const { openModal, setModalData, setModalView } = useUI();

  async function handleModal() {
    setModalView('CALL_COURIER');
    setModalData(data?.order?.tracking_number)
    return openModal();

  }

  async function handleModalCancelOrder() {
    setModalView('CANCEL_ORDER');
    setModalData(data?.order?.tracking_number)
    return openModal();

  }
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <Card>
      <div className="flex flex-col lg:flex-row items-center">
        <h3 className="text-2xl font-semibold text-heading text-center lg:text-left w-full lg:w-1/3 mb-8 lg:mb-0 whitespace-nowrap">
          Ref: #{data?.order?.tracking_number?.slice(-5)}
        </h3>
        {cancelledAt && <>
          <form
            onSubmit={handleSubmit(ChangeStatus)}
            className="flex items-start ml-auto w-full lg:w-2/4"
          >
            <div className="w-full mr-5 z-20 flex align-baseline">


              <Input
                {...register("delivery_time")}
                type="date"

                error={errors.delivery_time?.message}
                defaultValue={moment(moment(data?.order.delivery_time, 'YYYY-MM-DD HH:mm:ss')).format('YYYY-MM-DD')}
                variant="outline"
                className="mb-5 mr-5 sm:w-1/2"
              />
              <select {...register("delivery_hour")} defaultValue={data?.order.delivery_hour} className='px-4 h-12 flex items-center mr-3 rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-gray-300 focus:border-primary' >
                <option value="07:00" >07:00</option>
                <option value="07:15" >07:15</option>
                <option value="07:30" >07:30</option>
                <option value="07:45" >07:45</option>
                <option value="08:00" >08:00</option>
                <option value="08:15" >08:15</option>
                <option value="08:30" >08:30</option>
                <option value="08:45" >08:45</option>
                <option value="09:00" >09:00</option>
                <option value="09:15" >09:15</option>
                <option value="09:30" >09:30</option>
                <option value="09:45" >09:45</option>
                <option value="10:00" >10:00</option>
                <option value="10:15" >10:15</option>
                <option value="10:30" >10:30</option>
                <option value="10:45" >10:45</option>
                <option value="11:00" >11:00</option>
                <option value="11:15" >11:15</option>
                <option value="11:30" >11:30</option>
                <option value="11:45" >11:45</option>
                <option value="12:00" >12:00</option>
                <option value="12:15" >12:15</option>
                <option value="12:30" >12:30</option>
                <option value="12:45" >12:45</option>
                <option value="13:00" >13:00</option>
                <option value="13:15" >13:15</option>
                <option value="13:30" >13:30</option>
                <option value="13:45" >13:45</option>
                <option value="14:00" >14:00</option>
                <option value="14:15" >14:15</option>
                <option value="14:30" >14:30</option>
                <option value="14:45" >14:45</option>
                <option value="15:00" >15:00</option>
                <option value="15:15" >15:15</option>
                <option value="15:30" >15:30</option>
                <option value="15:45" >15:45</option>
                <option value="16:00" >16:00</option>
                <option value="16:15" >16:15</option>
                <option value="16:30" >16:30</option>
                <option value="16:45" >16:45</option>
                <option value="17:00" >17:00</option>
                <option value="17:15" >17:15</option>
                <option value="17:30" >17:30</option>
                <option value="17:45" >17:45</option>
                <option value="18:00" >18:00</option>
                <option value="18:15" >18:15</option>
                <option value="18:30" >18:30</option>
                <option value="18:45" >18:45</option>
                <option value="19:00" >19:00</option>
                <option value="19:15" >19:15</option>
                <option value="19:30" >19:30</option>
                <option value="19:45" >19:45</option>
                <option value="20:00" >20:00</option>
                <option value="20:15" >20:15</option>
                <option value="20:30" >20:30</option>
                <option value="20:45" >20:45</option>
                <option value="21:00" >21:00</option>
                <option value="21:15" >21:15</option>
                <option value="21:30" >21:30</option>
                <option value="21:45" >21:45</option>
                <option value="22:00" >22:00</option>
                <option value="22:15" >22:15</option>
                <option value="22:30" >22:30</option>
                <option value="22:45" >22:45</option>
                <option value="23:00" >23:00</option>
                <option value="23:15" >23:15</option>
              </select>
              <SelectInput
                name="order_status"
                control={control}
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.id}
                options={orderStatusData?.order_statuses?.data}
                placeholder="Status do pedido"
                className="sm:w-1/2"
              />

              <ValidationError message={errors?.order_status?.message} />
            </div>
            <Button loading={updating}>
              <span><RiSave3Fill className="fill-current h-8 w-8 text-teal-500" style={{ display: "inline-block", verticalAlign: '-2px' }} /></span>
            </Button>
          </form>
        </>
        }


      </div>
      {cancelledAt && <>
        <hr />
        <br />
        <div className="flex flex-col lg:flex-row items-center">

          {data?.order?.order_type != "takeaway" &&
            <>

              <span className="pt-0 mt-0 mr-4">
                <Button
                  loading={updating}
                  onClick={handleModal}

                >
                  <span className="w-0 h-5 " />
                  <span className="hidden sm:block">Chamar Estafeta</span>
                  <span className="block sm:hidden">Estafeta</span>
                </Button>

              </span>
            </>
          

          }

          <div

            className="flex items-start ml-auto w-full lg:w-2/4"
          >
            <div className="w-full  z-20 text-right flex ">


              <span className="pt-0 mt-0 ml-auto" style={{ display: 'inline-block' }}>
                <Button
                  loading={updating}
                  onClick={handleModalCancelOrder}

                  style={{ background: '#D00F1D' }}
                  variant="custom"
                  className="w-full py-2 px-4 bg-primary focus:outline-none hover:bg-primary-2 focus:bg-primary-2 text-white transition ease-in duration-200 text-center text-base font-semibold rounded shadow-md"
                >
                  <span className="w-0 h-5 " />
                  <span className="hidden sm:block">Cancelar</span>
                  <span className="block sm:hidden">Cancelar</span>
                </Button>

              </span>

            </div>
          </div>

        </div>
          <br />
      </>}

      {/*          
      <a href={`/orders/glovo/${data?.order?.tracking_number}`}  className=" mr-5">
          <Button 
              loading={updating}
              style={{background:'#fec045',border:'1px solid #d8992b',color:'#00a481'}}
            >
            <Glovo className="w-5 h-5 " />
            <span className="hidden sm:block">Envio com a Glovo</span>
            <span className="block sm:hidden">Glovo</span>
          </Button>
      </a> */}



      {!cancelledAt && <>
       
        <div className="bg-red-100 mt-5 border-t-4 border-red-400 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
          <div className="flex">
            <div className="py-1">
              <RiCloseCircleLine className="fill-current h-8 w-8 text-teal-500 mr-4" style={{ display: "inline-block", verticalAlign: '-2px' }} />
            </div>
            <div>
              <p className="font-bold">Pedido Cancelado</p>
              <p className="text-sm">Este pedido foi cancelado em: {cancelledData}.</p>
            </div>
          </div>
        </div>
        <br />
      </>
      }
      {cancelledAt && <>

      <hr />
      {data?.order?.shipping_info?.melhorenvio_tracking && <>
      <div className="bg-yellow-100 mt-5 border-t-4 border-yellow-400 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
          <div className="flex">
            <div className="py-1">
              <RiTruckLine className="fill-current h-8 w-8 text-teal-500 mr-4" style={{ display: "inline-block", verticalAlign: '-2px' }} />
            </div>
            <div>
              <p className="font-bold">Rastreio de Entrega: {data?.order?.shipping_info?.melhorenvio_tracking}</p>
              <p className="text-sm">Envio postado em: {data?.order?.shipping_info?.posted_at} </p>
              <p className="text-sm">Estado do Pedido: <span className="uppercase">{data?.order?.shipping_info?.status}</span> </p>
            </div>
          </div>
        </div>
        </>
      }
        <div className="my-5 lg:my-10 flex justify-center items-center">
          <ProgressBox
            data={orderStatusData?.order_statuses?.data}
            status={data?.order?.status?.serial!}
          />

        </div>
        </>


      }


      <div className="mb-10">
        {data?.order ? (
          <Table
            //@ts-ignore
            columns={columns}
            data={data?.order?.products!}
            rowKey="id"
            scroll={{ x: 300 }}
          />
        ) : (
          <span>Nenhum pedido encontrado</span>
        )}

        <div className="border-t-4 border-double border-gray-200 flex flex-col w-full sm:w-1/2 md:w-1/3 ml-auto px-4 py-4 space-y-2">
          <div className="flex items-center justify-between text-sm text-body">
            <span>Sub total</span>
            <span>{subtotal}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-body">
            <span>Taxa</span>
            <span>{sales_tax}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-body">
            <span>Taxa de entrega</span>
            <span>{delivery_fee}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-body">
            <span>Desconto</span>
            <span>{discount}</span>
          </div>
          <div className="flex items-center justify-between text-base text-heading font-semibold">
            <span>Total</span>
            <span>{total}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        <div className="w-full sm:w-1/2 sm:pr-8 mb-10 sm:mb-0">
          <div className="pb-5">
            <div className="text-sm text-gray-500 flex  flex-col items-start space-y-1">
              {data?.order?.customer_nif ?
                <span>NIF: {data?.order?.customer_nif}</span>
                :
                <span><i>NIF não informado</i></span>
              }
            </div>
          </div>
          <h3 className="text-heading font-medium mb-3 pb-2 border-b border-gray-200">
            Informações de  {data?.order?.order_type != "takeaway" ? "Entrega" : "Takeaway"}
          </h3>

          <div className="text-sm text-gray-500 flex flex-col items-start space-y-1">
            <span>{data?.order?.customer?.name}</span>
            {data?.order?.order_type != "takeaway" && (<span>
              {data?.order?.billing_address && (
                <div>
                  <span>{formatAddress(data.order.billing_address)}</span> <br />
                  <span><i>Obs: {data.order.billing_address?.instructions}</i> </span>
                </div>
              )}</span>
            )}
            {data?.order?.customer_contact && (
              <span>{data?.order?.customer_contact}</span>
            )}

          </div>

        </div>

        <div className="w-full sm:w-1/2 sm:pl-8">
          <h3 className="text-heading text-left font-medium sm:text-right mb-3 pb-2 border-b border-gray-200">
            Data de {data?.order?.order_type != "takeaway" ? "Entrega" : "Levantamento"}
          </h3>

          <div className="text-sm text-gray-500 text-left sm:text-right flex flex-col items-start sm:items-end space-y-1">
            <span>{moment(moment(data?.order.delivery_time, 'YYYY-MM-DD HH:mm:ss')).format('DD-MM-YYYY')} {data?.order?.delivery_hour}</span>

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
