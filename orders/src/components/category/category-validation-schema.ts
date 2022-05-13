import * as yup from "yup";
export const categoryValidationSchema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  type: yup.object().required("Tipo é obrigatório"),
});
