import { UpdateOrder } from "@ts-types/generated";
import { useMutation, useQueryClient } from "react-query";
import Order from "@repositories/order";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export interface IOrderUpdateVariables {
  variables: { id: string; input: UpdateOrder };
}

export const useUpdateOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ variables: { id, input } }: IOrderUpdateVariables) =>
      Order.update(`${API_ENDPOINTS.ORDERS}/${id}`, input),
    {
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.ORDERS);
      },
    }
  );
};
