import Alert from "@components/ui/alert";
import Button from "@components/ui/button";
import Input from "@components/ui/input";
import PasswordInput from "@components/ui/password-input";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { SUPER_ADMIN } from "@utils/constants";
import { ROUTES } from "@utils/routes";
import { useLoginMutation } from "@data/user/use-login.mutation";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type FormValues = {
  email: string;
  password: string;
};
const loginFormSchema = yup.object().shape({
  email: yup.string().email("Email is not valid").required("Email is required"),
  password: yup.string().required("Password is required"),
});
const defaultValues = {
  email: "",
  password: "",
};
const LoginForm = () => {
  const { mutate: login, isLoading: loading } = useLoginMutation();
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(loginFormSchema),
  });
  const router = useRouter();

  async function onSubmit({ email, password }: FormValues) {
    login(
      {
        variables: {
          email,
          password,
        },
      },
      {
        onSuccess: ({ data }) => {
          if (data?.token) {
            if (
              data?.permissions?.length &&
              data?.permissions.includes(SUPER_ADMIN)
            ) {
              Cookies.set("auth_token", data?.token);
              Cookies.set("auth_permissions", data?.permissions);
              router.push(ROUTES.DASHBOARD);
            } else {
              setErrorMsg("Não tem permissão suficiente");
            }
          } else {
            setErrorMsg("As credenciais estavam erradas!");
          }
        },
      }
    );
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Email"
          {...register("email")}
          type="email"
          variant="outline"
          className="mb-4"
          error={errors?.email?.message}
        />
        <PasswordInput
          label="Password"
          {...register("password")}
          error={errors?.password?.message}
          variant="outline"
          className="mb-4"
          forgotPageLink="/forgot-password"
        />
        <Button className="w-full" loading={loading} disabled={loading}>
          Entrar
        </Button>

        {errorMsg ? (
          <Alert
            message={errorMsg}
            variant="error"
            closeable={true}
            className="mt-5"
            onClose={() => setErrorMsg("")}
          />
        ) : null}
      </form>
    </>
  );
};

export default LoginForm;
