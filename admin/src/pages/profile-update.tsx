import Layout from "@components/common/layout";
import ProfileUpdateFrom from "@components/auth/profile-update-form";
import ChangePasswordForm from "@components/auth/change-password-from";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useMeQuery } from "@data/user/use-me.query";

export default function ProfilePage() {
  const { data, isLoading: loading, error } = useMeQuery();
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className="py-5 sm:py-8 flex border-b border-dashed border-gray-300">
        <h1 className="text-lg font-semibold text-heading">Definições de Perfil</h1>
      </div>

      <ProfileUpdateFrom me={data} />
      <ChangePasswordForm />
    </>
  );
}
ProfilePage.Layout = Layout;
