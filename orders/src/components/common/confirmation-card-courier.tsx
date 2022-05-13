
import CourierList from "@components/courier/courier-list";
import ErrorMessage from "@components/ui/error-message";
import { Table } from "@components/ui/table";
import Loader from "@components/ui/loader/loader";
import { OrderField } from "@ts-types/index";
import { SortOrder } from "@ts-types/generated";
import { useState } from "react";
import { useCouriersQuery } from "@data/courier/use-couriers.query";
import ActionButtons from "@components/common/action-buttons";
import { Courier } from "@ts-types/generated";
import Button from "@components/ui/button";
import { ROUTES } from "@utils/routes";
import Image from "next/image";
import { useUI } from "@contexts/ui.context";
import { siteSettings } from "@settings/site.settings";
import { toast } from "react-toastify";
import { RiCloseCircleFill, RiShoppingBagFill, RiSendPlane2Fill, RiCloseLine, RiMotorbikeFill, RiTakeawayFill, RiCloseCircleLine, RiTimeLine, RiTimeFill } from "react-icons/ri";

const ConfirmationCardCourier = ({ couriers }: IProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading: loading, error } = useCouriersQuery({
    text: searchTerm,
    orderBy: OrderField.UpdatedAt,
    sortedBy: SortOrder.Desc,
  });

  const { openModal, setModalData, setModalView, modalData, closeModal } = useUI();
  
   function handleSend(id:any) {
      fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}courier/send/order/${modalData?.tracking_number}/${id}`)
        .then(res => res.json()).then(res => {
          if(res?.error){
            toast.success(`${res?.error} (${res?.code})`);
          }else{
            toast.success(res?.success);

          }
      })
   
    

    closeModal();
  }

  function handleOrder(id:string|{id: string, status: string}) {
    setModalView("ORDER_DETAILS");
    setModalData(id);
    return openModal();
  }


  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;


  return (
    <div className="bg-white dark:bg-neutral-900  m-auto">
      <div className="w-full h-full text-center">
        <div className=" h-full flex-col justify-between">
     
          
        <div className="px-5 py-5 w-full bg-white rounded-lg border shadow-md  dark:bg-neutral-900 dark:border-neutral-600">
    <div className="flex justify-between items-center mb-4">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">ENVIAR PEDIDO</h5>
        <a className="text-sm font-medium hover:underline dark:text-white">
          <RiCloseLine className="text-4xl" onClick={() => handleOrder({id: modalData?.id, status: 'list'})} />
        </a>
   </div>
   <div className="flow-root">
        <ul role="list" className="divide-y divide-gray-200 dark:divide-neutral-600">

        {data?.couriers.map((courier: any) => { return (

              <li className="py-3 sm:py-4">
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                        <img className="w-8 h-8 rounded-full" src={courier?.image ?? siteSettings.avatar.placeholder} alt="image"/>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                           {courier?.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                          {courier?.phone}
                        </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    <Button 
                       className="py-2 px-5"
                        onClick={() => handleSend(courier?.id)}
                      > 
                      ENVIAR &nbsp; <RiSendPlane2Fill  className="inline-block text-xl" style={{marginTop:"-3px"}}/>
                      </Button>
                    </div>
                </div>
              </li>

        )})}

           


        </ul>
   </div>
</div>



      
     </div>
      </div>
    </div>
  );
};

export default ConfirmationCardCourier;
