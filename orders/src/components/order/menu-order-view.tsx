
import { useUI } from "@contexts/ui.context";
import { useDeleteBannerMutation } from "@data/banner/use-banner-delete.mutation";
import { RiTimerFlashFill, RiTimerFill, RiPrinterFill, RiCloseCircleFill, RiArrowLeftLine } from "react-icons/ri";
import http from '@utils/api/http';
import { toast } from 'react-toastify';

const MenuOrderView = () => { 
  const { closeModal, modalData, setModalView, setModalData, openModal} = useUI();

  async function handleBack() {
    setModalView("ORDER_DETAILS");
    setModalData({id:modalData.id,status:"list"});
    return openModal();
  }
  
  async function handleModalCancelOrder() {
    closeModal();
    setModalView('CANCEL_ORDER');
    setModalData(modalData)
    return openModal();

  }

  async function UpdateTimeView(order:any, type:string) {
    setModalView("UPDATE_TIME");
    setModalData({order:order,type:type});
    return openModal();
  }

   async function handlePrint() {
      http.post(`${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}app/v1/ticket-print`, {
         order: modalData?.id
      },
      {
         headers: {
         'x-app-key': 't49776304b7fe209b29mg'
         }
      }).then((data) => {
         if(data?.data?.message == "order_reprinted"){
         toast.info("O ticket será impresso nos próximos 30 segundos")
         }else{
         toast.error('Erro ao tentar a imprimir ticket.')
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
                Escolha uma Opção
             </h5>
             <ul className="my-4 space-y-3">
                <li>
                   <a onClick={() => UpdateTimeView(modalData, 'back')} className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-yellow-500 group hover:shadow dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:text-white">
                   <span className="flex-1 ml-3 whitespace-nowrap"><RiTimerFill className="inline-block" style={{marginTop:"-3px"}}/> Atrasar Encomenda</span>
                   </a>
                </li>
                <li>
                   <a onClick={() => UpdateTimeView(modalData, 'next')} className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-lime dark:hover:dark:bg-lime-800 dark:text-white">
                   <span className="flex-1 ml-3 whitespace-nowrap"><RiTimerFlashFill className="inline-block" style={{marginTop:"-3px"}}/> Adiantar Encomenda</span>
                   </a>
                </li>
                {
                  modalData.printed == 1 && (
                  <li>
                    <a onClick={handlePrint} className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
                    <span className="flex-1 ml-3 whitespace-nowrap"><RiPrinterFill className="inline-block" style={{marginTop:"-3px"}}/> Re-Imprimir Ticket</span>
                    </a>
                  </li>
                  )
                }
                
                <li>
                   <a onClick={handleModalCancelOrder} className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-red-500 dark:hover:bg-red-600 dark:text-white">
                   <span className="flex-1 ml-3 whitespace-nowrap"><RiCloseCircleFill className="inline-block" style={{marginTop:"-3px"}}/> Cancelar Encomenda</span>
                   </a>
                </li>
                <li>
                   <a onClick={handleBack} className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
                   <span className="flex-1 ml-3 whitespace-nowrap"><RiArrowLeftLine className="inline-block" style={{marginTop:"-3px"}}/> Voltar</span>
                   </a>
                </li>

             </ul>
             <div>
                <span className="items-center text-xs font-normal text-gray-500 dark:text-gray-400">
                  {modalData.printed == 1 ? "Após clicar sobre a opção 'Re-imprimir Ticket' deverá aguardar no mínimo 30 segundos para que o ticket seja impresso novamente" : " O sistema notificará as alterações feitas na encomenda ao cliente via e-mail"}
                </span>
             </div>
          </div>
       </div>
    </div>
 </div>
  );
};

export default MenuOrderView;
