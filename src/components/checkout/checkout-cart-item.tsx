import usePrice from "@utils/use-price";
import cn from "classnames";
import { formmatPrice } from "@utils/formmat-price";


interface Props {
  item: any;
  notAvailable?: boolean;
  isOffer?: boolean
}

const CheckoutCartItem = ({ item, notAvailable, isOffer = false }: Props) => {

  const { price } = usePrice({
    amount: item.item_price_total,
  });
  let items = []

  if (item?.extras) {
    for(let key in item.extras) {
      let aux = item.extras[key]
      const { price: priceExtra } = usePrice({
        amount: +(aux.price * item.quantity),
      });
      aux.sync_price2 = priceExtra
      items.push(aux)
    }
  }
  return (
    <div className={cn("text-sm", notAvailable ? "text-red-500" : "text-body dark:text-white ")}
    key={item.id}>
      <div className={cn("flex justify-between py-2 ")+ `${isOffer && " uppercase font-semibold text-primary italic" }`}>
        <p className={"flex items-center justify-between text-body "}>
          <span
            className={cn("text-sm", notAvailable ? "text-red-500" : "text-body ") + (!!isOffer && " text-primary")}
          >
            <span
              className={cn(
                "text-sm font-bold",
                notAvailable ? "text-red-500" : "text-heading "
              ) + (!!isOffer && " text-primary")}
            >
             <span  className="dark:text-white">{item.quantity}</span> 
            </span>
            {/* <span className="mx-2 dark:text-white text-black">x</span> */}
            <span className={`mx-2  ${isOffer ? " text-primary" : "dark:text-white text-black"}`}>x</span>
            {!!isOffer && <span>🎉 </span>}
            <span className={` font-semibold ${isOffer ? " text-primary " : " dark:text-white text-black "}`}>{item.name}</span>  <span  className="dark:text-white hidden">| {item.unit}</span>
          </span>
        </p>
        <span
          className={cn("text-sm", notAvailable ? "text-red-500" : "text-body dark:text-neutral") + (!!isOffer && " text-primary")}
        >
          <span className="dark:text-gray text-heading">{!notAvailable ? price : "Indisponível"}</span>
        </span>
      </div>
      {items.length !== 0 &&
        (<>
        <p className=" ml-7 -mt-2">
        
          <ul className="w-40 mb-1">
            {items && items.map((extra:any) =>
            (<li
              className={`text-xs dark:text-neutral ${extra?.group_is_extra == true && "text-body"}`}
              key={extra.id}>
               {extra?.group_is_extra == true && (<span>+ </span>)} <span>{extra.name}</span>&nbsp;
                {extra?.group_is_extra == true && (<span> - {formmatPrice(extra.price)}</span>)}
            </li>)
            )}
          </ul>

          {/* <ul className="w-40 mb-1">
            {items && items.map((extra:any) =>
            (<li
              className="text-xs dark:text-neutral"
              key={extra.id}>
                <span>{extra.value}</span>&nbsp;
                (<span>{extra.sync_price2})</span>
            </li>)
            )}
          </ul> */}
          </p>
          </>)
        }
        {
          item.obs && <span className="text-xs text-body dark:text-neutral mb-3 block">Obs: <i>{item.obs}</i></span> 
        }
    </div>
  );
};

export default CheckoutCartItem;
