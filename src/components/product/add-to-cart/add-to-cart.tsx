import Counter from "@components/ui/counter";
import AddToCartBtn from "@components/product/add-to-cart/add-to-cart-btn";
import { cartAnimation } from "@utils/cart-animation";
import { useCart } from "@contexts/quick-cart/cart.context";
import { Item } from "@contexts/quick-cart/cart.utils";
import { toast } from "react-toastify";
import { useUI } from "@contexts/ui.context";


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
  handlerModal?: () => void;
  handleVerifyOptions?: () => boolean;
}

export const AddToCart = ({
  data,
  obs,
  total,
  variant = "helium",
  counterVariant,
  counterClass,
  variation,
  disabled,
  isOpen = false,
  handleVerifyOptions,
  handlerModal,
}: Props) => {
  const {
    addItemToCart,
    removeItemFromCart,
    isInStock,
    getItemFromCart,
    isInCart,
  } = useCart();

  const item: Item = total;

  const { closeModal } = useUI();
  const handleAddClick = (
    e: React.MouseEvent<HTMLButtonElement | MouseEvent>
  ) => {
    e.stopPropagation();
    if (handleVerifyOptions() === false) {
      var hash = window.location.hash;
      window.location.hash = "#";
      toast.error("Selecione todas as Opções Obrigatórias (*)", {
        autoClose: 8000,
      });
      setTimeout(() => {
        window.location.hash = hash;
      }, 200);

      return;
    }

    item["price"] = total?.price_total;
    item["price_total"] = total?.price_total;

    console.log(item)

    item.obs = obs;
    addItemToCart(item, 1);
    if (!isInCart(item.id)) {
      cartAnimation(e);
    }
    closeModal();
  };

  const handleRemoveClick = (e: any) => {
    e.stopPropagation();
    removeItemFromCart(item.id);
  };

  let outOfStock

  if (item) {
    item.stock = data?.quantity;
    outOfStock = !isInStock(item?.id);
  }

  return !isInCart(item?.id) ? (
    <AddToCartBtn
      disabled={!outOfStock}
      variant={variant}
      onClick={isOpen ? handlerModal : handleAddClick}
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
