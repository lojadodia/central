import { useMutation, useQueryClient } from "react-query";
import Faq from "@repositories/faq";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const useDeleteFaqMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (id: string) => Faq.delete(`${API_ENDPOINTS.FAQS}/${id}`),
    {
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.FAQS);
      },
    }
  );
};
