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
      <button 
        className={`hidden ${totalUniqueItems == 0 ? "opacity-0" : "opacity-100"} lg:flex flex-col items-center justify-center p-3 pt-3.5 fixed top-1/2 -mt-12 right-0 z-40 shadow-900 rounded rounded-tr-none rounded-br-none bg-primary text-white text-sm font-semibold transition-colors duration-200 focus:outline-none hover:bg-primary-2`}
        onClick={handleCartSidebar} style={{zIndex:80}}
      >
        <span className="flex pb-0.5 text-lg ">
          <CartCheckBagIcon className="flex-shrink-0 mt-1" width={18} height={16} />
          <span className="flex ml-2">
            {formatString(totalUniqueItems, "Item")}
          </span>
        </span>
        <span className="bg-white rounded w-full py-2 text-lg px-2 text-primary mt-3">
          {totalPrice}
        </span>
     
     
    </button>
    </div>

   
  );
};

export default CartCounterButton;
