import Input from "@components/ui/input";
import { useForm } from "react-hook-form";
import Button from "@components/ui/button";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import { useRouter } from "next/router";
import ColorPicker from "@components/ui/color-picker/color-picker";
import { useCreateOrderStatusMutation } from "@data/order-status/product-create.mutation";
import { useUpdateOrderStatusMutation } from "@data/order-status/product-update.mutation";
import { yupResolver } from "@hookform/resolvers/yup";
import { orderStatusValidationSchema } from "./order-status-validation-schema";

type FormValues = {
  name: string;
  color: string;
  serial: number;
};
const defaultValues = {
  name: "",
  serial: 1,
  color: "#d87b64",
};
export default function CreateOrUpdateOrderStatusForm({ initialValues }: any) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,

    formState: { errors },
  } = useForm<FormValues>({
    shouldUnregister: true,
    resolver: yupResolver(orderStatusValidationSchema),
    defaultValues: initialValues ?? defaultValues,
  });
  const {
    mutate: createOrderStatus,
    isLoading: creating,
  } = useCreateOrderStatusMutation();
  const {
    mutate: updateOrderStatus,
    isLoading: updating,
  } = useUpdateOrderStatusMutation();

  const onSubmit = async (values: FormValues) => {
    if (initialValues) {
      updateOrderStatus(
        {
          variables: {
            id: initialValues.id,
            input: {
              id: initialValues.id,
              name: values.name,
              color: values.color,
              serial: values.serial,
            },
          },
        },
        {
          onError: (error: any) => {
            Object.keys(error?.response?.data).forEach((field: any) => {
              setError(field, {
                type: "manual",
                message: error?.response?.data[field][0],
              });
            });
          },
        }
      );
    } else {
      createOrderStatus(
        {
          variables: {
            input: {
              name: values.name,
              color: values.color,
              serial: values.serial,
            },
          },
        },
        {
          onError: (error: any) => {
            Object.keys(error?.response?.data).forEach((field: any) => {
              setError(field, {
                type: "manual",
                message: error?.response?.data[field][0],
              });
            });
          },
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title="Descrição"
          details={`${initialValues ? "Atualizar" : "Adicionar"} status do pedido aqui`}
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label="Nome"
            {...register("name")}
            error={errors.name?.message}
            variant="outline"
            className="mb-5"
          />

          <Input
            label="Nº Série"
            note="O status do pedido deve seguir (ex: 1-[9])"
            {...register("serial")}
            type="number"
            error={errors.serial?.message}
            variant="outline"
          />
          <ColorPicker
            label="Cor"
            {...register("color")}
            error={errors.color?.message}
            className="mt-5"
          />
        </Card>
      </div>

      <div className="mb-4 text-right">
        {initialValues && (
          <Button
            variant="outline"
            onClick={router.back}
            className="mr-4"
            type="button"
          >
            Voltar
          </Button>
        )}

        <Button loading={creating || updating}>
          {initialValues ? "Atualizar" : "Adicionar"} Status do pedido
        </Button>
      </div>
    </form>
  );
}
