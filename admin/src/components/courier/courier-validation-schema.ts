import * as yup from "yup";
export const courierValidationSchema = yup.object().shape({
  title: yup.string().required("Titulo is required"),
});
