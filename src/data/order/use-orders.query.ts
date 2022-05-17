import { API_ENDPOINTS } from "@utils/api/endpoints";
import { mapPaginatorData } from "@utils/data-mappers";
import { useQuery } from "react-query";
import { OrderService } from "./order.service";

export const fetchOrders = async () => {
  const {
    data: { data, ...rest },
  } = await OrderService.fetchUrl(API_ENDPOINTS.ORDERS);
  return {
    orders: { data, paginatorInfo: mapPaginatorData({ ...rest }) },
  };
};
export const useOrdersQuery = () => {
  return useQuery<any, Error>(API_ENDPOINTS.ORDERS, fetchOrders);
};
