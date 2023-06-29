export interface IEditUser {
  fullName: string;
  email: string;
  username: string;
}
export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
}
export interface IValidateUser {
  identifier: string;
}
export interface ISubscribeNewsletter {
  email: string;
}
export interface I2FAValidate {
  twoFactorAuthenticationCode: number | undefined;
}
