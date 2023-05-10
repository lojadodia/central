import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Button from "@components/ui/button";
import ErrorMessage from "@components/ui/error-message";
import renderProductCard from "@components/product/render-product-card";
//import NotFound from "@components/common/not-found";
import {
  useProductsQuery, 
  useProductsTodayMenuQuery,
} from "@data/product/use-products.query";
import http from "@utils/api/http";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { useCategoriesQuery } from "@data/category/use-categories.query";
import { Fragment, useEffect, useState } from "react";

import {
  listCategory,
  useSettingsQuery,
} from "@data/settings/use-settings.query";

import { ProdutosItemsCategory } from "@components/product/product-items";
//import { Category } from "@ts-types/custom.types";
//import AppDownload from "@components/ui/app-download";
import {  RiInformationFill, RiSearchLine } from "react-icons/ri";
//import { useSettings } from "@contexts/settings.context";
import { RiCalendarTodoFill, RiCloseLine } from "react-icons/ri";
import { useUI } from "@contexts/ui.context";


const Feed = () => {
  //const settings: any = useSettings();
  const { query } = useRouter();
  const { type } = query;
  const [search, setSearch] = useState("");
  const [text, setText] = useState("")

  const {
    showModalStickyBar,
    hideModalStickyBar,
    displayModalStickyBar,
    modalData,
    closeModal,
    setModalView,
    setModalData,
    openModal
  } = useUI();
  /*
  const { data: allCategories } = useCategoriesQuery({
    type: type as string
  });
  
  const {
    data: {
      settings: {
        options: { menuTitle },
      },
    },
  } = useSettingsQuery();
*/
  const {
    isFetching: loading,
    //isFetchingNextPage: loadingMore,
    //fetchNextPage,
    //hasNextPage,
    isError,
    data,
    error,

  } = useProductsQuery({
    type: query.type as string,
    text: query?.text as string,
    category: query?.category as string,
  });

  async function handleBack() {
    setModalView("ORDER_DETAILS");
    setModalData({id:modalData.id,status:"list"});
    return openModal();
  }

  async function startSearch(text:any) {
    if(text.length === 0){
      backSearch()
    }
    setText(text);
    if(text.length > 3){
      setSearch(text);
    }
   
  }
  

  const [cacheData, setCacheData] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    setCacheData(null);
    const dataAllList = async () => {
      const data = (await listCategory(search)) as any[];
      setCacheData(data);
     // console.log(data)
    };
    dataAllList();
  }, [search]);

  


  const [products, setProducts] = useState("");
  const [active, setActive] = useState("");


  useEffect(() => {
    if(active == ""){
      if(!!cacheData2?.length){
        setActive("_pratos_dia")
      }
    }
  }, [active]);
  

  const backSearch = () => {
    setActive(null);
    setSearch(null);
    setProducts(null);
  };


  const changeCategory = (category: any) => {
    http
      .get(`${API_ENDPOINTS.GET_CATEGORY}/${category}/products`)
      .then(({ data }) => {
        setProducts(data);
        setActive(category);
      });
  };



 const {
  isFetching: loading2,
  isFetchingNextPage: loadingMore2,
  fetchNextPage: fetchNextPage2,
  hasNextPage: hasNextPage2,
  isError: isError2,
  data: data2,
  error: error2,
} = useProductsTodayMenuQuery({
  type: query.type as string,
  text: query?.text as string,
  category: query?.category as string,
});
const [cacheData2, setCacheData2] = useState<any>(data2 ?? []);

