import React from "react";
import { cartReducer, State, initialState } from "./cart.reducer";
import { Item, getItem, inStock } from "./cart.utils";
import { useLocalStorage } from "@utils/use-local-storage";
import { CART_KEY } from "@utils/constants";
interface CartProviderState extends State {
  addItemToCart: (item: Item, quantity: number) => void;
  removeItemFromCart: (id: Item["id"]) => void;
  // updateItem: (id: Item["id"], payload: object) => void;
  // updateItemQuantity: (id: Item["id"], quantity: number) => void;
  clearItemFromCart: (id: Item["id"]) => void;
  getItemFromCart: (id: Item["id"]) => any | undefined;
  isInCart: (item: Item) => boolean;
  isInStock: (id: Item["id"]) => boolean;
  resetCart: () => void;
  // updateCartMetadata: (metadata: Metadata) => void;
}
export const cartContext = React.createContext<CartProviderState | undefined>(
  undefined
);

cartContext.displayName = "CartContext";

export const useCart = () => {
  const context = React.useContext(cartContext);
  if (context === undefined) {
    throw new Error(`useCart must be used within a CartProvider`);
  }
  return context;
};

export const CartProvider: React.FC = (props) => {
  const [savedCart, saveCart] = useLocalStorage(
    CART_KEY,
    JSON.stringify(initialState)
  );
  const [state, dispatch] = React.useReducer(
    cartReducer,
    JSON.parse(savedCart!)
  );

  React.useEffect(() => {
    notifyCartAction(state)
    saveCart(JSON.stringify(state));
  }, [state, saveCart]);

  const notifyCartAction = (state: State) => {

    if (state.updated_at === undefined && !state.isEmpty) {
      resetCart();
      return
    }
    
    let lastUpdatedAt = Number(state.updated_at);
    let updatedAtHour = (Date.now() - lastUpdatedAt) /(3600000); // 3600000 = 1000mil/s * 60s/m * 60m/h

    if (lastUpdatedAt > Date.now()) {
      
      resetCart();
    } else if ( updatedAtHour >= 12) {
      resetCart();
    }
  }
  React.useEffect(() => {
    
  }, [])

  const addItemToCart = (item: Item, quantity: number) => {
    notifyCartAction(state)
    return dispatch({ type: "ADD_ITEM_WITH_QUANTITY", item, quantity });
  }
  const removeItemFromCart = (id: Item["id"]) => {
    notifyCartAction(state)
    return dispatch({ type: "REMOVE_ITEM_OR_QUANTITY", id, updated_at: Date.now() });
  }
  const clearItemFromCart = (id: Item["id"]) =>{
    notifyCartAction(state)
    return dispatch({ type: "REMOVE_ITEM", id, updated_at: Date.now() });
  }
  const isInCart = (id: Item["id"]) => !!getItem(state.items, id);
  const getItemFromCart = (id: Item["id"]) => getItem(state.items, id);
  const isInStock = (id: Item["id"]) => inStock(state.items, id);
  const resetCart = () => dispatch({ type: "RESET_CART" });
  const value = React.useMemo(
    () => ({
      ...state,
      addItemToCart,
      removeItemFromCart,
      clearItemFromCart,
      getItemFromCart,
      isInCart,
      isInStock,
      resetCart,
    }),
    [state]
  );
  return <cartContext.Provider value={value} {...props} />;
};
