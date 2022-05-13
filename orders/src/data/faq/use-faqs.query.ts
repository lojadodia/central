import { QueryParamsType, FaqsQueryOptionsType } from "@ts-types/custom.types";
import { stringifySearchQuery } from "@utils/data-mappers";
import { useQuery } from "react-query";
import Faq from "@repositories/faq";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { Faq as TTYpe } from "@ts-types/generated";

const fetchFaqs = async ({ queryKey }: QueryParamsType) => {
  const [_key, params] = queryKey;
  const {
    text,
    orderBy = "updated_at",
    sortedBy = "DESC",
  } = params as FaqsQueryOptionsType;
  const searchString = stringifySearchQuery({
    title: text,
  });
  const url = `${API_ENDPOINTS.FAQS}?search=${searchString}&orderBy=${orderBy}&sortedBy=${sortedBy}`;
  const { data } = await Faq.all(url);
  return { faqs: data as TTYpe[] };
};

type TypeResponse = {
  faqs: TTYpe[];
};

const useFaqsQuery = (options: FaqsQueryOptionsType = {}) => {
  return useQuery<TypeResponse, Error>(
    [API_ENDPOINTS.FAQS, options],
    fetchFaqs,
    {
      keepPreviousData: true,
    }
  );
};

export { useFaqsQuery, fetchFaqs };
