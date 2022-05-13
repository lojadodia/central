import Faq from "@repositories/faq";
import { useQuery } from "react-query";
import { Faq as TFaq } from "@ts-types/generated";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const fetchFaq = async (slug: string) => {
  const { data } = await Faq.find(`${API_ENDPOINTS.FAQS}/${slug}`);
  return data;
};

export const useFaqQuery = (slug: string) => {
  return useQuery<TFaq, Error>([API_ENDPOINTS.FAQS, slug], () =>
    fetchFaq(slug)
  );
};
