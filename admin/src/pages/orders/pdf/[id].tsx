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
import { useMemo } from "react";
import InvoicePdf from "../../../components/order/invoice-pdf";
import { PDFViewer } from "@react-pdf/renderer";
import { useSettingsQuery, fetchSettings } from "@data/settings/use-settings.query";
import { useSettings } from "@contexts/settings.context";

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
    title: "Products",
    dataIndex: "name",
    key: "name",
    align: "left",
    render: (name: string, item: any) => (
      
      <div>
        <span>{name}</span>
        <span className="mx-2">x</span>
        <span className="font-semibold text-heading">
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
const order:any = data?.order;
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;
  return (


        <PDFViewer  width="100%" height="100%">
        {<InvoicePdf order={order} />}
      </PDFViewer>


  );
}
OrderDetailsPage.Layout = Layout;
