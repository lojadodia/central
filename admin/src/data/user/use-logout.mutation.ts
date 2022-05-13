import { useMutation } from "react-query";
import User from "@repositories/user";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export const useLogoutMutation = () => {
  const router = useRouter();

  return useMutation(() => User.logout(API_ENDPOINTS.LOGOUT), {
    onSuccess: () => {
      Cookies.remove("auth_token");
      Cookies.remove("auth_permissions");
      router.push("/");
    },
  });
};
