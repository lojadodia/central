
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

const CartSidebarView = () => {
  const { items, totalUniqueItems } = useCart();
  const { closeSidebar } = useUI();

  return (
    <>
    <section className="flex flex-col h-full relative dark:bg-neutral-900 border-l dark:border-neutral-700" >
    <div >
    <div className="" style={{width:"inherit"}}>
   
      {/* End of cart header */}

      <AnimateSharedLayout>
      
        <motion.div layout className="flex  dark:bg-neutral-900">
       
        <Scrollbar
                className="w-full"
                style={{ height: items.length > 0 ? "calc(100vh)" : "calc(100vh)",paddingTop:"78px",marginBottom:items.length > 0 ? "-197px" : "0px" }}>
               
          {items.length > 0 ? (
            items?.map((item) => <CartItem item={item} key={item.id} />)
          
          ) : (
            <motion.div
              layout
              initial="from"
              animate="to"
              exit="from"
              variants={fadeInOut(0.25)}
              className=" w-full h-full flex flex-col items-center justify-center"
            >
              {/* <EmptyCartIcon width={500} height={176}  /> */}
              <h4 className=" text-gray-500 font-semibold dark:text-gray">
              Nenhum item selecionado
              </h4>
            </motion.div>
          )}
            <div style={{height: items.length > 0 ? "97px" : "0px"}}></div>
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
