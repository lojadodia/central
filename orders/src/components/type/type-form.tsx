import Input from "@components/ui/input";
import { useForm } from "react-hook-form";
import Button from "@components/ui/button";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import { useRouter } from "next/router";
import { getIcon } from "@utils/get-icon";
import Label from "@components/ui/label";
import * as typeIcons from "@components/icons/type";
import { Type } from "@ts-types/generated";
import { useCreateTypeMutation } from "@data/type/use-type-create.mutation";
import { useUpdateTypeMutation } from "@data/type/use-type-update.mutation";
import { typeIconList } from "./type-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { typeValidationSchema } from "./type-validation-schema";
import SelectInput from "@components/ui/select-input";

export const updatedIcons = typeIconList.map((item: any) => {
  item.label = (
    <div className="flex space-x-5 items-center">
      <span className="flex w-5 h-5 items-center justify-center">
        {getIcon({
          iconList: typeIcons,
          iconName: item.value,
          className: "max-h-full max-w-full",
        })}
      </span>
      <span>{item.label}</span>
    </div>
  );
  return item;
});

type FormValues = {
  name?: string | null;
  icon?: any;
};

type IProps = {
  initialValues?: Type | null;
};
export default function CreateOrUpdateTypeForm({ initialValues }: IProps) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,

    formState: { errors },
  } = useForm<FormValues>({
    shouldUnregister: true,
    resolver: yupResolver(typeValidationSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      icon: initialValues?.icon
        ? typeIconList.find(
            (singleIcon) => singleIcon.value === initialValues?.icon!
          )
        : "",
    },
  });
  const { mutate: createType, isLoading: creating } = useCreateTypeMutation();
  const { mutate: updateType, isLoading: updating } = useUpdateTypeMutation();
  const onSubmit = async (values: FormValues) => {
    if (!initialValues) {
      createType({
        variables: {
          input: { name: values.name!, icon: values.icon?.value ?? "" },
        },
      });
    } else {
      updateType({
        variables: {
          id: initialValues.id!,
          input: { name: values.name!, icon: values.icon?.value ?? "" },
        },
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title="Descrição"
          details={`${
            initialValues ? "Atualize" : "Adicione"
          } sua descrição de tipo e necessário
          informação daqui`}
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

          <div className="mb-5">
            <Label>Selecionar Icon</Label>
            <SelectInput
              name="icon"
              control={control}
              options={updatedIcons}
              isClearable={true}
            />
          </div>
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
          {initialValues ? "Atualizar" : "Adicionar"} Tipo
        </Button>
      </div>
    </form>
  );
}
