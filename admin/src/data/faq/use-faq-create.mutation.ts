import { CreateFaqInput } from "@ts-types/generated";
import { ROUTES } from "@utils/routes";
import Faq from "@repositories/faq";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export interface IFaqCreateVariables {
  variables: {
    input: CreateFaqInput;
  };
}

export const useCreateFaqMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    ({ variables: { input } }: IFaqCreateVariables) =>
      Faq.create(API_ENDPOINTS.FAQS, input),
    {
      onSuccess: () => {
        router.push(ROUTES.FAQS);
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.FAQS);
      },
    }
  );
};
