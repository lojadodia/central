
import { useUI } from "@contexts/ui.context";
import { useDeleteBannerMutation } from "@data/banner/use-banner-delete.mutation";
import { RiListCheck2, RiTimerFill, RiCalendarTodoFill,  RiPrinterFill, RiCloseCircleFill, RiArrowLeftLine } from "react-icons/ri";

const MenuView = () => { 
  const { closeModal, modalData, setModalView, setModalData, openModal} = useUI();

  async function handleProduct() {
   closeModal();
   setModalView('PRODUCT');
   return openModal();
  }
  async function handleSchedule() {
   closeModal();
   setModalView('SCHEDULE');
   return openModal();
  }
  async function handleWaitTime() {
   closeModal();
   setModalView('WAIT_TIME');
   return openModal();
  }
  async function handleWeeklySchedule() {
   closeModal();
   setModalView('WEEKLY_SCHEDULE');
   return openModal();
  }

  return (
    <div className="m-auto">
    <div className="w-full h-full text-center">
       <div className=" h-full flex  ">
          <div className="p-4 max-w-sm bg-white  rounded-lg border shadow-md sm:p-6 dark:bg-neutral-800 dark:border-neutral-700 m-auto">
             <h5 className="mb-3 text-base font-semibold text-gray-900 lg:text-xl dark:text-white">
               O que pretende fazer?
             </h5>
             <ul className="my-4 space-y-3">

           
               <li>
                  <a onClick={handleProduct} className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
                  <span className="flex-1 ml-3 whitespace-nowrap"><RiListCheck2 className="inline-block" style={{marginTop:"-3px"}}/> Gerir Produtos</span>
                  </a>
               </li>
               <li>
                  <a onClick={handleSchedule} className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
                  <span className="flex-1 ml-3 whitespace-nowrap"><RiCalendarTodoFill className="inline-block" style={{marginTop:"-3px"}}/> Atualizar Horário</span>
                  </a>
               </li>
               <li>
                  <a onClick={handleWaitTime} className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
                  <span className="flex-1 ml-3 whitespace-nowrap"><RiTimerFill className="inline-block" style={{marginTop:"-3px"}}/>  Tempo de Preparação</span>
                  </a>
               </li>
               <li>
                  <a onClick={handleWeeklySchedule} className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
                  <span className="flex-1 ml-3 whitespace-nowrap"><RiCalendarTodoFill className="inline-block" style={{marginTop:"-3px"}}/>  Menús da Semana</span>
                  </a>
               </li>
               <li>
                  <a onClick={closeModal} className="flex items-center p-3 text-base font-bold text-gray-900 bg-gray-50 rounded-lg hover:bg-neutral-100 group hover:shadow dark:bg-neutral-600 dark:hover:bg-gray-500 dark:text-white">
                  <span className="flex-1 ml-3 whitespace-nowrap"><RiArrowLeftLine className="inline-block" style={{marginTop:"-3px"}}/> Voltar</span>
                  </a>
               </li>



             </ul>
             <div>
                <span className="items-center text-xs font-normal text-gray-500 dark:text-gray-400">
                  LOJA DO DIA ORDERS &copy; 2022 <br /> 
                  <small>Para aceder mais funcionalidades aceda o seu Painel Administrativo</small>  <br /> Saiba mais em <a href="https://www.lojadodia.com" target="_blank">www.lojadodia.com</a>
                </span>
             </div>
          </div>
       </div>
    </div>
 </div>
  );
};

export default MenuView;
