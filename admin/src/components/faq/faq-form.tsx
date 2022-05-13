import Input from "@components/ui/input";
import { useForm } from "react-hook-form";
import Button from "@components/ui/button";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import { useRouter } from "next/router";
import { getErrorMessage } from "@utils/form-error";
import { useCreateFaqMutation } from "@data/faq/use-faq-create.mutation";
import { useUpdateFaqMutation } from "@data/faq/use-faq-update.mutation";
import { Faq } from "@ts-types/generated";
import TextArea from "@components/ui/text-area";

type FormValues = {
  title?: string | null;
  description?: string | null;
};

type IProps = {
  initialValues?: Faq | null;
};
export default function CreateOrUpdateFaqForm({ initialValues }: IProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
    },
  });
  const {
    mutate: createFaq,
    isLoading: creating,
  } = useCreateFaqMutation();
  const {
    mutate: updateFaq,
    isLoading: updating,
  } = useUpdateFaqMutation();
  const onSubmit = async (values: FormValues) => {
    try {
      if (!initialValues) {
        createFaq({
          variables: {
            input: { 
              title: values.title!,
              description: values.description!,
              status: "1",
            },
          },
        });
      } else {
        updateFaq({
          variables: {
            id: initialValues?.id!,
            input: { 
              title: values.title!,
              description: values.description!,
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
          } uma Pergunta Frequente aqui
          `}
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label="Titulo"
            {...register("title", { required: "Título é obrigatório" })}
            error={errors.title?.message}
            variant="outline"
            className="mb-5"
          />
           <TextArea
            label="Texto"
            {...register("description")}
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
          {initialValues ? "Atualizar" : "Adicionar"} FAQ
        </Button>
      </div>
    </form>
  );
}
