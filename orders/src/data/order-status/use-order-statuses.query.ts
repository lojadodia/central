import { QueryParamsType, QueryOptionsType } from "@ts-types/custom.types";
import { mapPaginatorData, stringifySearchQuery } from "@utils/data-mappers";
import { useQuery } from "react-query";
import OrderStatus from "@repositories/order-status";
import { API_ENDPOINTS } from "@utils/api/endpoints";

const fetchOrderStatuses = async ({ queryKey }: QueryParamsType) => {
  const [_key, params] = queryKey;
  const {
    page,
    text,
    limit = 15,
    orderBy = "serial",
    sortedBy = "ASC",
  } = params as QueryOptionsType;
  const searchString = stringifySearchQuery({
    name: text,
  });
  const url = `${API_ENDPOINTS.ORDER_STATUS}?search=${searchString}&limit=${limit}&page=${page}&orderBy=${orderBy}&sortedBy=${sortedBy}`;
  const {
    data: { data, ...rest },
  } = await OrderStatus.all(url);
  return {
    order_statuses: { data, paginatorInfo: mapPaginatorData({ ...rest }) },
  };
};

const fetchVariationOptions = async ({ queryKey }: QueryParamsType) => {
  const [_key, params] = queryKey;
  const {
    id
  } = params as {id: string | number};

  const url = `${API_ENDPOINTS.VARIATION_OPTIONS}/${id}`;
  const {
    data: { data, ...rest },
  } = await OrderStatus.all(url);
  return {
    variation_options: { data, paginatorInfo: mapPaginatorData({ ...rest }) },
  };
};

const useOrderStatusesQuery = (options: QueryOptionsType) => {
  return useQuery<any, Error>(
    [API_ENDPOINTS.ORDER_STATUS, options],
    fetchOrderStatuses,
    {
      keepPreviousData: true,
    }
  );
};

const useOrderVariationQuery = (options: {id: string | number}) => {
  if(options?.id){
    return useQuery<any, Error>(
      [API_ENDPOINTS.VARIATION_OPTIONS, options],
      fetchVariationOptions,
       {
        keepPreviousData: true,
       }
    )
  }
  
}

export { useOrderStatusesQuery, useOrderVariationQuery, fetchOrderStatuses };
