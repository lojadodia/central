import { CreateBannerInput } from "@ts-types/generated";
import { ROUTES } from "@utils/routes";
import Banner from "@repositories/banner";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export interface IBannerCreateVariables {
  variables: {
    input: CreateBannerInput;
  };
}

export const useCreateBannerMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    ({ variables: { input } }: IBannerCreateVariables) =>
      Banner.create(API_ENDPOINTS.BANNERS, input),
    {
      onSuccess: () => {
        router.push(ROUTES.BANNERS);
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.BANNERS);
      },
    }
  );
};
