import { SettingsInput } from "@ts-types/generated";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import Settings from "@repositories/settings";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { useSettings } from "@contexts/settings.context";

export interface ISettingsUpdateVariables {
  variables: { input: SettingsInput };
}

export const useUpdateSettingsMutation = () => {
  const queryClient = useQueryClient();
  const { updateSettings } = useSettings();

  return useMutation(
    ({ variables: { input } }: ISettingsUpdateVariables) =>
      Settings.create(API_ENDPOINTS.SETTINGS, input),
    {
      onSuccess: ({ data }) => {
        updateSettings(data?.options);
        toast.success("Atualizado com sucesso!");
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.SETTINGS);
      },
    }
  );
};
