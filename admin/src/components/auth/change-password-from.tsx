import { useForm } from "react-hook-form";
import Button from "@components/ui/button";
import Card from "@components/common/card";
import Description from "@components/ui/description";
import { toast } from "react-toastify";
import PasswordInput from "@components/ui/password-input";
import { useChangePasswordMutation } from "@data/user/use-change-password.mutation";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface FormValues {
  oldPassword: string;
  newPassword: string;
  passwordConfirmation: string;
}

const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required(),
  newPassword: yup.string().required(),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Senhas incompatíveis")
    .required("Por favor, confirme sua senha"),
});

const ChangePasswordForm = () => {
  const {
    mutate: changePassword,
    isLoading: loading,
  } = useChangePasswordMutation();
  const {
    register,
    handleSubmit,
    setError,
    reset,

    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(changePasswordSchema),
  });

  async function onSubmit(values: FormValues) {
    changePassword(
      {
        variables: {
          input: {
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
          },
        },
      },
      {
        onError: (error: any) => {
          Object.keys(error?.response?.data).forEach((field: any) => {
            setError(field, {
              type: "manual",
              message: error?.response?.data[field][0],
            });
          });
        },
        onSuccess: ({ data }) => {
          if (!data?.success) {
            setError("oldPassword", {
              type: "manual",
              message: data?.message ?? "",
            });
          } else if (data?.success) {
            toast.success("Alterou sua senha com sucesso!");
            reset();
          }
        },
      }
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title="Password"
          details="Atualize a sua password aqui"
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3 mb-5">
          <PasswordInput
            label="Password Antiga"
            {...register("oldPassword")}
            variant="outline"
            error={errors.oldPassword?.message}
            className="mb-5"
          />
          <PasswordInput
            label="Nova Password"
            {...register("newPassword")}
            variant="outline"
            error={errors.newPassword?.message}
            className="mb-5"
          />
          <PasswordInput
            label="Confirme a Password"
            {...register("passwordConfirmation")}
            variant="outline"
            error={errors.passwordConfirmation?.message}
          />
        </Card>

        <div className="w-full text-right">
          <Button loading={loading} disabled={loading}>
          Alterar a senha
          </Button>
        </div>
      </div>
    </form>
  );
};
export default ChangePasswordForm;
