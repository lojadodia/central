import { UpdateCategory } from "@ts-types/generated";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import Category from "@repositories/category";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export interface ICategoryUpdateVariables {
  variables: {
    id: string;
    input: UpdateCategory;
  };
}

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ variables: { id, input } }: ICategoryUpdateVariables) =>
      Category.update(`${API_ENDPOINTS.CATEGORIES}/${id}`, input),
    {
      onSuccess: () => {
        toast.success("Atualizado com sucesso!");
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.CATEGORIES);
      },
    }
  );
};
