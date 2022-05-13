
import { useUI } from "@contexts/ui.context";
import { RiTimerFill, RiCloseLine } from "react-icons/ri";
import { Table } from "@components/ui/table";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useEffect, useState } from 'react';
import SelectTimeDelivery from "@components/select-time-intervals/select-time-delivery"
import { useSettings } from '@contexts/settings.context'
import http from '@utils/api/http'

type TimeScheduler = {
   key: string,
   name: string,
   day: string,
   id: string,
   interval: string,
   interval2: string,
}

const WaitTimeView = () => { 
  const { closeModal, modalData, setModalView, setModalData, openModal} = useUI();
  type FormValues = {
      name?: string | null;
   };
   type IProps = {
      initialValues?: null;
   };

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

  const {
   register,
   handleSubmit,
   control,
   formState: { errors },
 } = useForm<FormValues>({
   defaultValues: {
      name: null,

   },
 });

 const { schedule } = useSettings()
 const [data, setDataSchedule] = useState([
   {
      'id': '1',
      'day': 'sunday',
      'name': 'Domingo',
      'slug': 'DOM',
   },
   {
      'id': '2',
      'day': 'monday',
      'name': 'Segunda-Feira',
      'slug': 'SEG'
   },
   {
      'id': '3',
      'day': 'tuesday',
      'name': 'Terça-Feira',
      'slug': 'TER'
   },
   {
      'id': '4',
      'day': 'wednesday',
      'name': 'Quarta-Feira',
      'slug': 'QUA'
   },
   {
      'id': '5',
      'day': 'thursday',
      'name': 'Quinta-Feira',
      'slug': 'QUI'
   },
   {
      'id': '6',
      'day': 'friday',
      'name': 'Sexta-Feira',
      'slug': 'SEX'
   },
   {
      'id': '7',
      'day': 'saturday',
      'name': 'Sábado',
      'slug': 'SÁB',
   },
])

 useEffect(() => {
   let transformData = data.map((t) => {
      return {
         ...t,
         ...schedule[t.day]
      }
   })
   setDataSchedule(transformData)
}, [schedule]);


  const columns = [
   {
     title: "Dia",
     accessor: 'name',
     dataIndex: "name",
     key: "name",
     align: "left",
     width: 0,
     render: (name:string,record:any) => {
       return  <span>
                  <span className="hidden md:block text-white">{name}</span>
                  <span className="md:hidden text-white">{record?.slug}</span>  
            </span>;
     },
   },
   {
      title: "Entrega",
      accessor: 'name',
      dataIndex: "name",
      key: "name",
      align: "left",
      width: 45,
      render: (name:string, record: TimeScheduler) => {
        return (
           <div key={record.key}>
               <div className="w-full "> 
            <Controller
                control={control}
                name={name}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                   <>{record?.interval && <SelectTimeDelivery onChange={(e: any) => {
                     http.post("app/v1/update/schedule", {
                        day: record.day,
                        period: "interval",
                        type: "interval",
                        value: e.target.value,
                        from: 'schedule'
                     }, {
                        headers: {
                           "x-app-key": "fee5c6349776304b7fe209b29x"
                        }
                     }).then((e: any) => console.log(e))
                  }} value={record.interval} />}</>
                )}
                />
               </div>
           </div>
        )
        
      },
    },
    {
      title: "Recolha",
      accessor: 'name',
      dataIndex: "name",
      key: "name",
      align: "left",
      width: 45,
      render: (name:string, record: TimeScheduler) => {
         return (
            <div key={record.key}>
               <div className="w-full "> 
            <Controller
                control={control}
                name={name}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                   <>{record?.interval2 && <SelectTimeDelivery onChange={(e: any) => {
                     http.post("app/v1/update/schedule", {
                        day: record.day,
                        period: "interval2",
                        type: "interval",
                        value: e.target.value,
                        from: 'schedule'
                     }, {
                        headers: {
                           "x-app-key": "fee5c6349776304b7fe209b29x"
                        }
                     }).then((e: any) => console.log(e))
                  }} value={record.interval2} />}</>
                )}
                />
               </div>
           </div>



         )
      },
    }
    
 ];




  return (
   <div className="bg-white dark:bg-neutral-900  m-auto">
   <div className="w-full h-full text-center">
      <div className=" h-full flex-col justify-between">
         <div className="px-5 py-5 w-full bg-white rounded-lg border shadow-md  dark:bg-neutral-900 dark:border-neutral-600">
            <div className="flex justify-between items-center mb-4">
               <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white"><RiTimerFill className="inline-block" style={{marginTop:"-3px"}}/> TEMPO DE PREPARAÇÃO</h5>
               <a className="text-sm font-medium hover:underline dark:text-white">
                  <RiCloseLine className="text-4xl" onClick={closeModal} />
               </a>
            </div>
            <div className="flow-root">
               <Table
                  //@ts-ignore
                  columns={columns}
                  data={data}
               />
            </div>
         </div>
      </div>
   </div>
</div>
  );
};

export default WaitTimeView;
