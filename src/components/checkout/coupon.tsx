import { useEffect, useRef, useState } from "react";
import Input from "@components/ui/input";
import Button from "@components/ui/button";
import { useForm } from "react-hook-form";
import { useCheckout } from "@contexts/checkout.context";
import { useVerifyCouponMutation } from "@data/coupon/verify-coupon.mutation";
import { RiGift2Fill } from "react-icons/ri";
import http from "@utils/api/http";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { getToken } from "@utils/api/get-token";
import Cookies from "js-cookie";

import { toast } from "react-toastify";
import { useCart } from "@contexts/quick-cart/cart.context";
import { useUI } from "@contexts/ui.context";
import {
  calculatePaidTotal,
  calculateTotal,
} from "@contexts/quick-cart/cart.utils";
import { useSettings } from "@contexts/settings.context";

interface CouponProps {
  client: any;
}

const Coupon = ({ client }: CouponProps) => {

  const [hasCoupon, setHasCoupon] = useState(false);
  const [nameCoupon, setNameCoupon] = useState('');
  
  const settings:any = useSettings();

  const submitBtn = useRef(null);
  const inputRef = useRef(null);
  const { items } = useCart();
  const { checkoutData, discount, applyCoupon, coupon, order_type } = useCheckout();

  const available_items = items?.filter(
    (item: any) => !checkoutData?.unavailable_products?.includes(item.id)
  );


  const base_amount = calculateTotal(available_items);

  const [total, setTotal] = useState(base_amount);


  const { openModal, setModalView, setModalData } = useUI();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  
  const {
    mutate: verifyCoupon,
    isLoading: loading,
  } = useVerifyCouponMutation();






  // Voucher

     useEffect(() => {
       const takeCookie = Cookies.get('affiliates')
       if(takeCookie) {
          setHasCoupon(true);
          setNameCoupon(takeCookie)
          if(submitBtn.current){
            submitBtn.current.click()
            Cookies.remove('affiliates')
          }
       } 
      }, []);

  
  // Offer





  const inputsDisplayNone = () => {
     inputRef.current.style.display = 'none'
   }

    useEffect(() => {
      const takeCookie = Cookies.get('offer')
      if(takeCookie){
        setHasCoupon(true);
        setNameCoupon(takeCookie)
        if(submitBtn.current){
          submitBtn.current.click()
           if(inputRef.current) {
             inputsDisplayNone()
           }
        }
      }
    }, [nameCoupon]);

    useEffect(() => {
      // Primeira Compra 
      if(client?.profile?.socials?.first === 1){
        
        const token = getToken();
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
        
        http.post(`${API_ENDPOINTS.CHECK_OFFER}`, {
            headers: headers,
            code: "verify_first_purchase",
            order_type: order_type,
            amount: total
          })
          .then((data) => {
            if (data?.data?.is_valid) {
              applyCoupon(data?.data?.coupon);
              setHasCoupon(false);


              setModalView("PRODUCT_OFFER")
              setModalData({ item:"discount", offer: data?.data?.coupon})
              openModal();
            } else {
              toast.error(data?.data?.message);
            }
          })
      }
    }, [client]);
  

  const applyPoints = ()=>{

  
     

    setHasCoupon(true);
    setNameCoupon("utilizarpontos");
    const total =  calculatePaidTotal(
      {
        totalAmount: base_amount,
        tax: 0,
        // Tem algum problema com a taxa verificar depois
        //tax: checkoutData?.total_tax,
        shipping_charge: checkoutData?.shipping_charge,
        coupon: coupon
      },
      Number(discount)
    );


    setTotal(total)
    setTimeout(() => {
      if(submitBtn.current){
        submitBtn.current.click()
      }
    }, 100);
 
  }

  if (!hasCoupon && !coupon) {
    return (
      <div className="w-full flex space-x-2 mt-5">
      {(client?.profile?.socials?.points || client?.profile?.socials?.points == 0) && (
          <p
          role="button"
          className="w-full flex text-xs    border  bg-green-600     border-white rounded-lg border-dashed  pt-1 border-theme text-white w-full text-center dark:text-white transition duration-200"
          onClick={applyPoints}
        >
          <div className="w-full mb-3 mt-1" style={{lineHeight:"0px"}}>
          <span className="font-bold text-2xl mt-">{client?.profile?.socials?.points.toFixed(2)}</span>
          </div>
          <div className="w-full relative pt-2 mt-1">
          <span className="bg-white text-green-600 p-2 text-xs rounded font-bold">UTILIZAR</span>
          </div>
        </p>
      )}
      

      <p
        role="button"
        className="w-full text-xs font-bold  border border-dashed pt-4 bg-white shadow-lg px-3  border-white rounded-lg px-4  border-white text-primary text-center dark:text-white dark:bg-neutral-700 transition duration-200 hover:text-primary"
        onClick={() => setHasCoupon(true)}
      >
        <RiGift2Fill style={{ display: "inline-block", verticalAlign: '-4px',fontSize:'13pt' }} /> TEM CUPOM?
      </p>
      
      </div>
    );
  }

  async function onSubmit({ code }: { code: string }) {
  
    verifyCoupon(
      {
        client,
        code,
        order_type,
        total
      },
      {
        onSuccess: (data) => {
          if (data.is_valid) {
            applyCoupon(data.coupon);
            setHasCoupon(false);
          } else {
         
            toast.error(data.message)
            setError("code", {
              type: "manual",
              message: data.message,
            });
          }
        },
      }
    );

    // if (data?.verifyCoupon?.is_valid) {
    //   applyCoupon(data?.verifyCoupon?.coupon);
    //   setHasCoupon(false);
    // } else if (!data?.verifyCoupon?.is_valid) {
    //   setError("code", {
    //     type: "manual",
    //     message: "Invalid coupon code! please try again.",
    //   });
    // }
  }


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="w-full flex flex-col sm:flex-row mt-5 bg-white dark:bg-neutral-700 shadow-lg px-3 pt-4 pb-4 border border-primary rounded"
      ref={inputRef}
    >
      <Input
        {...register("code", { required: "O código do cupom é obrigatório" })}
        placeholder="INSIRA O CUPOM AQUI"
        variant="outline"
        className="mb-4 sm:mb-0 sm:mr-4 flex-1"
        dimension="small"
        error={errors?.code?.message}
        value={nameCoupon}
        onChange={(e) => setNameCoupon(e.target.value)}
       
      />
      <Button
        loading={loading}
        disabled={loading}
        size="small"
        className="w-full sm:w-40 lg:w-auto"
        ref={submitBtn}
        >
        APLICAR
      </Button>
    </form>
  );
};

export default Coupon;