useEffect(() => {
  if (data2 && data2.pages[0].data) {
    let products = data2.pages[0].data;
    setCacheData2(products);
  }
}, [data2]);


  return (
    <div className="bg-black mt-5 pt-2">
      <div className="px-5 border-b dark:border-neutral-500">
      <div className="mt-5 flex flex-nowrap overflow-y-auto w-full  pb-2">
     { !search?.length ? (
      <>
       {!!cacheData2?.length && (
       <button
          onClick={() => changeCategory("_pratos_dia")}
          style={{ lineHeight: "1" }}
          className={`${
            active == "_pratos_dia" &&
            "dark:bg-blue-700 border uppercase border-black "
          }  inline-block flex-col justify-between uppercase  mr-2 font-normal items-center border border-gray-100 mb-2 py-3 px-4  md:text-base bg-gray-800 dark:text-white  rounded border-gray-200 dark:border-neutral-700 border-b font-semibold text-heading transition-colors duration-200 focus:outline-none hover:border-primary-2 focus:border-primary-2 hover:bg-primary focus:bg-primary hover:text-white focus:text-white `}
        >
        
          <span className={`${
            active == "_pratos_dia" ?
            "dark:text-white text-white" : "text-white"
          } truncate pb-2`}
          
          >PRATOS DO DIA</span>
        </button>
          )}
      {cacheData?.map((item: any) => (
        <button
          onClick={() => changeCategory(item.slug)}
          style={{ lineHeight: "1" }}
          className={`${
            active == item.slug &&
            "dark:bg-blue-700 border uppercase border-black "
          }  inline-block flex-col justify-between uppercase  mr-2 font-normal items-center border border-gray-100 mb-2 py-3 px-4  md:text-base bg-gray-800 dark:text-white  rounded border-gray-200 dark:border-neutral-700 border-b font-semibold text-heading transition-colors duration-200 focus:outline-none hover:border-primary-2 focus:border-primary-2 hover:bg-primary focus:bg-primary hover:text-white focus:text-white `}
        >
        
          <span className={`${
            active == item.slug ?
            "dark:text-white text-white" : "text-white"
          } truncate pb-2`}
          
          >{item.name}</span>
        </button>
        
      ))}
      </>
     ): (
      <button
      onClick={backSearch}
      style={{ lineHeight: "1" }}
      className="inline-block flex-col uppercase justify-between  mr-2 font-normal items-center border border-gray-100 mb-2 py-3 px-4  md:text-base bg-gray-500 dark:text-white  rounded border-gray-200 dark:border-neutral-700 border-b font-semibold text-heading transition-colors duration-200 focus:outline-none hover:border-primary-2 focus:border-primary-2 hover:bg-primary focus:bg-primary hover:text-white focus:text-white "
    >
     
      Voltar
    </button>
     )} 

      </div>
      </div>
      
      <div className=" w-full " >

      <div className="flex gap-2 justify-between items-center px-5 py-3  dark:bg-neutral-800 border-b dark:border-neutral-500 ">
                  
                     <input type="text" name="search" 
                     className="px-4 h-14 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading dark:text-white bg-black dark:border-neutral-500 border text-lg focus:outline-none focus:ring-0"
                     placeholder="Procurar um Menu ou Produto..."
      value={text}
      onChange={(e) =>startSearch(e.target.value)} />
      <button onClick={() =>setSearch(text)} className="bg-gray-200 text-black border border-gray-300 hover:bg-primary-2 text-2xl px-5 py-0 h-14 rounded mx-5 "><RiSearchLine/></button>

                  </div>
   
      </div>
      <div className="relative px-5 pt-2" style={{height:"71vh",overflowY:"scroll"}} >

      {!active && !search && (<div className="text-lg text-gray-100 opacity-70 text-center mt-10 pt-5">
        <div className="pt-5 mt-10">
        Clique sobre alguma categoria ou pesquise por algum produto iniciar o processo de Encomenda
        </div>
     
        </div>)}
        {loading && !data?.pages?.length ? (
       
          <></>
        ) : ( 
          <>
          { 
            search?.length   ? (
              
             
                <div className="relative pt-5">

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-3">
                    <Fragment>
                      {cacheData?.map((product: any) => (
                        <motion.div key={product.id}>
                          {renderProductCard(product)}
                        </motion.div>
                      ))}
                    </Fragment>
                  </div>
                </div>
            
              
            ) : (
              <>
            {active == "_pratos_dia" && (
            !!cacheData2?.length && (
              <div className="relative">
                <div className="absolute scroll-behavior" id="hh"></div>
             
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-3">
                  <Fragment>
                    {cacheData2?.map((product: any) => (
                      <motion.div key={product.id}>
                        {renderProductCard(product)}
                      </motion.div>
                    ))}
                  </Fragment>
                </div>
              </div>
            )
            )}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-3">
                  <Fragment>
                  {products?.products_available?.map((product: any) => (
                    <motion.div key={product.id}>
                    {renderProductCard(product)}
                  </motion.div>
                ))}
            </Fragment>
                </div>
              </>
            )
          }
          
          </>
        )}
      </div>


    
      
      {/*hasNextPage && (
        <div className="flex justify-center mt-8 lg:mt-12">
          <Button
            loading={loadingMore}
            onClick={handleLoadMore}
            className="text-sm md:text-base font-semibold h-11"
          >
            Carregar mais
          </Button>
        </div>
      )*/}
      </div>

  );
};

export default Feed;
