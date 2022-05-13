import { UpdateCourier } from "@ts-types/generated";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import Courier from "@repositories/courier";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export interface ICourierUpdateVariables {
  variables: {
    id: string;
    input: UpdateCourier;
  };
}

export const useUpdateCourierMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ variables: { id, input } }: ICourierUpdateVariables) =>
      Courier.update(`${API_ENDPOINTS.COURIERS}/${id}`, input),
    {
      onSuccess: () => {
        toast.success("Atualizado com sucesso!");
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.COURIERS);
      },
    }
  );
};
