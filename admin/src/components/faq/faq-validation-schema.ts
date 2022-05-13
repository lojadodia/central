import * as yup from "yup";
export const faqValidationSchema = yup.object().shape({
  title: yup.string().required("Titulo is required"),
});
