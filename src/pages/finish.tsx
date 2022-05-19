import { useRouter } from "next/router";
import { Element } from "react-scroll";
import HomeLayout from "@components/layout/home-layout";
import React, { useEffect, useState } from "react";
import Input from "@components/ui/input";
import When from "@components/checkout/when";
import Scrollbar from "@components/ui/scrollbar";
import OrderCard from "@components/order/order-card";
import { useOrdersQuery } from "@data/order/use-orders.query";

import { useCheckout } from "@contexts/checkout.context";
import Button from "@components/ui/button";
import axios from "axios";
import { useUI } from "@contexts/ui.context";
import VerifyCheckout from "@components/checkout/verify-checkout";
import { RiUser3Fill, RiPencilFill } from "react-icons/ri";
import Cookies from "js-cookie";
import OrderInformation from "@components/order/order-information";
import OrdersPage from "./orders";

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


 

  const resetClient = () => {
    updateClient(null)
    setOrderType(null)
    updateDeliverySchedule(null)
  };

  const handleAddUser = () => {
    setModalView("REGISTER");
    return openModal();
  };

  const handleCustomerSearch = () => {
    setModalView("CUSTOMER_SEARCH");
    return openModal();
  };


  return (
    <>
      <Element
        name="grid"
        className="flex flex-1 border-t  border-solid border-theme dark:border-neutral-700 dark:bg-black border-opacity-70"
      >
        <main className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-2  lg:grid-cols-3 gap-0">
         
            <div className="flex flex-col  border-r  dark:border-neutral-700"  style={{ height: "calc(100vh)",background:"#00021c"}}>
              <h3 className="text-xl dark:text-white pb-5 text-heading px-5 lg:mt-22 mt-10 ">
                Cliente
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
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-red-600 z-50" style={{width:'100%',height:'100%',zIndex:50,opacity:0}} onClick={handleCustomerSearch}></div>
                <Input
                  name="name"
                  placeholder="POR NOME, CONTATO OU E-MAIL"
                  variant="outline"

                  />

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
             



         
              </Scrollbar>
             
              <footer className="sticky left-0 bottom-0  w-full py-5 px-6 z-10 bg-white  dark:bg-neutral-900 border-t dark:border-neutral-700">
              <VerifyCheckout />
             
            

</footer>
            </div>


            <div className="flex flex-col bg-white dark:bg-neutral-900 border-r dark:border-neutral-700" >
                <div className="px-5">
                <h3 className="text-xl dark:text-white pb-5 text-heading lg:mt-22 mt-10 ">
                  O Pedido
                  </h3>
                  <OrderInformation/>
                </div>
                </div>
                <div className="flex flex-col h-screen bg-white dark:bg-neutral-900 hidden lg:block">
                {client ? (
                  <>
                    <h3 className="text-xl dark:text-white pb-5 text-heading px-5 lg:mt-22 mt-10 ">
                    Histórico {client?.name} 
                  </h3>
                  <Scrollbar
                    className="w-full px-5"
                    style={{ height: "calc(100% - 147px)" }}
                  >
                  <OrdersPage orders={orders_client}/> 
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
           
           
            <div className="relative border-r dark:border-neutral-700  ">
            <div className="grid grid-cols-1 md:grid-cols-1  lg:grid-cols-1 gap-0">
           
          </div>
          
          </div>
          
        </main>
      </Element>
    </>
  );
}

HomePage.Layout = HomeLayout;
