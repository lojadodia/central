import React, { useState, useEffect } from "react";
import Button from "@components/ui/button";
import FormattedInput from "@components/ui/formatted-input";
import { useCheckout } from "@contexts/checkout.context";
import { formatOrderedProduct } from "@utils/format-ordered-product";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import ValidationError from "@components/ui/validation-error";
import { ROUTES } from "@utils/routes";
import { useCreateOrderMutation } from "@data/order/use-create-order.mutation";
import { useOrderStatusesQuery } from "@data/order/use-order-statuses.query";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useCart } from "@contexts/quick-cart/cart.context";
import { useCustomerQuery } from "@data/customer/use-customer.query";
import { useSettings } from "@contexts/settings.context";
import { toast } from "react-toastify";
import usePrice from "@utils/use-price";
import Spinner from "@components/ui/loaders/spinner/spinner";
import {
  calculatePaidTotal,
  calculateTotal,
} from "@contexts/quick-cart/cart.utils";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import axios from "axios";
import { RiBankCardFill, RiHandCoinFill} from "react-icons/ri";
import { useUI } from "@contexts/ui.context";
import OrderResume from "@components/order/order-resume";
import TextArea from "@components/ui/text-area";
interface FormValues {
  payment_gateway: "cod";
  contact: string;
  contact_mbway: string;
  email: string;
  nif: string;
  order: string;
  order_type: string;
  message: string;
  obs: string;
  card: {
    number: string;
    expiry: string;
    cvc: string;
  };
}

const paymentSchema = Yup.object().shape({
  // contact: Yup.string()
  //   .min(9, "Por-favor adicione um contato válido ao seu perfil")
  //   .required(),
  payment_gateway: Yup.string()
    .default("stripe")
    .oneOf(["cod"]),
  card: Yup.mixed().when("payment_gateway", {
    is: (value: string) => value === "stripe",
    then: Yup.object().shape({
      number: Yup.string().required("Por-favor introduza o número do cartão"),
      expiry: Yup.string().required("A data é obrigatória"),
      cvc: Yup.string().required("Digite o CVC do seu cartão"),
    }),
  }),
});

