import { useCheckout } from "@contexts/checkout.context";
import usePrice from "@utils/use-price";
import { CloseIcon } from "@components/icons/close-icon";
import { useCart } from "@contexts/quick-cart/cart.context";
import { useSettings } from "@contexts/settings.context";
import { useUI } from "@contexts/ui.context";
import { RiPencilFill } from "react-icons/ri";
import React from "react";
import {
  calculatePaidTotal,
  calculateTotal,
} from "@contexts/quick-cart/cart.utils";
interface Props {
  className?: string;
}

const OrderResume = (props: Props) => {
  const { items, isEmpty } = useCart();
  const settings = useSettings();
  const { checkoutData, discount, removeCoupon, coupon } = useCheckout();
  const { setModalView, openModal } = useUI();
  const updateDeliveryFee = () => {
    setModalView("UPDATE_DELIVERY_FEE");
    return openModal();
  };
  const taxBag = settings?.order?.type.active_tax_bag;

  const available_items = items?.filter(
    (item: any) => !checkoutData?.unavailable_products?.includes(item.id)
  );
  const { price: tax } = usePrice(
    checkoutData && {
      amount: taxBag === "false" ? 0 : checkoutData?.total_tax,
    }
  );
  const { price: shipping } = usePrice(
    checkoutData && {
      amount: checkoutData.shipping_charge ?? 0,
    }
  );
  const base_amount = calculateTotal(available_items);
  const { price: sub_total } = usePrice(
    checkoutData && {
      amount: base_amount,
    }
  );
  const { price: discountPrice } = usePrice(
    discount && {
      amount: discount,
    }
  );

  const { price: total } = usePrice(
    checkoutData && {
      amount: calculatePaidTotal(
        {
          totalAmount: base_amount,
          tax: taxBag === "false" ? 0 : checkoutData?.total_tax,
          shipping_charge: checkoutData?.shipping_charge,
          coupon: coupon,
        },
        Number(discount)
      ),
    }
  );

  return (
    <div className={props.className}>
      <div className="flex flex-col border-b pb-2 border-rgb dark:border-neutral-700"></div>
      {checkoutData && (
        <div className="mt-2">
          <div className="flex justify-between mb-2">
            <p className="text-lg text-body dark:text-neutral">Sub Total</p>
            <span className="text-lg text-body dark:text-neutral">
              {sub_total}
            </span>
          </div>
          
            <div className="flex justify-between mb-2">
              <p className="text-lg text-body dark:text-neutral">
                {settings?.aux?.taxName ? settings?.aux?.taxName : "Taxas"}
              </p>
              <span className="text-lg text-body dark:text-neutral">{tax}</span>
            </div>
          

          <div className="flex justify-between mb-2">
            <p className="text-lg text-body dark:text-neutral">Entrega</p>
            <span className="text-lg text-body dark:text-neutral">
              {shipping}

              <span className="pt-2 inline-block">
                <a
                  href="#"
                  onClick={updateDeliveryFee}
                  className="px-2 py-1 text-2xl bg-yellow-400 text-black ml-3 rounded"
                >
                  <RiPencilFill
                    style={{ display: "inline-block", verticalAlign: "-2px" }}
                  />
                </a>
              </span>
            </span>
          </div>
          {discount ? (
            <div className="flex justify-between mb-4">
              <p className="text-lg text-body dark:text-neutral mr-4">
                Desconto
              </p>
              <span className="text-lg font-semibold text-red-500 flex items-center mr-auto">
                ({coupon.code})
                <button onClick={removeCoupon}>
                  <CloseIcon className="w-3 h-3 ml-2" />
                </button>
              </span>
              <span className="text-lg text-body dark:text-neutral">
                {discountPrice}
              </span>
            </div>
          ) : (
            <div className="flex justify-between my-1">{/* <Coupon /> */}</div>
          )}
          <div className="flex justify-between border-t-4 border-double border-rgb dark:border-neutral-700 pt-4">
            <p className="text-base text-2xl  font-semibold text-heading dark:text-white">
              Total
            </p>
            <span className="text-base text-2xl font-semibold text-heading dark:text-white">
              {total}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderResume;