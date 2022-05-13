import Input from "@components/ui/input";
import { useForm } from "react-hook-form";
import Button from "@components/ui/button";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import { useRouter } from "next/router";
import { getErrorMessage } from "@utils/form-error";
import { useCreateCourierMutation } from "@data/courier/use-courier-create.mutation";
import { useUpdateCourierMutation } from "@data/courier/use-courier-update.mutation";
import { Courier } from "@ts-types/generated";
import TextArea from "@components/ui/text-area";
import FileInput from "@components/ui/file-input";

type FormValues = {
  name?: string | null;
  phone?: string | null;
  image?: any;
};

type IProps = {
  initialValues?: Courier | null;
};
export default function CreateOrUpdateCourierForm({ initialValues }: IProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: initialValues?.name ?? "",
      phone: initialValues?.phone ?? "",
    },
  });
  const {
    mutate: createCourier,
    isLoading: creating,
  } = useCreateCourierMutation();
  const {
    mutate: updateCourier,
    isLoading: updating,
  } = useUpdateCourierMutation();
  const onSubmit = async (values: FormValues) => {
    try {
      if (!initialValues) {
        createCourier({
          variables: {
            input: { 
              name: values.name!,
              phone: values.phone!,
              image: values?.image?.thumbnail,
              status: "1",
            },
          },
        });
      } else {
        updateCourier({
          variables: {
            id: initialValues?.id!,
            input: { 
              name: values.name!,
              phone: values.phone!,
              image: values?.image?.thumbnail,
              status: "1"
            },
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
          } um Estafeta.
          `}
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
        <FileInput name="image" control={control} multiple={false} />
          <Input
            label="Nome"
            {...register("name", { required: "Nome é obrigatório" })}
            error={errors.name?.message}
            variant="outline"
            className="mb-5 mt-5"
          />
           <Input
            label="Contato"
            {...register("phone", { required: "Contato é obrigatório" })}
            error={errors.phone?.message}
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
          {initialValues ? "Atualizar" : "Adicionar"} Estafeta
        </Button>
      </div>
    </form>
  );
}
