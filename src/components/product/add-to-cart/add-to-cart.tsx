import Counter from "@components/ui/counter";
import AddToCartBtn from "@components/product/add-to-cart/add-to-cart-btn";
import { cartAnimation } from "@utils/cart-animation";
import { useCart } from "@contexts/quick-cart/cart.context";
import { generateCartItem } from "@contexts/quick-cart/generate-cart-item";
import { Item } from "@contexts/quick-cart/cart.utils";
import { toast } from 'react-toastify';
import { useUI } from "@contexts/ui.context";
import usePrice from "@utils/use-price";

interface Props {
  data: any;
  obs?: string;
  variant?: "helium" | "neon" | "argon" | "oganesson" | "single" | "big";
  counterVariant?:
    | "helium"
    | "neon"
    | "argon"
    | "oganesson"
    | "single"
    | "details";
  counterClass?: string;
  variation?: any;
  disabled?: boolean;
  isOpen?: boolean;
  handlerModal?: () => void
  handleVerifyOptions?: () => boolean
}

export const AddToCart = ({
  data,
  obs,
  variant = "helium",
  counterVariant,
  counterClass,
  variation,
  disabled,
  isOpen = false,
  handleVerifyOptions,
  handlerModal
}: Props) => {
  const {
    addItemToCart,
    removeItemFromCart,
    isInStock,
    getItemFromCart,
    isInCart,
  } = useCart();
  const item: Item = generateCartItem(data, variation);
  const { closeModal } = useUI();
  const handleAddClick = (
    e: React.MouseEvent<HTMLButtonElement | MouseEvent>
    ) => {
      e.stopPropagation();
      if (handleVerifyOptions() === false) {
        var hash = window.location.hash;
        window.location.hash = "#";
        toast.error("Selecione todas as Opções Obrigatórias (*)", {autoClose: 8000});
        setTimeout(() => {
          window.location.hash = hash;
        }, 200);
       
        return
      }
      if (Number(item.price) <= 0) {
        toast.error("Após a pagina recarregar, tente denovo.", {autoClose: 8000});
        location.href=""
        return
      }
      item.obs = obs
    addItemToCart(item, 1);
    if (!isInCart(item.id)) {
      cartAnimation(e);
    }
    closeModal()
  };
  

  const handleRemoveClick = (e: any) => {
    e.stopPropagation();
    removeItemFromCart(item.id);
  };
  const outOfStock = isInCart(item.id) && !isInStock(item.id);

  let items = []


  if (item?.extras) {
    for(let key in item.extras) {
      let aux = item.extras[key]
     
      const { price: priceExtra } = usePrice({
        amount: +(aux.price * item?.quantity),
      });
      aux.sync_price2 = priceExtra
      items.push(aux)
    }
  }

  return !isInCart(item.id) ? (
    <AddToCartBtn
      disabled={disabled || outOfStock}
      variant={variant}
      onClick={ isOpen ? handlerModal : handleAddClick}
    />
  ) : (
    <>
      <Counter
        value={getItemFromCart(item.id).quantity}
        onDecrement={handleRemoveClick}
        onIncrement={handleAddClick}
        variant={counterVariant ? counterVariant : variant}
        className={counterClass}
        disabled={outOfStock}
      />
    </>
  );
};
