
import { useCheckout } from "@contexts/checkout.context";
import { useUI } from "@contexts/ui.context";
import React, { useRef, useState, useLayoutEffect } from "react";
import Input from "@components/ui/input";
import { UserSearch } from '@data/customer/search'
import { useForm } from "react-hook-form";
import Button from "@components/ui/button";

const UpdateDeliveryFee = () => {
  
  const { closeModal, openModal, setModalView, setModalData } = useUI();
  const { setCheckoutData, checkoutData } = useCheckout();
  const [users, setDataUsers] = useState<any>({});
  const [user, setDataUser] = useState<any>({});
  const inputFocus = useRef(null)
  const filterCommas = (e) => {
		e.target.value = e.target.value.replace(/,/g, '.');
	};

  const {
    setValue,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      delivery_fee: checkoutData.shipping_charge ?? 0,
    },
  });

  useLayoutEffect(()=>{
    inputFocus.current && setTimeout(() => inputFocus.current.focus(), 0)
    inputFocus.current.value = checkoutData.shipping_charge ?? 0;
  }, [inputFocus.current])


  const updateDeliveryFee = () => {
    checkoutData.shipping_charge =  Number(inputFocus.current.value) ?? 0;
    setCheckoutData(checkoutData);
    setModalView("ADD_CARD_INFO");
    openModal();
  };

  const cancell = () => {
    setModalView("ADD_CARD_INFO");
    openModal();
  };
  return (
    <div className="p-5 sm:p-8 bg-white border-gray-200 rounded-lg dark:bg-neutral-800 border dark:border-neutral-700">
    <h1 className="text-heading dark:text-white font-semibold text-lg text-center mb-1 mt-2 ">
      Taxa de Entrega Manual
    </h1>

    <h1 className="mt-0">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</h1>
    <div>
   
    <div className="relative">
      
                <Input
                   {...register("delivery_fee")}
                  placeholder="Taxa de Entrega"
                  variant="outline"
                  ref={inputFocus}
                  onChange={filterCommas}
                  />
              
              <div className="mt-5">
          <Button className="w-full h-12 register-button" onClick={updateDeliveryFee}>
            ATUALIZAR
          </Button>
          
        </div>
        <div className="mt-3">
          <Button className="w-full h-12 register-button bg-gray-600" onClick={cancell}>
            CANCELAR
          </Button>
          
        </div>
                </div>
       
     </div>
    </div>
  );
};

export default UpdateDeliveryFee;
