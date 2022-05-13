import * as yup from "yup";
export const orderStatusValidationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  serial: yup
    .number()
    .typeError("O número de série deve ser")
    .positive("O número de série deve ser positivo")
    .integer("O número de série deve ser inteiro")
    .required("O número de série é necessário"),
  color: yup.string().required("Cor é necessária"),
});
