import * as yup from "yup";
import { PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE } from "../constants/regex.constant";


export const validateEditProfileForm = yup.object().shape({
    fullName: yup
        .string()
        .required()
        .label("Full Name"),
    username: yup
        .string()
        .matches(/^[A-Za-z0-9_\.]+$/, "Invalid username")
        .min(6)
        .max(14)
        .required()
        .label("Username"),
    email: yup
        .string()
        .required()
        .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Invalid Email")
        .label("Email"),
});
export const validateChangePasswordForm = yup.object().shape({
    currentPassword: yup.string().required().label("Current Password"),
    newPassword: yup.string()
    .required('Password is required')
    .matches(PASSWORD_REGEX, PASSWORD_VALIDATION_MESSAGE),
    confirm_password: yup
        .string()
        .oneOf([yup.ref("newPassword"), null], "Passwords must match")
        .label("Password"),
});