import * as yup from "yup";
import { PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE } from "../constants/regex.constant";

export const validateLoginForm  = yup.object().shape({
  identifier: yup
    .string()
    .email()
    .required()
    .label("Email"),
  password: yup.string().required('Password is required')
});

export const validateForgetPasswordForm = yup.object().shape({
  email: yup.string().email().required().label("Email"),
});
export const validateCode = yup.object().shape({
  code: yup.number().required().label("Code"),
});
export const validatePasswordForm = yup.object().shape({
  password: yup.string()
  .required('Password is required')
  .matches(PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE),
});

export const validateResetPasswordForm = yup.object().shape({
  code: yup.number().required().label("Code"),
  password: yup.string()
  .required('Password is required')
  .matches(PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE),
  confirm_password: yup.string().oneOf([yup.ref("password"), null,"Passwords must match"], "Passwords must match"),
});

export const validateSignupForm = yup.object().shape({
  fullName: yup
    .string()
    .required()
    .matches(/^[A-Za-z ]+$/i, "Name is invalid")
    .label("Full Name"),
  username: yup
    .string()
    .matches(/^[A-Za-z0-9_\.]+$/,"Username is invalid.")
    .min(6)
    .max(14)
    .required()
    .label("Username"),
  email: yup
    .string()
    .required()
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Invalid Email")
    .label("Email"),
    password: yup.string()
    .required('Password is required')
    .matches(PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE),
//   confirm_password: yup.string().oneOf([yup.ref("password"), null], "Passwords must match"),
//   acceptTerms: yup.boolean().oneOf([true], "Please accept T&Cs").default(false),
});