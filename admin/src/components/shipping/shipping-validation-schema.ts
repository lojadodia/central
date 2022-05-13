import { ShippingType } from "@ts-types/generated";
import * as yup from "yup";
export const shippingValidationSchema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  type: yup.string().required("Tipo é obrigatório"),
  amount: yup.mixed().when("type", {
    is: (value: string) => value !== ShippingType.Free,
    then: yup
      .number()
      .typeError("Montante deve ser número")
      .required("Montante é obrigatório"),
  }),
});
