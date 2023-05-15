import Counter from "@components/ui/counter";
import AddToCartBtn from "@components/product/add-to-cart/add-to-cart-btn";
import { cartAnimation } from "@utils/cart-animation";
import { useCart } from "@contexts/quick-cart/cart.context";
import { generateCartItem } from "@contexts/quick-cart/generate-cart-item";
import { Item } from "@contexts/quick-cart/cart.utils";
import { toast } from 'react-toastify';
import { useUI } from "@contexts/ui.context";
import { useSettings } from "@contexts/settings.context";

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
  handlerModal?: () => void,
  handleVerifyOptions?: () => boolean
}

export const AddToCart = ({
  data,
  total,
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
  const settings: any = useSettings();
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
     
      
      if (handleVerifyOptions!() === false) {
        var hash = window.location.hash;
        window.location.hash = "#";
        toast.error("Selecione todas as Opções Obrigatórias (*)", {autoClose: 8000});
        setTimeout(() => {
          window.location.hash = hash;
        }, 200);
        return
      }
     // if(item?.product_type == "variable")
     
      
     item["price"] =  total?.price_total ?? data?.price
     item["price_total"] =  total?.price_total ?? data?.price
     

      
      // if (Number(item.price_total) <= 0) {
      //   toast.error("Após a pagina recarregar, tente denovo.", {autoClose: 8000});
      //   location.href=""
      //   return
      // }

      item.obs = obs
      addItemToCart(item, 1);
      if (!isInCart(item.id)) {
        cartAnimation(e);
      }
      
      // NOTIFY FB PIXEL 
      const FACEBOOKPIXELID = settings?.api?.facebook_pixel;
      import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(FACEBOOKPIXELID);
        ReactPixel.track('AddToCart', {
          content_name: item?.name, 
          value: (item.price).toFixed(2),
          currency: 'EUR' 
        });
      });
      if(settings?.order?.type?.auto_close_product){
        if(settings?.order?.type?.auto_close_product != "no-close"){
          closeModal()
        }
      }else{closeModal()}
      
    };
    
    
    const handleRemoveClick = (e: any) => {
      e.stopPropagation();
      removeItemFromCart(item.id);
  };

  item.stock = data.quantity;
  const outOfStock = !isInStock(item.id);
  
  
  return !isInCart(item.id) ? (
    <AddToCartBtn
      disabled={!outOfStock}
      variant={variant}
      onClick={ isOpen ? handlerModal : handleAddClick}
    />
  ) : (
    <>
      <Counter
        value={getItemFromCart(item.id).quantity}
        onDecrement={(e) => handleRemoveClick(e)}
        onIncrement={(e) => handleAddClick(e)}
        variant={counterVariant ? counterVariant : variant}
        className={counterClass}
        disabled={outOfStock}
      />
    </>
  );
};
