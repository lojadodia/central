import { QueryParamsType, QueryOptionsType } from "@ts-types/custom.types";
import { stringifySearchQuery } from "@utils/data-mappers";
import { useQuery } from "react-query";
import Invoice from "@repositories/invoice";
import { API_ENDPOINTS } from "@utils/api/endpoints";

const fetchInvoices = async ({ queryKey }: QueryParamsType) => {
  const [_key, params] = queryKey;
  const {
    text,
    orderBy = "updated_at",
    sortedBy = "DESC",
  } = params as QueryOptionsType;
  const searchString = stringifySearchQuery({
    name: text,
  });
  const url = `${API_ENDPOINTS.INVOICES}?search=${searchString}&orderBy=${orderBy}&sortedBy=${sortedBy}`;
  const { data } = await Invoice.all(url);
  return { invoices: data };
};

const useInvoicesQuery = (options: QueryOptionsType = {}) => {
  return useQuery<any, Error>([API_ENDPOINTS.INVOICES, options], fetchInvoices, {
    keepPreviousData: true,
  });
};

export { useInvoicesQuery, fetchInvoices };
