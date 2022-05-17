import { useRouter } from "next/router";
import { Element } from "react-scroll";
import HomeLayout from "@components/layout/home-layout";
import React, { useEffect, useState } from "react";
import Input from "@components/ui/input";
import When from "@components/checkout/when";
import Scrollbar from "@components/ui/scrollbar";
import OrderCard from "@components/order/order-card";
import { useOrdersQuery } from "@data/order/use-orders.query";
import { UserSearch } from '@data/customer/search'
import { useCheckout } from "@contexts/checkout.context";
import Button from "@components/ui/button";
import axios from "axios";
import { useUI } from "@contexts/ui.context";
import VerifyCheckout from "@components/checkout/verify-checkout";
import { RiUser3Fill, RiPencilFill } from "react-icons/ri";
import Cookies from "js-cookie";

export default function HomePage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any>({});
  const [users, setDataUsers] = useState<any>({});
  const { data } = useOrdersQuery();
  const { client, updateClient, setOrderType, updateDeliverySchedule } = useCheckout();
  const { openModal, setModalView } = useUI();
  useEffect(() => {
    if (data?.orders?.data) {
      setOrders(data?.orders?.data);
    }
  }, [data?.orders?.data]);


  const base64id = window.btoa(unescape(encodeURIComponent(client?.id)));
  const [orders_client, setClientOrder] = useState();
  const url = Cookies.get("url_endpoint") ? Cookies.get("url_endpoint") : process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
  useEffect(() => {
    axios.get(url+"66583135b70/"+base64id)
    .then(function (response) {
      setClientOrder(response?.data)
    })
  },[client]); 


  const onPuttingDataInput = async (e: any) => {
    const res: any = await UserSearch(e.target.value);
    const result = res?.data;
    const users: any = []
    if(e.target.value.length > 3){
      for (let i in result) {
        if(result[i]){
          users.push(result[i]);
        }
    }
    }
    setDataUsers(users);
  }

  const haldeChooseClient = (user:any) => {
    updateClient(user)
    setDataUsers(null)
  };

  const resetClient = () => {
    updateClient(null)
    setOrderType(null)
    updateDeliverySchedule(null)
  };

  const handleAddUser = () => {
    setModalView("REGISTER");
    return openModal();
  };


  return (
    <>
      <Element
        name="grid"
        className="flex flex-1 border-t  border-solid border-theme dark:border-neutral-700 dark:bg-black border-opacity-70"
      >
        <main className="flex-1">
          <div className="grid grid-cols-3 gap-0">
         
            <div className="flex flex-col h-screen border-r  dark:border-neutral-700" style={{background:"#00021c"}}>
              <h3 className="text-xl dark:text-white pb-5 text-heading px-5" style={{paddingTop:"95px"}}>
                Lançar Pedidos
              </h3>
              <Scrollbar
                className="w-full px-5"
                style={{ height: "calc(100%)" }}
              >

              <div className="">
              
                    <>
                     <h3 className="text-md dark:text-white pb-2 text-heading flex w-full">
                       <div className="w-full"> 1. Selecionar Cliente</div>
                       <button
            className=" items-center w-full  text-right text-md font-semibold text-yellow transition-colors duration-200 focus:outline-none "
             style={{color:"#fbbe24"}}
             onClick={handleAddUser}
          >
           + NOVO
          </button>
                 
                </h3>
                {!client ? (
                <div className="relative">
                <Input
                  name="name"
                  placeholder="POR NOME, CONTATO OU E-MAIL"
                  variant="outline"
                  onChange={onPuttingDataInput}
                  />
                  {users?.length >0 && (
                      <div className={users?.length >0?"list-outside md:list-inside absolute top-120 bg-white dark:bg-black w-full w-88 border border-primary mt-1 z-50":""} >
                      {
                        users?.map((item: any, index: number) => {
                          if(index <=5){
                          return (
                              <>
                                {
                                  item ? (
                                    <ul onClick={()=>haldeChooseClient(item)} key={item?.id}>
                                      <li className="px-5 py-2 border-b hover:bg-gray-100 dark:md:hover:bg-neutral-700 dark:text-gray  dark:border-neutral-700 cursor-pointer">
                                        <span  className='dark:text-white'><b>{item?.name}</b> - {item?.profile?.contact} <br/> 
                                       {item?.address[0]?.address?.street_address && ( <small> <i>{item?.address[0]?.address?.street_address} {item?.address[0]?.address?.door}, {item?.address[0]?.address?.details}, {item?.address[0]?.address?.zip} - {item?.address[0]?.address?.city}</i></small>)}
                                        </span>
                                      </li>
                                    </ul>
                                  ) : null
                                }
                              </>
                            )
                            }
                        })
                      }
                      </div>  
                  )}
                 
                </div>
                 ):  (
                   <>
                    <Button className="px-4 uppercase py-3 mr-2 mb-4 text-center text-sm bg-primary display-inline text-white  rounded h-12  border-gray-200 border dark:border-neutral-700 cursor-pointer" size="small" >
                      <RiUser3Fill style={{ display: "inline-block", verticalAlign: '-2px' }} />&nbsp; {client?.name?.replace(/ .*/,'')}
                    </Button>
                    <span className="pt-2 inline-block">
                    <a href="#" onClick={resetClient} className="px-4 py-4 text-2xl"><RiPencilFill style={{ display: "inline-block", verticalAlign: '-2px' }} /></a>
                    </span>
                   </>
                 
                 )}
            
                </>
               
                
               
              </div>

              {client && (
                <div className="">    
                    <hr className="dark:border-neutral-700  pb-5" />          
                <h3 className="text-md dark:text-white pb-2 text-heading">
                  2. Escolha o Tipo da Encomenda
                </h3>
                <When/>
                </div>
              )

              }
             



              <div style={{height:"50px"}}></div>
              </Scrollbar>
             
              <footer className="sticky left-0 bottom-0  w-full py-5 px-6 z-10 bg-white  dark:bg-neutral-900 border-t dark:border-neutral-700">
              <VerifyCheckout />
             
            

</footer>
            </div>
            <div className="relative border-r dark:border-neutral-700  ">
            <div className="flex flex-col h-screen bg-white dark:bg-neutral-900">
             {client ? (
               <>
                 <h3 className="text-xl dark:text-white pb-5 text-heading px-5" style={{paddingTop:"95px"}}>
                Últimos Pedidos de {client?.name} 
              </h3>
              <Scrollbar
                className="w-full"
                style={{ height: "calc(100%)" }}
              >
                <div className="px-5 pb-5">
                  {orders_client?.length ? (
                    orders_client?.map((_order: any, index: number) => (
                      <OrderCard
                        key={index}
                        order={_order}
                      />
                    ))
                  ) : (
                    <div className="w-full flex items-center justify-center my-auto pt-5 mt-10">
                      <h4 className="text-lg px-5 dark:text-neutral text-body text-center">
                              {client?.name}  ainda não pediu nada
                      </h4>

                    </div>
                  )}
                </div>
                </Scrollbar>
                </>
             ):(
              <div className="w-full h-full flex items-center justify-center my-auto">
              <h4 className="text-lg px-5 dark:text-neutral text-body text-center">
              Selecione o Cliente para ver os seus últimos pedidos
              </h4>
            </div>
             )}
            
            </div>
           
          </div>
            <div className="relative  ">
            <div className="flex flex-col h-screen bg-white dark:bg-black">
              <h3 className="text-xl dark:text-white pb-5 text-heading px-5" style={{paddingTop:"95px"}}>
                Em Curso...
              </h3>
              <Scrollbar
                className="w-full"
                style={{ height: "calc(100%)" }}
              >
                <div className="px-5 pb-5">
                  {orders?.length ? (
                    orders?.map((_order: any, index: number) => (
                      <OrderCard
                        key={index}
                        order={_order}
                      />
                    ))
                  ) : (
                    <div className="w-full h-full flex items-center justify-center my-auto">
                      <h4 className="text-sm font-semibold dark:text-neutral text-body text-center">
                      Você ainda não pediu nada
                      </h4>
                    </div>
                  )}
                </div>
                </Scrollbar>
            </div>
           
          </div>
        
          </div>
          
        </main>
      </Element>
    </>
  );
}

HomePage.Layout = HomeLayout;
