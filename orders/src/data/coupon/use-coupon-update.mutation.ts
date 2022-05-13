import { CouponUpdateInput } from "@ts-types/generated";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import Coupon from "@repositories/coupon";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export interface ICouponUpdateVariables {
  variables: { id: number | string; input: CouponUpdateInput };
}

export const useUpdateCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ variables: { id, input } }: ICouponUpdateVariables) =>
      Coupon.update(`${API_ENDPOINTS.COUPONS}/${id}`, input),
    {
      onSuccess: () => {
        toast.success("Atualizado com sucesso!");
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.COUPONS);
      },
    }
  );
};
