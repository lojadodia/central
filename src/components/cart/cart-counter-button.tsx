import { useUI } from "@contexts/ui.context";
import CartCheckBagIcon from "@components/icons/cart-check-bag";
import { formatString } from "@utils/format-string";
import usePrice from "@utils/use-price";
import { useCart } from "@contexts/quick-cart/cart.context";

const CartCounterButton = () => {
  const { totalUniqueItems, total } = useCart();
  const { openSidebar, setSidebarView } = useUI();
  const { price: totalPrice } = usePrice({
    amount: total,
  });
  function handleCartSidebar() {
    setSidebarView("CART_VIEW");
    return openSidebar();
  }
  return (

      <div className={`product-cart lg:flex flex-col items-center justify-center p-3 pt-3.5 fixed top-1/2 -mt-12 right-0 z-40 shadow-900 rounded rounded-tr-none rounded-br-none  transition-colors duration-200 `}>
      
     

    </div>

   
  );
};

export default CartCounterButton;
