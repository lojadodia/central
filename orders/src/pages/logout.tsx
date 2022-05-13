import { useEffect } from "react";
import { useRouter } from "next/router";
import Loader from "@components/ui/loader/loader";
import { useLogoutMutation } from "@data/user/use-logout.mutation";
function SignOut() {
  const router = useRouter();
  const { mutate: logout } = useLogoutMutation();

  useEffect(() => {
    logout();
  }, [logout, router]);

  return <Loader text="Saindo..." />;
}

export default SignOut;
