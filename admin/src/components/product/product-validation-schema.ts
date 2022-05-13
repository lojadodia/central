import { ProductType } from "@ts-types/generated";
import * as yup from "yup";

export const productValidationSchema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  productTypeValue: yup.object().required("Tipo de produto é obrigatório"),
  /*sku: yup.mixed().when("productTypeValue", {
    is: (productType: {
      name: string;
      value: string;
      [key: string]: unknown;
    }) => productType?.value === ProductType.Simple,
    then: yup.string().nullable().required("SKU é obrigatório"),
  }),*/
  price: yup.mixed().when("productTypeValue", {
    is: (productType: {
      name: string;
      value: string;
      [key: string]: unknown;
    }) => productType?.value === ProductType.Simple,
    then: yup
      .number()
      .typeError("Preço deve ser um número")
      //.positive("Preço deve ser positivo")
      .required("Preço é obrigatório"),
  }),
  sale_price: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .lessThan(yup.ref("Preço"), "Preço de venda deve ser menor que ${less}")
    .positive("Preço de venda deve ser positivo"),
  quantity: yup.mixed().when("productTypeValue", {
    is: (productType: {
      name: string;
      value: string;
      [key: string]: unknown;
    }) => productType?.value === ProductType.Simple,
    then: yup
      .number()
      .typeError("Quantidade deve ser um número")
      .positive("Quantidade deve ser positivo")
      .integer("Quantidade deve ser inteiro")
      .required("Quantidade é obrigatório"),
  }),
  //unit: yup.string().required("Unid é obrigatório"),
  type: yup.object().nullable().required("Tipo é obrigatório"),
  status: yup.string().required("Status é obrigatório"),
  variation_options: yup.array().of(
    yup.object().shape({
      price: yup
        .number()
        .typeError("Preço deve ser um número")
        //.positive("Preço deve ser positivo")
        .required("Preço é obrigatório"),
      sale_price: yup
        .number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .lessThan(yup.ref("Preço"), "Preço de venda deve ser menor que ${less}")
        .positive("Preço de venda deve ser positivo"),
      quantity: yup
        .number()
        .typeError("Quantidade deve ser um número")
        .positive("Quantidade deve ser positivo")
        .integer("Quantidade deve ser inteiro")
        .required("Quantidade é obrigatório"),
      //sku: yup.string().required("SKU é obrigatório"),
    })
  ),
});
