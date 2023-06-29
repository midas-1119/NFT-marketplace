import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  IChangePassword,
  IEditUser,
  IForgotPassword,
  IResetPassword,
  IVerifyPin,
} from "../../interfaces";
import { connectMetamask } from "../../metamask/metamask";
import { authService } from "../../services/auth.service";
import { userService } from "../../services/user.service";

export const login: any = createAsyncThunk(
  "/login",
  async (body: any, thunkAPI) => {
    try {
      return body;
    } catch (error: any) {
      const err = error?.response.data.message;
      // toast.error(err);
      return thunkAPI.rejectWithValue(err);
    }
  }
);
export const metamaskLogin: any = createAsyncThunk(
  "/metamask/login",
  async (body: any, thunkAPI) => {
    try {
      return body;
    } catch (error: any) {
      const err = error?.response.data.message;
      // toast.error(err);
      return thunkAPI.rejectWithValue(err);
    }
  }
);
export const addAccount: any = createAsyncThunk(
  "/add/account",
  async ({ body, token }: any, thunkAPI) => {
    try {
      const res = await authService.addMetamaskAccount(body, token);
      return res.data.data;
    } catch (error: any) {
      const err = error?.response.data.message;
      // toast.error(err);
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const registerAction: any = createAsyncThunk(
  "/register",
  async (body: any, thunkAPI) => {
    try {
      const res = await authService.register(body);
      toast.success(res.data.message);
      return res.data.data;
    } catch (error: any) {
      const err = error?.response.data.message;
      toast.error(err);
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const connectMetamaskWallet: any = createAsyncThunk(
  "auth/connect-wallet",
  async (body: any, thunkAPI) => {
    try {
      const res = await connectMetamask();
      return res;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue("Account not connected");
    }
  }
);

export const forgotPassword: any = createAsyncThunk(
  "auth/forget-password",
  async (body: IForgotPassword, thunkAPI) => {
    try {
      const response = await authService.forgetPassword(body);
      // toast.success(response.data.message);
      return { ...response.data.data, email: body.email };
    } catch (error: any) {
      console.log(error);
      const err = error?.response.data.message;
      return thunkAPI.rejectWithValue(err);
    }
  }
);
export const verifyCode: any = createAsyncThunk(
  "auth/verify-pin",
  async (body: IVerifyPin, thunkAPI) => {
    try {
      const response = await authService.verifyPin(body);
      toast.success("Code verified successfully.");
      return response.data.data;
    } catch (error: any) {
      const err = error.response.data.message;
      return thunkAPI.rejectWithValue(err);
    }
  }
);
export const resetPass: any = createAsyncThunk(
  "auth/reset",
  async (body: IResetPassword, thunkAPI) => {
    try {
      const response = await authService.resetPassword(body);
      return response.data.data;
    } catch (error: any) {
      const err = error.response.data.message;
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// export const isMetamaskConnected = createAsyncThunk(
//   "auth/connect",
//   async (body: any, thunkAPI) => {
//     try {
//       const res = await isMetaMaskConnected();
//       return res;
//     } catch (error) {
//       return thunkAPI.rejectWithValue("Account not connected");
//     }
//   }
// );

export const editUserDetails: any = createAsyncThunk(
  "user/edit",
  async (data: IEditUser | FormData, thunkAPI) => {
    try {
      const response = await userService.editUser(data);
      return response.data.data;
    } catch (error: any) {
      const err = error.response.data.message;
      return thunkAPI.rejectWithValue(err);
    }
  }
);
export const changePassword: any = createAsyncThunk(
  "user/password",
  async (data: IChangePassword, thunkAPI) => {
    try {
      const response = await userService.editPassword(data);
      return response.data.data;
    } catch (error: any) {
      const err = error.response.data.message;
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const getUserWithOAuth: any = createAsyncThunk(
  "auth/oAuth",
  async (body: any, thunkAPI) => {
    try {
      const res = await userService.me();
      // console.log("here is the meta mask id in actions", res.metamaskId);
      return { access_token: body.token, user: res.data.data };
    } catch (error: any) {
      // toast.error(error.response.data.message);
      const err = error.response.data.message;
      return thunkAPI.rejectWithValue(err);
    }
  }
);
export const getUserAction: any = createAsyncThunk(
  "auth/getUser",
  async (body: any, thunkAPI) => {
    try {
      const response = await authService.getUser();
      return {
        user: response.data.data,
        access_token: body,
      };
    } catch (error) {
      //   const err = error.response.data.message;
      return thunkAPI.rejectWithValue("Incorrect username or password");
    }
  }
);
