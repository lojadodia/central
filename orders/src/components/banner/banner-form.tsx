import Input from "@components/ui/input";
import { useForm } from "react-hook-form";
import Button from "@components/ui/button";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import { useRouter } from "next/router";
import { getErrorMessage } from "@utils/form-error";
import { useCreateBannerMutation } from "@data/banner/use-banner-create.mutation";
import { useUpdateBannerMutation } from "@data/banner/use-banner-update.mutation";
import { Banner } from "@ts-types/generated";
import Label from "@components/ui/label";
import Radio from "@components/ui/radio/radio";
import FileInput from "@components/ui/file-input";
type FormValues = {
  mode?: string | null;
  link?: string | null;
  image?: any;
};

type IProps = {
  initialValues?: Banner | null;
};
export default function CreateOrUpdateBannerForm({ initialValues }: IProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      mode: initialValues?.mode ?? "_self",
      link: initialValues?.link ?? "",
      image: [],
    },
  });
  const {
    mutate: createBanner,
    isLoading: creating,
  } = useCreateBannerMutation();
  const {
    mutate: updateBanner,
    isLoading: updating,
  } = useUpdateBannerMutation();
  const onSubmit = async (values: FormValues) => {
    try {
      if (!initialValues) {
        createBanner({
          variables: {
            input: { 
              mode: values.mode!,
              link: values.link!,
              image: values?.image?.original,
              status: "1",
            },
          },
        });
      } else {
        updateBanner({
          variables: {
            id: initialValues?.id!,
            input: { 
              mode: values.mode!,
              link: values.link!,
              image: values?.image?.original,
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
            label="URL"
            {...register("link", { required: "URL é obrigatório" })}
            error={errors.link?.message}
            variant="outline"
            className="mb-5"
          />

            <FileInput name="image" control={control} multiple={false} />
            <div className="mb-5 mt-5">
          <Label>Comportamento da Ligação</Label>
          </div>
          <Radio
              label="Abrir no mesmo Separador (Padrão)"
              {...register("mode")}
              id="same"
              value="_self"
              className="mb-2"
            />
            <Radio
              label="Abrir num novo Separador"
              {...register("mode")}
              id="new"
              value="_blank"
              className="mb-4"
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
          {initialValues ? "Atualizar" : "Adicionar"} Banner
        </Button>
      </div>
    </form>
  );
}
