
import { useUI } from "@contexts/ui.context";
import { RiCalendarTodoFill, RiCloseLine } from "react-icons/ri";
import { Table } from "@components/ui/table";
import { useForm, Controller } from "react-hook-form";
import SelectTimeInterval from "@components/select-time-intervals/select-time-interval"
import { useEffect, useState } from 'react'
import { useSettings } from '@contexts/settings.context'
import http from '@utils/api/http'

type TimeScheduler = {
   key: string,
   name: string,
   day: string,
   id: string,
   time1: {
      start: string,
      end: string
   },
   time2: {
      start: string,
      end: string
   }
}
const ScheduleView = () => {
   const { closeModal, modalData, setModalView, setModalData, openModal } = useUI();
   type FormValues = {
      name?: string | null;
   };
   type IProps = {
      initialValues?: null;
   };

   async function handleBack() {
      setModalView("ORDER_DETAILS");
      setModalData({ id: modalData.id, status: "list" });
      return openModal();
   }

   async function handleModalCancelOrder() {
      closeModal();
      setModalView('CANCEL_ORDER');
      setModalData(modalData)
      return openModal();

   }


   async function UpdateTimeView(order: any, type: string) {
      setModalView("UPDATE_TIME");
      setModalData({ order: order, type: type });
      return openModal();
   }

   const { schedule, updatedData } = useSettings()
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
         render: (name: string, record: any) => {
             let status:any = record?.value;
           
            return <div className="flex">
            <input type="checkbox" id={record?.day} className="mr-2 mt-1"
            defaultChecked={status}
            onClick={(e:any) => {
            http.post("app/v1/update/schedule", {
               day: record.day,
               from: 'schedule',
               period: record.id,
               type: 'status',
               value: e.target.checked
            },{
               headers: {
                  "x-app-key": "fee5c6349776304b7fe209b29x"
               }}).then(({ }) => {
               status = !status
              
            })
            }}
            />
            <label for={record?.day}>
               <span className="hidden md:block text-white">{name}</span>
               <span className="md:hidden text-white">{record?.slug}</span>
            </label>
            </div>
            ;
         },
      },
      {
         title: "1º Periodo",
         accessor: 'name',
         dataIndex: "name",
         key: "name",
         align: "left",
         width: 45,
         render: (name: string, record: TimeScheduler) => {

            return (
               <div className="sm:flex sm:space-x-2">
                  <div className="w-full ">
                     <>{record?.time1 && <SelectTimeInterval
                        onChange={(e: any) => {
                           http.post("app/v1/update/schedule", {
                              day: record.day,
                              period: "time1",
                              type: "start",
                              value: e.target.value,
                              from: 'schedule'
                           }, {
                              headers: {
                                 "x-app-key": "fee5c6349776304b7fe209b29x"
                              }
                           })
                        }}
                        value={record?.time1?.start} />}</>
                  </div>
                  <div className="w-full">
                     <Controller
                        control={control}
                        name={name}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                           <>{record?.time1 && <SelectTimeInterval onChange={(e: any) => {

                              http.post("app/v1/update/schedule", {
                                 day: record.day,
                                 period: "time1",
                                 type: "end",
                                 value: e.target.value,
                                 from: 'schedule'
                              }, {
                                 headers: {
                                    "x-app-key": "fee5c6349776304b7fe209b29x"
                                 }
                              })
                           }} value={record?.time1?.end} />}</>
                        )}
                     />
                  </div>
               </div>
            )

         },
      },
      {
         title: "2º Periodo",
         accessor: 'name',
         dataIndex: "name",
         key: "name",
         align: "left",
         width: 45,
         render: (name: string, record: TimeScheduler) => {
            return <div key={record.key} className="sm:flex sm:space-x-2">
               <div className="w-full">
                  <Controller
                     control={control}
                     name={name}
                     rules={{ required: true }}
                     render={({ field: { onChange, value } }) => (
                        <>{record?.time2 && <SelectTimeInterval onChange={(e: any) => {

                           http.post("app/v1/update/schedule", {
                              day: record.day,
                              period: "time2",
                              type: "start",
                              value: e.target.value,
                              from: 'schedule'
                           }, {
                              headers: {
                                 "x-app-key": "fee5c6349776304b7fe209b29x"
                              }
                           }).then((e: any) => console.log(e))
                        }} value={record?.time2?.start} />}</>
                     )}
                  />
               </div>
               <div className="w-full">
                  <Controller
                     control={control}
                     name={name}
                     rules={{ required: true }}
                     render={({ field: { onChange, value } }) => (
                        <>{ record.time2 &&<SelectTimeInterval onChange={(e: any) => {

                           http.post("app/v1/update/schedule", {
                              day: record.day,
                              period: "time2",
                              type: "end",
                              value: e.target.value,
                              from: 'schedule'
                           }, {
                              headers: {
                                 "x-app-key": "fee5c6349776304b7fe209b29x"
                              }
                           }).then((e: any) => console.log(e))
                        }} value={record?.time2?.end} />}</>
                     )}
                  />
               </div>
            </div>
         },
      }

   ];

   return (
      <div className="bg-white dark:bg-neutral-900  m-auto">
         <div className="w-full h-full text-center">
            <div className=" h-full flex-col justify-between">
               <div className="px-5 py-5 w-full bg-white rounded-lg border shadow-md  dark:bg-neutral-900 dark:border-neutral-600">
                  <div className="flex justify-between items-center mb-4">
                     <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white"><RiCalendarTodoFill className="inline-block" style={{ marginTop: "-3px" }} /> HORÁRIO DE FUNCIONAMENTO</h5>
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

export default ScheduleView;
