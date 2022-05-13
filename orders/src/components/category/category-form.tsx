import Input from "@components/ui/input";
import {
  Control,
  FieldErrors,
  useForm,
  useFormState,
  useWatch,
} from "react-hook-form";
import Button from "@components/ui/button";
import TextArea from "@components/ui/text-area";
import Label from "@components/ui/label";
import Card from "@components/common/card";
import Description from "@components/ui/description";
import * as categoriesIcon from "@components/icons/category";
import { getIcon } from "@utils/get-icon";
import { useRouter } from "next/router";
import ValidationError from "@components/ui/form-validation-error";
import { useEffect } from "react";
import { Category } from "@ts-types/generated";
import { useTypesQuery } from "@data/type/use-types.query";
import { useCategoriesQuery } from "@data/category/use-categories.query";
import { useUpdateCategoryMutation } from "@data/category/use-category-update.mutation";
import { useCreateCategoryMutation } from "@data/category/use-category-create.mutation";
import { categoryIcons } from "./category-icons";
import FileInput from "@components/ui/file-input";
import SelectInput from "@components/ui/select-input";
import { yupResolver } from "@hookform/resolvers/yup";
import { categoryValidationSchema } from "./category-validation-schema";


export const updatedIcons = categoryIcons.map((item: any) => {
  item.label = (
    <div className="flex space-x-5 items-center">
      <span className="flex w-5 h-5 items-center justify-center">
        {getIcon({
          iconList: categoriesIcon,
          iconName: item.value,
          className: "max-h-full max-w-full",
        })}
      </span>
      <span>{item.label}</span>
    </div>
  );
  return item;
});

function SelectTypes({
  control,
  errors,
  ...rest
}: {
  control: Control<FormValues>;
  errors: FieldErrors;
  [key: string]: unknown
}) {
  const { data, isLoading } = useTypesQuery();
  return (
    <div className="mb-5" style={{pointerEvents: 'none'}}>
      <Label>Types</Label>
      <SelectInput
        name="type"
        {...rest}
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.slug}
        getValue={(option: any) => option.slug}
        options={data?.types!}
        isLoading={isLoading}
      />
      <ValidationError message={errors.type?.message} />
    </div>
  );
}

function SelectCategories({
  control,
  setValue,
}: {
  control: Control<FormValues>;
  setValue: any;
}) {
  const type = useWatch({
    control,
    name: "type",
  });
  const { dirtyFields } = useFormState({
    control,
  });
  useEffect(() => {
    if (type?.slug && dirtyFields?.type) {
      setValue("parent", []);
    }
  }, [type?.slug]);
  const { data, isLoading: loading } = useCategoriesQuery({
    limit: 999,
    type: type?.slug,
  });
  return (
    <div>
      <Label>Parent Category</Label>
      <SelectInput
        name="parent"
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        options={data?.categories?.data!}
        isClearable={true}
        isLoading={loading}
      />
    </div>
  );
}

type FormValues = {
  name: string;
  details: string;
  parent: any;
  image: any;
  icon: any;
  type: {id: number, name: string, slug: string};
};

const defaultValues = {
  image: [],
  name: "",
  details: "",
  parent: "",
  icon: "",
  type: { id: 1, name: 'Home', slug: 'home'},
};

type IProps = {
  initialValues?: Category | null;
};
export default function CreateOrUpdateCategoriesForm({
  initialValues,
}: IProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    setValue,

    formState: { errors },
  } = useForm<FormValues>({
    // shouldUnregister: true,
    //@ts-ignore
    defaultValues: initialValues
      ? {
          ...initialValues,
          icon: initialValues?.icon
            ? categoryIcons.find(
                (singleIcon) => singleIcon.value === initialValues?.icon!
              )
            : "",
        }
      : defaultValues,
    resolver: yupResolver(categoryValidationSchema),
  });

  const {
    mutate: createCategory,
    isLoading: creating,
  } = useCreateCategoryMutation();
  const {
    mutate: updateCategory,
    isLoading: updating,
  } = useUpdateCategoryMutation();

  const onSubmit = async (values: FormValues) => {
    const input = {
      name: values.name,
      details: values.details,
      image: {
        thumbnail: values?.image?.thumbnail,
        original: values?.image?.original,
        id: values?.image?.id,
      },
      icon: values.icon?.value || "",
      parent: values.parent?.id,
      type_id: values.type?.id,
    };
    if (initialValues) {
      updateCategory({
        variables: {
          id: initialValues?.id,
          input: {
            ...input,
          },
        },
      });
    } else {
      createCategory({
        variables: {
          input,
        },
      });
    }
  };
  const _type = { name: 'Home', slug: 'home'}
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap pb-8 border-b border-dashed border-gray-300 dark:border-neutral-500 my-5 sm:my-8">
        <Description
          title="Image"
          details="Upload your category image here"
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="image" control={control} multiple={false} />
        </Card>
      </div>

      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title="Descrição"
          details={`${
            initialValues ? "Edit" : "Add"
          } your category details and necessary information from here`}
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label="Nome"
            {...register("name")}
            error={errors.name?.message}
            variant="outline"
            className="mb-5"
          />

          <TextArea
            label="Details"
            {...register("details")}
            error={errors.details?.message}
            variant="outline"
            className="mb-5"
          />

          <div className="mb-5">
            <Label>Select Icon</Label>
            <SelectInput
              name="icon"
              control={control}
              options={updatedIcons}
              isClearable={true}
            />
          </div>
          <div style={{pointerEvents: 'none', visibility: 'hidden', height: 0}}>
            <SelectTypes control={control} errors={errors} />

          </div>
          <SelectCategories control={control} setValue={setValue} />
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
          {initialValues ? "Atualizar Categoria" : "Adicionar Categoria"}
        </Button>
      </div>
    </form>
  );
}
