import LoginForm from "@components/auth/login-form";
import Logo from "@components/ui/logo";
import { SUPER_ADMIN } from "@utils/constants";
import { GetServerSideProps } from "next";
import { parseContextCookie } from "@utils/parse-cookie";
import { ROUTES } from "@utils/routes";

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const cookies = parseContextCookie(context?.req?.headers?.cookie);
  if (cookies?.auth_token) {
    if (cookies?.auth_permissions?.includes(SUPER_ADMIN)) {
      return {
        redirect: { destination: ROUTES.ORDERS, permanent: false },
      };
    }
  }
  return {
    props: {},
  };
};

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-black  sm:bg-gray-100 dark:bg-black ">
      <div className="m-auto max-w-sm w-full bg-dark-primary  border border-b  border-dark-primary   sm:shadow p-5 sm:p-8 rounded">
        <div className="flex justify-center mb-2">
          <Logo />  
        </div>
        <h3 className="text-center text-base italic text-gray-500 mb-6 mt-4">
        Login para admin
        </h3>
        <LoginForm /> 
      </div>
    </div>
  );
}
