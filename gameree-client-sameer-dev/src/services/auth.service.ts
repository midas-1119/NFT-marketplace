import {
  IForgotPassword,
  IResetPassword,
  IVerifyPin,
} from "../interfaces/auth.interface";
import { HttpService } from "./base.service";

class AuthService extends HttpService {
  private readonly prefix: string = "auth";

  login = (data: any): Promise<any> => this.post(`${this.prefix}/login`, data);
  loginWithMetamask = (data: any): Promise<any> =>
    this.post(`${this.prefix}/login/metamask`, data);
  addMetamaskAccount = (data: any, access_token: string): Promise<any> =>
    this.post(`${this.prefix}/add/account`, data, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
  register = (data: any): Promise<any> =>
    this.post(`${this.prefix}/signup`, data);
  forgetPassword = (data: IForgotPassword): Promise<any> =>
    this.post(`${this.prefix}/forgot-password`, data);
  verifyPin = (data: IVerifyPin): Promise<any> =>
    this.post(`${this.prefix}/verify-code`, data);
  resetPassword = (data: IResetPassword): Promise<any> =>
    this.post(`${this.prefix}/reset-password`, data);
  getUser = (): Promise<any> => this.post(`${this.prefix}/getPayload`, {});
  syncMetamask = (data: any): Promise<any> =>
    this.post(`${this.prefix}/syncMetamask`, data);
}

export const authService = new AuthService();
