import Button from "@components/ui/button";
import Input from "@components/ui/input";
import PasswordInput from "@components/ui/password-input";
import { useForm } from "react-hook-form";
import Card from "@components/common/card";
import Description from "@components/ui/description";
import { useCreateUserMutation } from "@data/user/use-user-create.mutation";
import { yupResolver } from "@hookform/resolvers/yup";
import { customerValidationSchema } from "./customer-validation-schema";
import Label from "@components/ui/label";
import Radio from "@components/ui/radio/radio";

type FormValues = {
  name: string;
  email: string;
  contact: string;
  password: string;
  permission: string;
  permissionType: string;
};
const defaultValues = {
  permissionType: "client",
  email: "",
  password: "",
};

const CustomerCreateForm = () => {
  const { mutate: registerUser, isLoading: loading } = useCreateUserMutation();

  const {
    register,
    watch,
    handleSubmit,
    setError,

    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(customerValidationSchema),
  });
  const permissionType = watch("permissionType");

  async function onSubmit({ name, email, contact, permission, password }: FormValues) {
    registerUser(
      {
        variables: {
          name,
          permission,
          contact,
          email,
          password,
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
      }
    );
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title="Informação"
          details="Adicione suas informações de cliente e crie um novo cliente a partir daqui"
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label="Nome"
            {...register("name")}
            type="text"
            variant="outline"
            className="mb-4"
            error={errors.name?.message}
          />
          <Input
            label="Email"
            {...register("email")}
            type="email"
            variant="outline"
            className="mb-4"
            error={errors.email?.message}
          />
          <Input
            label="Contato"
            {...register("contact")}
            type="text"
            variant="outline"
            className="mb-4"
            error={errors.contact?.message}
          />
          <PasswordInput
            label="Password"
            {...register("password")}
            error={errors.password?.message}
            variant="outline"
            className="mb-4"
          />
           <div className="mb-5 mt-5">
            <Label>Tipo de Utilizador</Label>
            <Radio
              label="Cliente (Padrão)"
              {...register("permissionType")}
              value="client"
             
              id="client"
              className="mb-2"
            />
            <Radio
              label="Funcionário"
              {...register("permissionType")}
              value="employer"
              id="employer"
              className="mb-2"
            />
       
     
          </div>
          {(permissionType === "employer") && (

          <div className="mb-5 mt-5">
            <Label>DEPARTAMENTO</Label>
            <Radio
              label="Geral"
              {...register("permission")}
              value="super_admin"
              id="super_admin"
              className="mb-2"
            />
            <Radio
              label="Administração"
              {...register("permission")}
              value="admin"
              id="admin"
              className="mb-2"
            />
            <Radio
              label="Faturação"
              {...register("permission")}
              value="billing"
              id="billing"
              className="mb-2"
            />
             <Radio
              label="Estoque (Stock)"
              {...register("permission")}
              value="stock"
              id="stock"
              className="mb-2"
            />
            <Radio
              label="Logística"
              {...register("permission")}
              value="logistics"
              id="logistics"
              className="mb-2"
            />
          </div>
          )}
        </Card>
      </div>

      <div className="mb-4 text-right">
        <Button loading={loading} disabled={loading}>
        Criar Cliente
        </Button>
      </div>
    </form>
  );
};

export default CustomerCreateForm;
