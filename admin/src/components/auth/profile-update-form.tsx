import Input from "@components/ui/input";
import { useForm } from "react-hook-form";
import Button from "@components/ui/button";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import { useUpdateUserMutation } from "@data/user/use-user-update.mutation";
import TextArea from "@components/ui/text-area";
import FileInput from "@components/ui/file-input";
import pick from "lodash/pick";

type FormValues = {
  name: string;
  profile: {
    id: string;
    bio: string;
    contact: string;
    avatar: {
      thumbnail: string;
      original: string;
      id: string;
    };
  };
};

export default function ProfileUpdate({ me }: any) {
  const { mutate: updateUser, isLoading: loading } = useUpdateUserMutation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      ...(me &&
        pick(me, ["name", "profile.bio", "profile.contact", "profile.avatar"])),
    },
  });

  async function onSubmit(values: FormValues) {
    const { name, profile } = values;
    updateUser({
      variables: {
        id: me?.id,
        input: {
          name: name,
          profile: {
            id: me?.profile?.id,
            bio: profile?.bio,
            contact: profile?.contact,
            avatar: {
              thumbnail: profile?.avatar?.thumbnail,
              original: profile?.avatar?.original,
              id: profile?.avatar?.id,
            },
          },
        },
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap pb-8 border-b border-dashed border-gray-300 my-5 sm:my-8">
        <Description
          title="Avatar"
          details="Envie sua imagem de perfil a partir daqui. A dimensão do avatar deve ser 45 x 45 px"
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <FileInput name="profile.avatar" control={control} multiple={false} />
        </Card>
      </div>

      <div className="flex flex-wrap pb-8 border-b border-dashed border-gray-300 my-5 sm:my-8">
        <Description
          title="Informações"
          details="Adicione as informações do seu perfil a partir daqui"
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3 mb-5">
          <Input
            label="Nome"
            {...register("name")}
            error={errors.name?.message}
            variant="outline"
            className="mb-5"
          />

          <TextArea
            label="Bio"
            {...register("profile.bio")}
            error={errors.name?.message}
            variant="outline"
            className="mb-6"
          />
          <Input
            label="Contato"
            {...register("profile.contact")}
            error={errors.name?.message}
            variant="outline"
            className="mb-5"
          />
        </Card>

        <div className="w-full text-right">
          <Button loading={loading} disabled={loading}>
            Guarda
          </Button>
        </div>
      </div>
    </form>
  );
}
