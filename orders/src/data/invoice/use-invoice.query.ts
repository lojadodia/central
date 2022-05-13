import Invoice from "@repositories/tax";
import { useQuery } from "react-query";
import { Invoice as TInvoice } from "@ts-types/generated";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const fetchInvoice = async (id: string) => {
  const { data } = await Invoice.find(`${API_ENDPOINTS.INVOICES}/${id}`);
  return data;
};

export const useInvoiceQuery = (id: string) => {
  return useQuery<TInvoice, Error>([API_ENDPOINTS.INVOICES, id], () => fetchInvoice(id));
};
