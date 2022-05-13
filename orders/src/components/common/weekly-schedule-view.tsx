import { useEffect } from 'react'
import { useUI } from "@contexts/ui.context";
import { RiCalendarTodoFill, RiCloseLine } from "react-icons/ri";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import ProductList from "@components/product/product-list";
import Toggle from 'react-toggle';
import http from '@utils/api/http';
import { OrderField } from "@ts-types/index";
import { SortOrder } from "@ts-types/generated";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import Image from "next/image";
import { useProductsWithWeeksQuery } from "@data/product/products.query";
import { useState } from "react";
import { siteSettings } from "@settings/site.settings";
import Search from "@components/common/search";

const WeeklyScheduleView = () => { 
   const [page, setPage] = useState(1);
   const [searchTerm, setSearchTerm] = useState("");
   const [updatedDate, setUpdatedDate] = useState(null)
   const { closeModal, displayModal, modalData, setModalView, setModalData, openModal} = useUI();
   type FormValues = {
      name?: string | null;
   };
   type IProps = {
      initialValues?: null;
   };
   const { data, isLoading: loading, error } = useProductsWithWeeksQuery({
      limit: 20,
      page,
      text: searchTerm,
      orderBy: OrderField.UpdatedAt,
      sortedBy: SortOrder.Desc,
      [Date.now().toString()]: updatedDate
    });

    useEffect(() => {
      if (displayModal) {
         setUpdatedDate(updatedDate)
      }
     }, [displayModal])

    if (loading) return <Loader />;
    if (error) return <ErrorMessage message={error.message} />;


   const columns = [
      {
         title: "Imagem",
         dataIndex: "image",
         key: "image",
         align: "left",
         width: 74,
         render: (image: any, { name }: { name: string }) => (
            <Image
               src={image?.thumbnail ?? siteSettings.product.placeholder}
               alt={name}
               layout="fixed"
               width={42}
               height={42}
               className="rounded overflow-hidden"
            />
         ),
      },
      {
         title: "Nome",
         dataIndex: "name",
         key: "name",
         align: "left",
         width: 200,
         render: (name: string) => (
            <span className="whitespace-nowrap dark:text-white">{name}</span>
          ),
      },
   {
      title: "DOM",
      dataIndex: "available",
      key: "actions",
      align: "center",
      width: 32,
      render: (_: string, attr: { id: string }) => {
         let status:any = attr?.week && attr.week["1"]
   
         return <input type="checkbox"
         defaultChecked={status}
         id='sunday'
         onChange={(e:any) => {
         http.post(API_ENDPOINTS.WEEKLY_MENU, {
            id: attr.id,
            week: 1,
            status: e.target.checked == true ? 1 : 0
         })
         }}
         />
      },
   },
   {
      title: "SEG",
      dataIndex: "available",
      key: "actions",
      align: "center",
      width: 32,
      render: (_: string, attr: { id: string }) => {
         let status:any = attr?.week && attr?.week["2"]
         return <input type="checkbox"
         defaultChecked={status}
         id='monday'
         onChange={(e:any) => {
         http.post(API_ENDPOINTS.WEEKLY_MENU, {
            id: attr.id,
            week: 2,
            status: e.target.checked == true ? 1 : 0
         }).then(({ }) => {
            status = !status
            
         })
         }}
         />
      },
   },
   {
      title: "TER",
      dataIndex: "available",
      key: "actions",
      align: "center",
      width: 32,
      render: (_: string, attr: { id: string }) => {
         let status:any = attr?.week && attr?.week["3"]
   
         return <input type="checkbox"
         defaultChecked={status}
         id='tuesday'
         onChange={(e:any) => {
         http.post(API_ENDPOINTS.WEEKLY_MENU, {
            id: attr.id,
            week: 3,
            status: e.target.checked == true ? 1 : 0
         }).then(({ }) => {
            status = !status
            
         })
         }}
         />
      },
   },
   {
      title: "QUA",
      dataIndex: "available",
      key: "actions",
      align: "center",
      width: 32,
      render: (_: string, attr: { id: string, week: object }) => {
         let status:any = attr?.week && attr?.week["4"]
         
         return <input type="checkbox"
         defaultChecked={status}
         id='wednesday'
         onChange={(e:any) => {
         http.post(API_ENDPOINTS.WEEKLY_MENU, {
            id: attr.id,
            week: 4,
            status: e.target.checked == true ? 1 : 0
         }).then(({ }) => {
            status = !status
            
         })
         }}
         />
      },
   },
   {
      title: "QUI",
      dataIndex: "available",
      key: "actions",
      align: "center",
      width: 32,
      render: (_: string, attr: { id: string }) => {
         let status:any = attr?.week && attr?.week["5"]
   
         return <input type="checkbox"
         defaultChecked={status}
         id='thursday'
         onChange={(e:any) => {
         http.post(API_ENDPOINTS.WEEKLY_MENU, {
            id: attr.id,
            week: 5,
            status: e.target.checked == true ? 1 : 0
         }).then(({ }) => {
            status = !status
            
         })
         }}
         />
      },
   },
   {
      title: "SEX",
      dataIndex: "available",
      key: "actions",
      align: "center",
      width: 32,
      render: (_: string, attr: { id: string }) => {
         let status:any = attr?.week && attr?.week["6"]
   
         return <input type="checkbox"
         defaultChecked={status}
         id='friday'
         onChange={(e:any) => {
         http.post(API_ENDPOINTS.WEEKLY_MENU, {
            id: attr.id,
            week: 6,
            status: e.target.checked == true ? 1 : 0
         }).then(({ }) => {
            status = !status
            
         })
         }}
         />
      },
   },
   {
      title: "SÁB",
      dataIndex: "available",
      key: "actions",
      align: "center",
      width: 32,
      render: (_: string, attr: { id: string }) => {
         let status:any = attr?.week && attr?.week["7"]
   
         return <input type="checkbox"
         defaultChecked={status}
         id='saturday'
         onChange={(e:any) => {
         http.post(API_ENDPOINTS.WEEKLY_MENU, {
            id: attr.id,
            week: 7,
            status: e.target.checked == true ? 1 : 0
         }).then(({ }) => {
            status = !status
         })
         }}
         />
      },
   },
   {
      title: "",
      dataIndex: "available",
      key: "actions",
      align: "right",
      width: 200,
      render: (available: string, attr: { id: string }) => {
         let status:any = !!parseInt(available)
   
         return <Toggle
         id='available'
         defaultChecked={status}
         onChange={() => {
         http.post(API_ENDPOINTS.AVAILABILITY_UPDATE, {
            type: 'products',
            id: attr.id,
            status: !status
         }).then(() => {
            status = !status
            
         })
         }}
         />
      },
   }
   ];

   function handleSearch({ searchText }: { searchText: string }) {
      setSearchTerm(searchText);
      setPage(1);
   }
   function handlePagination(current: any) {
      setPage(current);
   }
  return (
   <div className="bg-white dark:bg-neutral-900  m-auto">
   <div className="w-full h-full text-center">
      <div className=" h-full flex-col justify-between">
         <div className="px-5 py-5 w-full bg-white rounded-lg border shadow-md  dark:bg-neutral-900 dark:border-neutral-600">
            <div className="flex justify-between items-center mb-4">
               <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
             MENUS
                
                </h5>
               <div className="px-5 w-full">
                  <Search onSearch={handleSearch} />
               </div>
               <a className="text-sm font-medium hover:underline dark:text-white">
                  <RiCloseLine className="text-4xl" onClick={closeModal} />
               </a>
            </div>
            <div className="overflow-x-scroll">

                     <ProductList scroll={{ x: 800 }} products={data?.products} defineColumns={columns} onPagination={handlePagination} />

            </div>
         </div>
      </div>
   </div>
</div>
  );
};

export default WeeklyScheduleView;
