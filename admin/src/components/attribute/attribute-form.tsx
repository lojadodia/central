import Input from "@components/ui/input";
import { useForm } from "react-hook-form";
import Button from "@components/ui/button";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import { useRouter } from "next/router";
import { getErrorMessage } from "@utils/form-error";
import { useCreateAttributeMutation } from "@data/attributes/use-attribute-create.mutation";
import { useUpdateAttributeMutation } from "@data/attributes/use-attribute-update.mutation";
import { Attribute } from "@ts-types/generated";

type FormValues = {
  name?: string | null;
};

type IProps = {
  initialValues?: Attribute | null;
};
export default function CreateOrUpdateAttributeForm({ initialValues }: IProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: initialValues?.name ?? "",
    },
  });
  const {
    mutate: createAttribute,
    isLoading: creating,
  } = useCreateAttributeMutation();
  const {
    mutate: updateAttribute,
    isLoading: updating,
  } = useUpdateAttributeMutation();
  const onSubmit = async (values: FormValues) => {
    try {
      if (!initialValues) {
        createAttribute({
          variables: {
            input: { name: values.name! },
          },
        });
      } else {
        updateAttribute({
          variables: {
            id: initialValues?.id!,
            input: { name: values.name! },
          },
        });
      }
    } catch (error) {
      getErrorMessage(error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title="Descrição"
          details={`${
            initialValues ? "Atualizar" : "Adicionar"
          } um extra para anexar a um produto
          informação daqui`}
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label="Nome"
            {...register("name", { required: "Nome é obrigatório" })}
            error={errors.name?.message}
            variant="outline"
            className="mb-5"
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
          {initialValues ? "Atualizar" : "Adicionar"} extra
        </Button>
      </div>
    </form>
  );
}
