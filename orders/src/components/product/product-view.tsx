
import { useUI } from "@contexts/ui.context";
import Search from "@components/common/search";
import ProductList from "@components/order/product-list";
import { RiCloseLine } from "react-icons/ri";
import Loader from "@components/ui/loader/loader";
import { OrderField } from "@ts-types/index";
import { SortOrder } from "@ts-types/generated";
import { useState } from "react";
import { useProductsQuery } from "@data/product/products.query";
import AttributeValuesList from "@components/attribute-values/attribute-values-list";
import Toggle from 'react-toggle';
import ErrorMessage from "@components/ui/error-message";
import http from '@utils/api/http'
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { useAttributeSyncsQuery } from "@data/attribute-value/use-attribute-syncronized.query";
import CategoryList from "@components/category/category-list";
import { useParentCategoriesQuery } from "@data/category/use-parent-categories.query";
import { useEffect } from 'react'

const ProductView = () => { 
  const { closeModal, displayModal } = useUI();
  const [searchTerm, setSearchTerm] = useState("");
  const [tab, setTab] = useState(1);
  const [page, setPage] = useState(1);
  const [updatedDate, setUpdatedDate] = useState(null)
  const { data, isLoading: loading, error } = useProductsQuery({
    limit: 20,
    page,
    text: searchTerm,
    orderBy: OrderField.UpdatedAt,
    sortedBy: SortOrder.Desc,
    [Date.now().toString()]: updatedDate
  });

  const attributes  = useAttributeSyncsQuery({
   limit: 20,
   page,
   text: searchTerm,
   orderBy: OrderField.UpdatedAt,
   sortedBy: SortOrder.Desc,
   [Date.now().toString()]: updatedDate
  });

  const categories  = useParentCategoriesQuery({
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

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }
  function handlePagination(current: any) {
    setPage(current);
  }

  let attributeColumns: any = [];
  attributeColumns.push({
    title: "Nome",
    dataIndex: "value",
    key: "value",
    align: "left",
    render: (value: string) => (
      <span className="whitespace-nowrap dark:text-white">{value}</span>
    ),
  })
  attributeColumns.push({
    title: "Ações",
    dataIndex: "available",
    key: "actions",
    align: "right",
    render: (available: string, attr: { sync_product: string }) => {
      let status:any = !!parseInt(available)
  
      return <Toggle
      value={status}
      id='available'
      defaultChecked={status}
      onChange={(e:any) => {
        http.post(API_ENDPOINTS.AVAILABILITY_UPDATE, {
          type: 'attributes',
          id: attr.sync_product,
          status: !status
        }).then(({ data }) => {
          status = data.status
         
        })
      }}
      />
    }
    ,
  })

  return (
   <div className="bg-white dark:bg-neutral-900  m-auto">
   <div className="w-full h-full text-center">
      <div className=" h-full flex-col justify-between">
         <div className="px-5 py-5 w-full bg-white rounded-lg border shadow-md  dark:bg-neutral-900 dark:border-neutral-600">
            <div className="flex justify-between items-center mb-4">
               <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">PRODUTOS</h5>
               <div className="px-5 w-full">
                  <Search onSearch={handleSearch} />
               </div>
               <a className="text-sm font-medium hover:underline dark:text-white">
                  <RiCloseLine className="text-4xl" onClick={closeModal} />
               </a>
            </div>
            <div className="flow-root">
               <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                  <ul className="flex flex-wrap -mb-px" id="myTab" data-tabs-toggle="#myTabContent" role="tablist">
                     <li className="mr-2" onClick={()=>{setTab(1),handlePagination(1)}} role="presentation">
                        <button className={`${tab == 1 && "active"} inline-block py-4 px-4 text-sm font-medium text-center text-gray-500 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-white`} id="profile-tab" data-tabs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">PRODUTOS</button>
                     </li>
                     <li className="mr-2" onClick={()=>{setTab(2),handlePagination(1)}}  role="presentation">
                        <button className={`${tab == 2 && "active"} inline-block py-4 px-4 text-sm font-medium text-center text-gray-500 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-white`} id="dashboard-tab" data-tabs-target="#dashboard" type="button" role="tab" aria-controls="dashboard" aria-selected="false">ACOMPANHAMENTOS & EXTRAS</button>
                     </li>
                     <li className="mr-2" onClick={()=>{setTab(3),handlePagination(1)}}  role="presentation">
                        <button className={`${tab == 3 && "active"} inline-block py-4 px-4 text-sm font-medium text-center text-gray-500 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-white`} id="settings-tab" data-tabs-target="#settings" type="button" role="tab" aria-controls="settings" aria-selected="false">CATEGORIAS</button>
                     </li>
                  </ul>
               </div>
               <div id="myTabContent">
                  {tab == 1 && (
                     <ProductList products={data?.products} onPagination={handlePagination} />
                  )}
                  {tab == 2 && (
                     <AttributeValuesList attributeColumns={attributeColumns} attributeValues={attributes?.data?.attributeValues!} />
                  )}
                  {tab == 3 && (
                     <CategoryList categories={categories?.data?.categories}  onPagination={handlePagination} />
                  )}
               </div>
            </div>
         </div>
      </div>
   </div>
</div>
  );
};

export default ProductView;
