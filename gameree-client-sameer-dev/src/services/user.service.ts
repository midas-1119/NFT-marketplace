import {
  IChangePassword,
  IEditUser,
  ISubscribeNewsletter,
  IValidateUser,
  I2FAValidate,
} from "../interfaces";
import { HttpService } from "./base.service";

class UserService extends HttpService {
  private readonly prefix: string = "user";

  /**
   * Basic User
   * @param data
   */
  validateUser = (data: IValidateUser): Promise<any> =>
    this.post(`${this.prefix}/validate-user`, data);
  nftsvalue = (): Promise<any> => this.get(`marketplace/user/nftsvalue`);
  userDashboard = (): Promise<any> => this.get(`marketplace/user/dashboard`);
  editUser = (data: IEditUser | FormData): Promise<any> =>
    this.put(`${this.prefix}`, data);
  editPassword = (data: IChangePassword): Promise<any> =>
    this.post(`${this.prefix}/password/change`, data);
  me = (): Promise<any> => this.get(`${this.prefix}/profile`);
  subscribeToNewsletter = (body: ISubscribeNewsletter) =>
    this.post(`${this.prefix}/newsletter/subscribe`, body);
  generate2FA = () => this.get(`${this.prefix}/2fa/generate`);
  turnOn2FA = (body: I2FAValidate) =>
    this.post(`${this.prefix}/2fa/turn-on`, body);
  authenticate2FA = (body: I2FAValidate, access_token: string) =>
    this.post(`${this.prefix}/2fa/authenticate`, body, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
}

export const userService = new UserService();
