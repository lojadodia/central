import { CreateTypeInput } from "@ts-types/generated";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import Type from "@repositories/type";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export interface ITypeUpdateVariables {
  variables: {
    id: string;
    input: CreateTypeInput;
  };
}

export const useUpdateTypeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ variables: { id, input } }: ITypeUpdateVariables) =>
      Type.update(`${API_ENDPOINTS.TYPES}/${id}`, input),
    {
      onSuccess: () => {
        toast.success("Atualizado com sucesso!");
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.TYPES);
      },
    }
  );
};
