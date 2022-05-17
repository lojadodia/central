import React, { FC, useMemo } from "react";
import { useCart } from "@contexts/quick-cart/cart.context";
import http from '@utils/api/http'
import { API_ENDPOINTS } from '@utils/api/endpoints'
import { generateCartItem } from "@contexts/quick-cart/generate-cart-item";
import { useUI } from "@contexts/ui.context";
import Cookies from 'js-cookie';

type UserAddress = {
  [key: string]: unknown;
};
export interface State {
  billing_address: UserAddress | null;
  shipping_address: UserAddress | null;
  obs: any;
  order_type: any;
  delivery_time: any;
  delivery_schedule: any;
  checkoutData: {
    total_tax: number;
    shipping_charge: number;
    mail?: number;
    unavailable_products: string[];
  } | null;
  discount: number;
  coupon: any;
}



const defaultState = {
  billing_address: null,
  shipping_address: null,
  checkoutData: null,
  delivery_time: "",
  delivery_schedule: "",
  order_type: "",
  obs: "",
  discount: 0,
  coupon: null,
};
const initialState =
  typeof window !== "undefined" && localStorage.getItem("checkout")
    ? JSON.parse(localStorage.getItem("checkout")!)
    : defaultState;
type Action =
  | {
      type: "UPDATE_BILLING_ADDRESS";
      payload: UserAddress;
    }
  | {
      type: "UPDATE_SHIPPING_ADDRESS";
      payload: UserAddress;
    }
  | {
      type: "UPDATE_DELIVERY_TIME";
      payload: any;
    }
    | {
      type: "UPDATE_DELIVERY_SCHEDULE";
      payload: any;
    }
  | {
      type: "UPDATE_OBS";
      payload: any;
    }
  |{
      type: "UPDATE_CLIENT";
      payload: any;
    }
  | {
      type: "SET_CHECKOUT_DATA";
      payload: any;
    }
  | {
      type: "CLEAR_CHECKOUT";
    }
  | {
      type: "APPLY_COUPON";
      payload: any;
    }
  | {
      type: "REMOVE_COUPON";
    }
  | {
    type: 'SET_ORDER_TYPE';
    payload: any
  };

export const CheckoutContext = React.createContext<State | any>(initialState);

CheckoutContext.displayName = "CheckoutContext";

function checkoutReducer(state: State, action: Action) {
  switch (action.type) {
    case "UPDATE_BILLING_ADDRESS": {
      return {
        ...state,
        billing_address: action.payload,
      };
    }
    case "UPDATE_SHIPPING_ADDRESS": {
      return {
        ...state,
        shipping_address: action.payload,
      };
    }
    case "SET_CHECKOUT_DATA": {
      return {
        ...state,
        checkoutData: action.payload,
      };
    }
    case "UPDATE_DELIVERY_TIME": {
      return {
        ...state,
        delivery_time: action.payload,
      };
    }
    case "UPDATE_DELIVERY_SCHEDULE": {
      return {
        ...state,
        delivery_schedule: action.payload,
      };
    }
    case "UPDATE_OBS": {
      return {
        ...state,
        obs: action.payload,
      };
    }
    case "UPDATE_CLIENT": {
      return {
        ...state,
        client: action.payload,
      };
    }
    case "CLEAR_CHECKOUT": {
      return defaultState;
    }
    case "APPLY_COUPON": {
      return {
        ...state,
        discount: calculateDiscount(state, action.payload),
        coupon: action.payload,
      };
    }
    case "SET_ORDER_TYPE":
      return {
        ...state,
        order_type: action.payload
      } 
    case "REMOVE_COUPON": {
      return {
        ...state,
        discount: 0,
        coupon: null,
      };
    }
  }
}

function calculateDiscount(state: any, coupon: any, amount: number = 1) {
  switch (coupon.type) {
    case "percentage":
      return (amount * coupon.amount) / 100;
    case "fixed":
      return coupon.amount;
    case "free_shipping":
      return state.checkoutData?.shipping_charge;
  }
}

export const CheckoutProvider: FC = (props) => {
  
  const [state, dispatch] = React.useReducer(checkoutReducer, initialState);
  React.useEffect(() => {
    localStorage.setItem("checkout", JSON.stringify(state));
  }, [state]);
 
  const { total, isEmpty, addItemToCart,clearItemFromCart } = useCart();
  const { isAuthorize, openModal, setModalView, setModalData } = useUI();

  const updateBillingAddress = (payload: UserAddress) =>
    dispatch({ type: "UPDATE_BILLING_ADDRESS", payload });
  const updateShippingAddress = (payload: UserAddress) =>
    dispatch({ type: "UPDATE_SHIPPING_ADDRESS", payload });
  const updateDeliveryTime = (payload: any) =>
    dispatch({ type: "UPDATE_DELIVERY_TIME", payload });
  const updateDeliverySchedule = (payload: any) =>
    dispatch({ type: "UPDATE_DELIVERY_SCHEDULE", payload });
  const updateObs = (payload: any) =>
    dispatch({ type: "UPDATE_OBS", payload });

  const updateClient = (payload: any) =>
    dispatch({ type: "UPDATE_CLIENT", payload });

  const setOrderType = (payload: any) => {
    
    if (!isEmpty) {
      http.post(`${API_ENDPOINTS.CHECK_OFFER}`, {
        order_type: payload,
        amount: total
      }).then(res => res.data).then((data ) => {
        if (data.product) {
          const item = generateCartItem(data.product)
          item.id = `${item.id}.offer`
          clearItemFromCart(item.id)

         
            item.price = 0
            addItemToCart(item, data.qty)
            setModalView("PRODUCT_OFFER")
            setModalData({ item, offer: data.offer})
            openModal()
            Cookies.set('offer', data.offer?.code) // active a cookie
        }
      })
    }
    dispatch({ type: 'SET_ORDER_TYPE', payload})
    if(payload=="takeaway"){
      window.location.hash = "#" 
      window.location.hash = "#target-schedule"
    }
    if(payload=="delivery"){
      window.location.hash = "#" 
      window.location.hash = "#target-address"
    }
  }
  const setCheckoutData = (payload: any) =>
    dispatch({ type: "SET_CHECKOUT_DATA", payload });
  const applyCoupon = (payload: any) =>
    dispatch({ type: "APPLY_COUPON", payload });
  const removeCoupon = () => dispatch({ type: "REMOVE_COUPON" });
  const clearCheckoutData = () => {
    localStorage.removeItem("checkout");
    dispatch({ type: "CLEAR_CHECKOUT" });
  };

  const value = useMemo(
    () => ({
      ...state,
      updateBillingAddress,
      updateShippingAddress,
      updateDeliveryTime,
      updateDeliverySchedule,
      updateObs,
      updateClient,
      setOrderType,
      setCheckoutData,
      applyCoupon,
      removeCoupon,
      clearCheckoutData,
    }),
    [state]
  );

  return <CheckoutContext.Provider value={value} {...props} />;
};

export const useCheckout = () => {
  const context = React.useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error(`useCheckout must be used within a CheckoutProvider`);
  }
  return context;
};
