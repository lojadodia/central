import React, { useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { useRegisterMutation } from "@data/auth/use-register.mutation";
import Alert from "@components/ui/alert";
import Input from "@components/ui/input";
import Button from "@components/ui/button";
import { useUI } from "@contexts/ui.context";
import { CUSTOMER, SUPER_ADMIN } from "@utils/constants";
import { useCheckout } from "@contexts/checkout.context";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type FormValues = {
  name: string;
  contact: string;
};

const registerFormSchema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  contact: yup.string().min(9, "Digite 9 caracteres").required("Contato é obrigatório")
});

const defaultValues = {
  name: "",
  contact: "",
};

const RegisterForm = () => {
  const { updateClient } = useCheckout();
  const { mutate, isLoading: loading } = useRegisterMutation();
  const [errorMsg, setErrorMsg] = useState("");
  const {
    register,
    handleSubmit,
    setError,

    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(registerFormSchema),
  });
  const router = useRouter();
  const { authorize, closeModal, setModalView } = useUI();
  function handleNavigate(path: string) {
    router.push(`/${path}`);
    closeModal();
  }
  function onSubmit({ name, contact }: FormValues) {
    mutate(
      {
        name,
        contact,
      },
      {
        onSuccess: (data) => {
          if(data?.id){
            updateClient(data);
            closeModal();
          }
        },
        onError: (error) => {
          console.log(error)
        },
      }
    );
  }
  return (
    <div className="py-6 px-5 sm:p-8 bg-white dark:bg-neutral-800 rounded-lg w-screen md:max-w-md h-screen md:h-auto flex flex-col justify-center  dark:border-neutral-700 border">
 <h1 className="text-heading dark:text-white font-semibold text-lg text-center mb-5 ">
       Novo Cliente
      </h1>
      
      {errorMsg && (
        <Alert
          variant="error"
          message={errorMsg}
          className="mb-6"
          closeable={true}
          onClose={() => setErrorMsg("")}
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          placeholder="Nome"
          {...register("name")}
          type="text"
          variant="outline"
          className="mb-3"
          error={errors.name?.message}
        />
         <Input
          placeholder="Contato"
          {...register("contact")}
          type="number"
          variant="outline"
          className="mb-2"
          error={errors.contact?.message}
        />

        <div className="mt-5">
          <Button className="w-full h-12 register-button" loading={loading} disabled={loading}>
            REGISTRAR
          </Button>
        </div>
      </form>


    </div>
  );
};

export default RegisterForm;
