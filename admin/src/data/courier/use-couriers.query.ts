import { QueryParamsType, CouriersQueryOptionsType } from "@ts-types/custom.types";
import { stringifySearchQuery } from "@utils/data-mappers";
import { useQuery } from "react-query";
import Courier from "@repositories/courier";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { Courier as TTYpe } from "@ts-types/generated";

const fetchCouriers = async ({ queryKey }: QueryParamsType) => {
  const [_key, params] = queryKey;
  const {
    text,
    orderBy = "updated_at",
    sortedBy = "DESC",
  } = params as CouriersQueryOptionsType;
  const searchString = stringifySearchQuery({
    title: text,
  });
  const url = `${API_ENDPOINTS.COURIERS}?search=${searchString}&orderBy=${orderBy}&sortedBy=${sortedBy}`;
  const { data } = await Courier.all(url);
  return { couriers: data as TTYpe[] };
};

type TypeResponse = {
  couriers: TTYpe[];
};

const useCouriersQuery = (options: CouriersQueryOptionsType = {}) => {
  return useQuery<TypeResponse, Error>(
    [API_ENDPOINTS.COURIERS, options],
    fetchCouriers,
    {
      keepPreviousData: true,
    }
  );
};

export { useCouriersQuery, fetchCouriers };
