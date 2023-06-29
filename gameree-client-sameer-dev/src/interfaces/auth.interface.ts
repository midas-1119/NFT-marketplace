export interface IAuthReducer {
  user: any;
  loading: boolean;
}
export interface IAuthLogin {
  identifier: string;
  password: string;
}
export interface IAuthSignUp {
  fullName: string;
  userName: string;
  email: string;
  password: string;
}
export interface IVerifyPin {
  email: string;
  pin: number;
}
export interface IResetPassword {
  email: string;
  password: string;
  pin: number;
}
export interface IReset {
  body: IResetPassword;
  setShow: any;
}
export interface IForgotPassword {
  email: string;
}