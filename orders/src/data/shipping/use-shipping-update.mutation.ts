import { ShippingUpdateInput } from "@ts-types/generated";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import Shipping from "@repositories/shipping";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export interface IShippingUpdateVariables {
  variables: {
    id: number | string;
    input: ShippingUpdateInput;
  };
}

export const useUpdateShippingClassMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ variables: { id, input } }: IShippingUpdateVariables) =>
      Shipping.update(`${API_ENDPOINTS.SHIPPINGS}/${id}`, input),
    {
      onSuccess: () => {
        toast.success("Atualizado com sucesso!");
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.SHIPPINGS);
      },
    }
  );
};
