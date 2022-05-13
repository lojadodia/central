import { CreateCourierInput } from "@ts-types/generated";
import { ROUTES } from "@utils/routes";
import Courier from "@repositories/courier";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export interface ICourierCreateVariables {
  variables: {
    input: CreateCourierInput;
  };
}

export const useCreateCourierMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    ({ variables: { input } }: ICourierCreateVariables) =>
      Courier.create(API_ENDPOINTS.COURIERS, input),
    {
      onSuccess: () => {
        router.push(ROUTES.COURIERS);
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.COURIERS);
      },
    }
  );
};
