import * as yup from "yup";
export const taxValidationSchema = yup.object().shape({
  name: yup.string().required("Name é obrigatório"),
  rate: yup
    .number()
    .typeError("Taxa deve ser number")
    .positive("Taxa deve ser positive")
    .integer("Taxa deve ser integer")
    .required("Taxa é obrigatório"),
});
