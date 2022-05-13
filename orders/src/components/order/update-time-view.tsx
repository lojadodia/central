import UpdateTimeCard from "@components/common/update-time-card";
import { useUI } from "@contexts/ui.context";
import { useDeleteBannerMutation } from "@data/banner/use-banner-delete.mutation";
import { RiTimeLine, RiArrowLeftLine } from "react-icons/ri";
import http from '@utils/api/http';
import { toast } from 'react-toastify';

const UpdateTimeView = () => {
  const { modalData, setModalView, setModalData, openModal, closeModal } = useUI();

  async function handleBack() {
    setModalView("MENU_ORDER");
    setModalData(modalData.order);
    return openModal();
  }

  async function handleUpdateTime(time:number) {
      http.post(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}app/v1/update-time`, {
         order: modalData?.order?.id,
         time: time,
         type: modalData.type
      },
      {
         headers: {
         'x-app-key': 'fee5c6349776304b7fe209b29g'
         }
      }).then((data) => {
         if(data?.data?.message == "order_time_updated"){
         toast.info("Encomenda "+(modalData.type == "back" ? "atrasada" : "adiantada")+" com sucesso!")
         }else{
         toast.error('Erro ao atualizar a encomenda.')
         }
      }).finally(() => {
         closeModal();
      });
   }
  
  return (
    <div className="m-auto">
    <div className="w-full h-full text-center">
       <div className=" h-full flex  ">
          <div className="p-4 max-w-sm bg-white  rounded-lg border shadow-md sm:p-6 dark:bg-neutral-800 dark:border-neutral-700 m-auto">
             <h5 className="mb-3 text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
                {modalData.type == "back" ? "Atrasar" : "Adiantar"} Encomenda
             </h5>
             <ul className="my-4 space-y-3">
                <li>
                   <a onClick={()=>handleUpdateTime(5)} className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
                   <span className="flex-1 ml-3 whitespace-nowrap"><RiTimeLine className="inline-block" style={{marginTop:"-3px"}}/> 5 min</span>
                   </a>
                </li>
                <li>
                   <a onClick={()=>handleUpdateTime(10)} className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
                   <span className="flex-1 ml-3 whitespace-nowrap"><RiTimeLine className="inline-block" style={{marginTop:"-3px"}}/> 10 min</span>
                   </a>
                </li>
                <li>
                   <a onClick={()=>handleUpdateTime(15)} className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
                   <span className="flex-1 ml-3 whitespace-nowrap"><RiTimeLine className="inline-block" style={{marginTop:"-3px"}}/> 15 min</span>
                   </a>
                </li>
              
                <li>
                   <a onClick={()=>handleUpdateTime(30)} className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
                   <span className="flex-1 ml-3 whitespace-nowrap"><RiTimeLine className="inline-block" style={{marginTop:"-3px"}}/> 30 min</span>
                   </a>
                </li>
        
                <li>
                   <a onClick={()=>handleUpdateTime(45)} className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
                   <span className="flex-1 ml-3 whitespace-nowrap"><RiTimeLine className="inline-block" style={{marginTop:"-3px"}}/> 45 min</span>
                   </a>
                </li>
           
                <li>
                   <a onClick={()=>handleUpdateTime(60)} className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
                   <span className="flex-1 ml-3 whitespace-nowrap"><RiTimeLine className="inline-block" style={{marginTop:"-3px"}}/> 1 hora</span>
                   </a>
                </li>

                <li>
                   <a onClick={handleBack} className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
                   <span className="flex-1 ml-3 whitespace-nowrap"><RiArrowLeftLine className="inline-block" style={{marginTop:"-3px"}}/> Voltar</span>
                   </a>
                </li>


             </ul>
             <div>
                <span className="inline-flex items-center text-xs font-normal text-gray-500 dark:text-gray-400">
                O cliente receberá um email a notificar esta alteração</span>
             </div>
          </div>
       </div>
    </div>
 </div>
  );
};

export default UpdateTimeView;
