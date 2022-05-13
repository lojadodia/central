import * as yup from "yup";
export const couponValidationSchema = yup.object().shape({
  code: yup.string().required("O código do cupom é obrigatório"),
/*  amount: yup
    .number()
    .typeError("O montante deve ser um número")
    .positive("Montante deve ser positiva")
    .required("Montante é necessário"), */
  expire_at: yup.string().required("Expira em é obrigatório"),
  active_from: yup.string().required("Ativo de é obrigatório"),
});

