import { CoreApi } from "@utils/api/core.api";
import { API_ENDPOINTS } from "@utils/api/endpoints";
export type LoginInputType = {
  email: string;
  password: string;
};
export type RegisterUserInputType = {
  name: string;
  contact: string;
};

export type ChangePasswordInputType = {
  oldPassword: string;
  newPassword: string;
};
export type ForgetPasswordInputType = {
  email: string;
};
export type ResetPasswordInputType = {
  email: string;
  token: string;
  password: string;
};
export type VerifyPasswordInputType = {
  email: string;
  token: string;
};

class Auth extends CoreApi {
  login(input: LoginInputType) {
    return this.http.post(API_ENDPOINTS.LOGIN, input).then((res) => res.data);
  }
  register(input: RegisterUserInputType) {
    return this.http
      .post(API_ENDPOINTS.NEW_CUSTOMER, input)
      .then((res) => res.data);
  }
  logout() {
    return this.http.post(API_ENDPOINTS.LOGOUT);
  }
  changePassword(input: ChangePasswordInputType) {
    return this.http
      .post(API_ENDPOINTS.CHANGE_PASSWORD, input)
      .then((res) => res.data);
  }
  forgetPassword(input: ForgetPasswordInputType) {
    return this.http
      .post(API_ENDPOINTS.FORGET_PASSWORD, input)
      .then((res) => res.data);
  }
  resetPassword(input: ResetPasswordInputType) {
    return this.http
      .post(API_ENDPOINTS.RESET_PASSWORD, input)
      .then((res) => res.data);
  }
  verifyForgetPassword(input: VerifyPasswordInputType) {
    return this.http
      .post(API_ENDPOINTS.VERIFY_FORGET_PASSWORD, input)
      .then((res) => res.data);
  }
}

export const AuthService = new Auth("auth");
