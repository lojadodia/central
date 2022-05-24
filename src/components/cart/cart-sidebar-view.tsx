
import { motion, AnimateSharedLayout } from "framer-motion";
import { useUI } from "@contexts/ui.context";
import CartCheckBagIcon from "@components/icons/cart-check-bag";
import EmptyCartIcon from "@components/icons/empty-cart";
import { CloseIcon } from "@components/icons/close-icon";
import CartItem from "@components/cart/cart-item";
import { fadeInOut } from "@utils/motion/fade-in-out";
import { useCart } from "@contexts/quick-cart/cart.context";
import { formatString } from "@utils/format-string";
import ButtonBuy from "@components/ui/button-buy";
import Scrollbar from "@components/ui/scrollbar";
import OrderCard from "@components/order/order-card";
import React, { useEffect, useState } from "react";
import { useOrdersQuery } from "@data/order/use-orders.query";
import OrdersPage from "src/pages/orders";

const CartSidebarView = () => {
  const { items, totalUniqueItems } = useCart();
  const { closeSidebar } = useUI();
  const [orders, setOrders] = useState<any>({});

  const { data } = useOrdersQuery();

  useEffect(() => {
    if (data?.orders?.data) {
      setOrders(data?.orders?.data);
    }
  }, [data?.orders?.data]);
  return (
    <>
    <section className="flex flex-col h-full relative dark:bg-neutral-900 border-l dark:border-neutral-700" >
    <div >
    <div className="" style={{width:"inherit"}}>
   
      {/* End of cart header */}

      <AnimateSharedLayout>
      
        <motion.div layout className="flex  dark:bg-neutral-900">
       
        <Scrollbar
                className="w-full lg:mt-20 mt-5"
                style={{ height: items.length > 0 ? "calc(100vh - 168px)" : "calc(100vh - 79px)",marginBottom:items.length > 0 ? "-120px" : "0px" }}>
               
          {items.length > 0 ? (
            items?.map((item) => <CartItem item={item} key={item.id} />)
          
          ) : (
            <div className="mt-5 px-5 text-center">
                <p className="dark:text-neutral" style={{marginTop:"42vh"}}>Nenhum Produto no Carrinho</p>
               {/* <OrdersPage orders={data} type="all"/> */}
          </div>
          )}
            <div style={{height: items.length > 0 ? "0px" : "0px"}}></div>
          </Scrollbar>
         
        </motion.div>
       
        
      </AnimateSharedLayout>
      {/* End of cart items */}

      </div>
      </div>
      {/* End of footer */}
    </section>
    {items.length > 0 && (
<footer className="sticky left-0 bottom-0  w-full py-5 px-6 z-10 bg-white  dark:bg-neutral-900 border-t dark:border-neutral-700">
  <ButtonBuy />
</footer>
)}
</>
  );
};

export default CartSidebarView;
