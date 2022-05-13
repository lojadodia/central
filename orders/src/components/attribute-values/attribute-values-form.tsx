import Input from "@components/ui/input";
import { useForm } from "react-hook-form";
import Button from "@components/ui/button";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import { useRouter } from "next/router";
import { getErrorMessage } from "@utils/form-error";
import Loader from "@components/ui/loader/loader";
import ErrorMessage from "@components/ui/error-message";
import Label from "@components/ui/label";
import ValidationError from "@components/ui/form-validation-error";
import SelectInput from "@components/ui/select-input";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAttributesQuery } from "@data/attributes/use-attributes.query";
import { useCreateAttributeValueMutation } from "@data/attribute-value/use-attribute-create.mutation";
import { useUpdateAttributeValueMutation } from "@data/attribute-value/use-attribute-update.mutation";
import { Attribute, AttributeValue } from "@ts-types/generated";

type FormValues = {
  value?: string | null;
  meta?: string | null;
  attribute?: Attribute;
  sync_price?: number | null;
};

const defaultValues = {
  value: "",
  meta: "",
  attribute: "",
  sync_price: 0.0
};

type IProps = {
  initialValues?: AttributeValue | null;
};
const validationSchema = yup.object().shape({
  value: yup.string().required("Nome é obrigatório"),
  attribute: yup.object().nullable().required("O extra é obrigatório"),
});
export default function CreateOrUpdateAttributeValueForm({
  initialValues,
}: IProps) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,

    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    // @ts-ignore
    defaultValues: initialValues ? initialValues : defaultValues,
  });
  const { data, isLoading: loading, error } = useAttributesQuery();

  const {
    mutate: createAttributeValue,
    isLoading: creating,
  } = useCreateAttributeValueMutation();
  const {
    mutate: updateAttributeValue,
    isLoading: updating,
  } = useUpdateAttributeValueMutation();
  const onSubmit = async (values: FormValues) => {
    try {
      if (!initialValues) {
        createAttributeValue({
          variables: {
            input: {
              value: values.value!,
              meta: values.meta!,
              attribute_id: values?.attribute?.id!,
              sync_price: values.sync_price!
            },
          },
        });
      } else {
        updateAttributeValue({
          variables: {
            id: initialValues.id!,
            input: {
              value: values.value!,
              meta: values.meta!,
              attribute_id: values?.attribute?.id!,
              sync_price: values.sync_price!
            },
          },
        });
      }
    } catch (err) {
      getErrorMessage(err);
    }
  };
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title="Descrição"
          details={`${
            initialValues ? "Atualizar" : "Adicionar"
          } your attribute value and necessary
          information from here`}
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5">
            <Label>Extra</Label>
            <SelectInput
              name="attribute"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={data?.attributes! as any}
              isLoading={loading}
            />
            <ValidationError message={(errors?.attribute as any)?.message} />
          </div>
          <Input
            label="Nome"
            //@ts-ignore
            {...register("value")}
            error={errors.value?.message}
            variant="outline"
            className="mb-5"
          />
          <Input
            label="Meta"
            {...register("meta")}
            variant="outline"
            className="mb-5"
          />
          <Input
          label="Preço"
          {...register("sync_price")}
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
          {initialValues ? "Atualizar" : "Adicionar"} opção de extra
        </Button>
      </div>
    </form>
  );
}