export default function PaymentForm() {
  const settings = useSettings();
  const [order, setOrder] = useState({
    id: null,
    tracking_number: null,
    entity: null,
    reference: null,
    value: null,
  });
  const [isDisabledSubmitButton, setIsDisabledSubmitButton] =useState<boolean>(false);
  const { closeModal} = useUI();
  const router = useRouter();
  const { mutate: createOrder, isLoading: loading } = useCreateOrderMutation();

  var default_method = "cod";
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(paymentSchema),
    defaultValues: {
      //contact: client.,
      //contact_mbway: contact,
      payment_gateway: default_method,
    },
  });

  const { price: totalPrice } = usePrice({
    amount: +order.value,
  });

  // Tradução
  useEffect(() => {
    translate();
    if(!payment_method){
      updatePaymentMethod("cod");
    }
  }, []);


  const { t } = useTranslation();
  const translate = () => {
    i18next.changeLanguage("PT");
  };
  // Fim da Tradução
 
  const { data: orderStatusData } = useOrderStatusesQuery();

  const isCashOnDelivery = watch("payment_gateway");
  const nif = watch("nif");


  const { items, resetCart } = useCart();
  const {
    billing_address,
    shipping_address,
    order_type,
    delivery_time,
    delivery_schedule,
    checkoutData,
    coupon,
    client,
    updateClient,
    discount,
    payment_method,
    updatePaymentMethod,
    clearCheckoutData
  } = useCheckout();



  const available_items = items?.filter(
    (item: any) => !checkoutData?.unavailable_products?.includes(item.id)
  );

  const subtotal = calculateTotal(available_items);
  const total = calculatePaidTotal(
    {
      totalAmount: subtotal,
      tax: checkoutData?.total_tax!,
      shipping_charge: checkoutData?.shipping_charge!,
    },
    discount
  );

  async function onSubmit(values: FormValues) {


    let input = {
      //@ts-ignore
      products: available_items?.map((item) => formatOrderedProduct(item)),
      client: client,
      customer_contact: client?.profile?.contact,
      customer_nif: values.nif,
      contact_mbway: values.contact_mbway,
      customer_email: values.email,
      status: orderStatusData?.order_statuses?.data[0]?.id ?? 1,
      amount: subtotal,
      coupon_id: coupon?.id,
      discount: discount ?? 0,
      paid_total: total,
      order_type: order_type,
      total,
      sales_tax: checkoutData?.total_tax,
      delivery_fee: checkoutData?.shipping_charge,
      delivery_way: checkoutData?.mail,
      delivery_time: delivery_time,
      delivery_schedule: delivery_schedule,
      obs: values.obs,
      client: client,
      payment_gateway: payment_method,
      billing_address: {
        ...(billing_address?.address && billing_address.address),
      },
      shipping_address: {
        ...(shipping_address?.address && shipping_address.address),
      },
    };
    //if (values.payment_gateway === "stripe") {
    // @ts-ignore


    setIsDisabledSubmitButton(true);
    createOrder(input, {
      onSuccess: (order: any) => {
        toast.success("Encomenda Enviada com Sucesso!", {
          autoClose: 7000,
          closeOnClick: true,
        });
        if (order.status == "1") {
          closeModal();
          updateClient(null);
          clearCheckoutData()
          resetCart()
          router.push("/central");
        } 
        
      },
      onError(error: any) {
        toast.error(error.response.data.message, {
          autoClose: 7000,
          closeOnClick: true,
        });
      },
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="p-5 sm:p-8 bg-white border-gray-200 rounded-lg dark:bg-neutral-800 border dark:border-neutral-700"
    >
      <div className="">
        <div className="flex items-center justify-between mb-2">
          <div className="flex mb-4 items-center mt-2 space-x-3 md:space-x-4">
          <FormattedInput
          style={{width:"200px"}}
            variant="outline"
            class="dark:bg-black dark:text-white -mt-2 dark:border-neutral-700 border border-gray-300 rounded dark:bg-black dark:text-white dark:border-neutral-700 focus:border-primary px-4 flex items-center w-full appearance-none transition duration-300 ease-in-out text-heading text-lg dark:text-white focus:outline-none focus:ring-0 h-12"
            type="text"
            className="flex"
            placeholder={t("seu_contribuinte")}
            {...register("nif")}
          />

            {/* <Label>Escolha uma Forma de Pagamento</Label> */}
          </div>   <h1 className="mt-5">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</h1>
          
        
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 ">
          <div onClick={()=>updatePaymentMethod("cod")} className={`px-4 py-3 text-center text-lg ${payment_method == "cod" ? 'bg-primary display-inline text-white' : ''}  rounded  border-gray-200 border dark:border-neutral-700 cursor-pointer`}>
            <RiHandCoinFill style={{ display: "inline-block", verticalAlign: '-2px' }} /> Dinheiro
          </div>
          <div onClick={()=>updatePaymentMethod("stripe")}  className={`px-4 py-3 text-center text-lg ${payment_method == "stripe" ? 'bg-primary display-inline text-white' : ''}  rounded   border-gray-200 border dark:border-neutral-700 cursor-pointer`}>
            <RiBankCardFill style={{ display: "inline-block", verticalAlign: '-2px' }} />  Multibanco
          </div> 
         
        </div>
        <div className="mt-7">

        <TextArea
          label="NOTAS:"
          {...register("obs")}
          variant="outline"
          placeholder="Ex. Troco de 5,00 €"
          className="col-span-2 capitalize"
          style={{fontSize:"1.125rem !important"}}
        />

        
        </div>
        <OrderResume />
      </div>

   
      {!subtotal && (
         <div className="mt-3 hidden">
            <ValidationError message="Your ordered items are unavailable" />
         </div>
      )}
      {total < 0 && (
        <div className="mt-3 hidden">
          <ValidationError message="Sorry, we can't process your order :(" />
        </div>
      )}

 


       {checkoutData ? ( 
        <div className="w-full">

          <Button
                  loading={loading}
                 type={isDisabledSubmitButton ? "button" : "submit"}
                  size="big"
                  disabled={!subtotal || total < 0}
                  className="w-full text-xl py-12 mt-5"

                >
                  Confirmar Encomenda →
            </Button>
        </div>
       
     ) : (
      <div className="text-center">
        <Spinner className="h-12" text="Processando Encomenda..." />
      </div>
     )}
       
    </form>
  );
}
