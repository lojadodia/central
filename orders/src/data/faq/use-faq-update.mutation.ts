import { UpdateFaq } from "@ts-types/generated";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import Faq from "@repositories/faq";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export interface IFaqUpdateVariables {
  variables: {
    id: string;
    input: UpdateFaq;
  };
}

export const useUpdateFaqMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ variables: { id, input } }: IFaqUpdateVariables) =>
      Faq.update(`${API_ENDPOINTS.FAQS}/${id}`, input),
    {
      onSuccess: () => {
        toast.success("Atualizado com sucesso!");
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.FAQS);
      },
    }
  );
};
