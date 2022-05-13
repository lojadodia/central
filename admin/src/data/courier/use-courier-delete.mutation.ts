import { useMutation, useQueryClient } from "react-query";
import Courier from "@repositories/courier";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const useDeleteCourierMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (id: string) => Courier.delete(`${API_ENDPOINTS.COURIERS}/${id}`),
    {
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.COURIERS);
      },
    }
  );
};
