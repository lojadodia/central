import Input from "@components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "@components/ui/date-picker";
import Button from "@components/ui/button";
import TextArea from "@components/ui/text-area";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import Label from "@components/ui/label";
import { useRouter } from "next/router";
import ValidationError from "@components/ui/form-validation-error";
import { useSettings } from "@contexts/settings.context";
import { AttachmentInput, Coupon, CouponType, CouponTypeDescription } from "@ts-types/generated";
import { useCreateCouponMutation } from "@data/coupon/use-coupon-create.mutation";
import { useUpdateCouponMutation } from "@data/coupon/use-coupon-update.mutation";
import FileInput from "@components/ui/file-input";
import { yupResolver } from "@hookform/resolvers/yup";
import { couponValidationSchema } from "./coupon-validation-schema";
import { useProductsQuery } from "@data/product/products.query";

import { useState } from "react";
type FormValues = {
  code: string;
  type: CouponType;
  description: string;
  amount: number;
  image: AttachmentInput;
  active_from: string;
  expire_at: string;
  product: string;
  frequency: boolean;
  takeaway: boolean;
  delivery: boolean;
};

const defaultValues = {
  image: "",
  amount: 0,
  active_from: new Date(),
  expire_at: new Date(),
  product: undefined
};

type IProps = {
  initialValues?: Coupon | null;
};
export default function CreateOrUpdateCouponForm({ initialValues }: IProps) {
  const router = useRouter()
  const [productId, setProductId] = useState(initialValues?.product ?? -1)
  const coupons_type = Object.keys(CouponType).filter(ct => isNaN(ct)).map(m => ({
    value: CouponType[m],
    label: m
  }))
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    setError,

    formState: { errors },
  } = useForm<FormValues>({
    // @ts-ignore
    defaultValues: initialValues
      ? {
        ...initialValues,
        active_from: new Date(initialValues.active_from!),
        expire_at: new Date(initialValues.expire_at!),
      }
      : defaultValues,
    resolver: yupResolver(couponValidationSchema),
  });


  const { currency } = useSettings();
  const {
    mutate: createCoupon,
    isLoading: creating,
  } = useCreateCouponMutation();
  const {
    mutate: updateCoupon,
    isLoading: updating,
  } = useUpdateCouponMutation();

  const [active_from, expire_at] = watch(["active_from", "expire_at"]);
  let couponType = watch("type");

  const { data } = useProductsQuery({
    limit: 999,
    // type: type.slug,
  });
  const products = data && data.products.data



  if (typeof couponType === "string") {
    couponType = coupons_type.find(ct => ct.value.toString() === couponType.toString())
  }
  const onSubmit = async (values: FormValues) => {

    const input = {
      takeaway: values.takeaway,
      delivery: values.delivery,
      frequency: values.frequency,
      code: values.code,
      type: values.type,
      description: values.description,
      amount: values.amount,
      active_from: new Date(values.active_from),
      expire_at: new Date(values.expire_at),
      image: {
        thumbnail: values?.image?.thumbnail,
        original: values?.image?.original,
        id: values?.image?.id,
      },
    };
    if (values?.product) {
      input.product = values.product
    }

    if (initialValues) {
      updateCoupon(
        {
          variables: {
            id: initialValues.id!,
            input,
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
      createCoupon(
        {
          variables: {
            input,
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
  0

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap pb-8 border-b border-dashed border-gray-300 my-5 sm:my-8">
        <Description
          title="Tipo de Promoção"
          details="Selecione o tipo da sua promoção"
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">

          <select
            disabled={!!initialValues}
            className="px-4 h-12 border bg-white flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none border border-gray-300 focus:border-primary"
            {...register("type")}
            defaultValue={initialValues?.type}
          >
            {coupons_type?.map(option => (<option value={option.value}>{CouponTypeDescription[option.label] || ""}</option>))}
          </select>

          <div className="pt-3">
            {
              (couponType?.value === CouponType.FixedCoupon || couponType?.value === CouponType.PercentageCoupon
                || couponType?.value === CouponType.OfferProductCoupon) &&
              (<>
                <div className="flex items-center">
                  <input type="checkbox"
                    id="delivery"
                    {...register("delivery")}
                    defaultChecked={initialValues?.delivery}

                  />
                  <label htmlFor="delivery" className="pl-2 text-sm">Entrega</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox"
                    id="takeaway"
                    {...register("takeaway")}
                    defaultChecked={initialValues?.takeaway}
                  />
                  <label htmlFor="takeaway" className="pl-2 text-sm">Takeaway</label>
                </div>
              </>)
            }
            {
              couponType?.value === CouponType.OfferProductCoupon &&
              (<div className="flex items-center">
                <input type="checkbox"
                  className="leading-5"
                  id="frequency"
                  {...register("frequency")}
                  defaultChecked={initialValues?.frequency}

                />
                <label htmlFor="frequency" className="pl-2 text-sm">A cada X valor</label>
              </div>)
            }

          </div>

        </Card>
      </div>
      <div className="flex flex-wrap pb-8 border-b border-dashed border-gray-300 my-5 sm:my-8">
        <Description
          title="Imagem"
          details="Carregue sua imagem de cupom aqui"
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="image" control={control} multiple={false} />
        </Card>
      </div>

      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title="Descrição"
          details={`${initialValues ? "Editar" : "Adicionar"
            } a descrição do cupom e as informações necessárias aqui`}
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">

          <Input
            label={couponType?.value == CouponType.OfferProductCoupon ? "Titulo da Oferta" : "Código"}
            {...register("code")}
            error={errors.code?.message}
            variant="outline"
            className="mb-5"
          />


          {couponType?.value == CouponType.OfferProductCoupon && (
            <>
              <Label>Selecione o produto</Label>
              <select
                {...register("product")}
                value={productId}
                onChange={(e) => {
                  setProductId(e.target.value)
                  setValue("product", e.target.value)
                }}
                className="px-4 h-12 mb-5 bg-white flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none border border-gray-300 focus:border-primary"

              >
                {products?.map(p => (<option value={p.id} key={p.id}>{p.name}</option>))}
              </select>
            </>
          )}



          <TextArea
            label="Descrição"
            {...register("description")}
            error={errors.description?.message}
            variant="outline"
            className="mb-5"
          />
          {couponType?.value !== CouponType.FreeShippingCoupon && (
            <Input
              label={(couponType?.value == CouponType.OfferProductCoupon ? "Montante Minimo " : "Montante ") + `(${currency})`}
              {...register("amount", { required: true, min: 1 })}
              type="number"
              error={errors.amount?.message}
              variant="outline"
              className="mb-5"
            />
          )}
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-1/2 p-0 sm:pr-2 mb-5 sm:mb-0">
              <Label>Ativo de</Label>

              <Controller
                control={control}
                name="active_from"
                rules={{ required: "A data de início é obrigatória" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  //@ts-ignore
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    onChange={onChange}
                    onBlur={onBlur}
                    selected={value}
                    selectsStart
                    minDate={new Date()}
                    maxDate={expire_at}
                    startDate={active_from}
                    endDate={expire_at}
                    className="border border-gray-300"
                  />
                )}
              />
              <ValidationError message={errors.active_from?.message} />
            </div>
            <div className="w-full sm:w-1/2 p-0 sm:pl-2">
              <Label>Expira em</Label>

              <Controller
                control={control}
                name="expire_at"
                rules={{ required: "A data de expiração é obrigatória" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  //@ts-ignore
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    onChange={onChange}
                    onBlur={onBlur}
                    selected={value}
                    selectsEnd
                    startDate={active_from}
                    endDate={expire_at}
                    minDate={active_from}
                    className="border border-gray-300"
                  />
                )}
              />
              <ValidationError message={errors.expire_at?.message} />
            </div>
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

        <Button loading={updating || creating}>
          {initialValues ? "Atualizar Cupom" : "Adicionar Cupom"}
        </Button>
      </div>
    </form>
  );
}
