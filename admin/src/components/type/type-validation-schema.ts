import * as yup from "yup";
export const typeValidationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
});
