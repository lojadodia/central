import * as yup from "yup";
export const bannerValidationSchema = yup.object().shape({
  link: yup.string().required("URL is required"),
});
