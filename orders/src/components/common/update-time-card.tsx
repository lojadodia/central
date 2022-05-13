
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

const UpdateTimeCard = ({ couriers }: IProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading: loading, error } = useCouriersQuery({
    text: searchTerm,
    orderBy: OrderField.UpdatedAt,
    sortedBy: SortOrder.Desc,
  });


  const { closeModal, modalData } = useUI();
  
   function handleSend(id:any) {
      fetch(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}courier/send/order/${modalData}/${id}`)
        .then(res => res.json()).then(res => {
          if(res?.error){
            toast.success(`${res?.error} (${res?.code})`);
          }else{
            toast.success(res?.success);

          }
      })
   
    

    closeModal();
  }


  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;


  return (
    <div className="m-auto">
      <div className="w-full h-full text-center">
        <div className=" h-full flex justify-between">
     
       

        <div className="p-4 max-w-sm bg-white  rounded-lg border shadow-md sm:p-6 dark:bg-neutral-800 dark:border-neutral-700">
<h5 className="mb-3 text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
Atrasar Pedido
</h5>
<ul className="my-4 space-y-3">
<li>
<a href="#" className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
<span className="flex-1 ml-3 whitespace-nowrap">+15 min</span>
</a>
</li>
<li>
<a href="#" className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
<span className="flex-1 ml-3 whitespace-nowrap">+30 min</span>
</a>
</li>
<li>
<a href="#" className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
<span className="flex-1 ml-3 whitespace-nowrap">+45 min</span>
</a>
</li>
<li>
<a href="#" className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
<span className="flex-1 ml-3 whitespace-nowrap">+1 hora</span>
</a>
</li>
<li>
<a href="#" className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
<span className="flex-1 ml-3 whitespace-nowrap">+1:15 min</span>
</a>
</li>
<li>
<a href="#" className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
<span className="flex-1 ml-3 whitespace-nowrap">+1:30 min</span>
</a>
</li>

</ul>
<div>
<span className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400">
  O cliente receberá um email a notificar este atraso</span>
</div>
</div>


<div className="p-4 max-w-sm  bg-white rounded-lg border shadow-md sm:p-6 dark:bg-neutral-800 dark:border-neutral-700">
<h5 className="mb-3 text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
Atrasar Pedido
</h5>
<ul className="my-4 space-y-3">
<li>
<a href="#" className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
<span className="flex-1 ml-3 whitespace-nowrap">+15 min</span>
</a>
</li>
<li>
<a href="#" className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
<span className="flex-1 ml-3 whitespace-nowrap">+30 min</span>
</a>
</li>
<li>
<a href="#" className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
<span className="flex-1 ml-3 whitespace-nowrap">+45 min</span>
</a>
</li>
<li>
<a href="#" className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
<span className="flex-1 ml-3 whitespace-nowrap">+1 hora</span>
</a>
</li>
<li>
<a href="#" className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
<span className="flex-1 ml-3 whitespace-nowrap">+1:15 min</span>
</a>
</li>
<li>
<a href="#" className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
<span className="flex-1 ml-3 whitespace-nowrap">+1:30 min</span>
</a>
</li>

</ul>
<div>
<span className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400">
  O cliente receberá um email a notificar este atraso</span>
</div>
</div>

      
     </div>
      </div>
    </div>
  );
};

export default UpdateTimeCard;
