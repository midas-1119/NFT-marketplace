import { createSlice } from "@reduxjs/toolkit";
import {
  addAccount,
  changePassword,
  editUserDetails,
  forgotPassword,
  getUserWithOAuth,
  getUserAction,
  login,
  metamaskLogin,
  registerAction,
  resetPass,
  verifyCode,
} from "./async.fun";
// import { addAccount, changePassword, editUserDetails, forgotPassword, getUserAction, login, metamaskLogin, registerAction, resetPass, verifyCode } from "./async.fun";

const initialState: any = {
  user: null,
  access_token: null,
  message: "",
  submit: false,
  loading: false,
  metamaskLoading: false,
  pageLoader: false,
  metamaskConnected: false,
  chainId: "",
  reveal: false,
  email: "",
  type: "",
};

export const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.access_token = null;
    },
    clear: (state) => {
      state.message = "";
    },
    login: (state, { type, payload }) => {
      state.user = payload.user;
      state.access_token = payload.access_token;
      state.message = "";
      state.loading = false;
    },
    setMetamaskConnection: (state, { payload }) => {
      state.metamaskConnected = payload;
    },
    setType: (state, { payload }) => {
      state.type = payload;
    },
    enable2FA: (state) => {
      console.log("trigger");

      state.user.twoFactorAuthenticationCode = true;
    },
  },
  extraReducers: {
    [login.pending.toString()]: (state) => {
      state.loading = true;
    },
    [login.fulfilled.toString()]: (state: any, { payload }: any) => {
      state.user = payload.user;
      state.access_token = payload.access_token;
      state.loading = false;
    },
    [login.rejected.toString()]: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    [metamaskLogin.pending.toString()]: (state) => {
      state.loading = true;
    },
    [metamaskLogin.fulfilled.toString()]: (state: any, { payload }: any) => {
      state.user = payload.user;
      state.access_token = payload.access_token;
      state.loading = false;
    },
    [metamaskLogin.rejected.toString()]: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },

    [getUserWithOAuth.pending.toString()]: (state, { type, payload }) => {
      state.loading = true;
    },
    [getUserWithOAuth.fulfilled.toString()]: (state, { type, payload }) => {
      state.user = payload.user;
      state.access_token = payload.access_token;
      state.loading = false;
    },
    [getUserWithOAuth.rejected.toString()]: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    [addAccount.pending.toString()]: (state) => {
      state.loading = true;
    },
    [addAccount.fulfilled.toString()]: (state: any, { payload }: any) => {
      state.user = payload.user;
      state.access_token = payload.access_token;
      state.loading = false;
    },
    [addAccount.rejected.toString()]: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    [registerAction.pending.toString()]: (state) => {
      state.loading = true;
    },
    [registerAction.fulfilled.toString()]: (state: any, { payload }: any) => {
      state.loading = false;
    },
    [registerAction.rejected.toString()]: (state, { payload }) => {
      state.loading = false;
      state.message = payload;
    },
    [forgotPassword.fulfilled.toString()]: (state, { type, payload }) => {
      state.message = "";
      state.loading = false;
      state.email = payload.email;
    },
    [forgotPassword.pending.toString()]: (state, { type, payload }) => {
      state.loading = true;
    },
    [forgotPassword.rejected.toString()]: (state, { type, payload }) => {
      state.message = payload;
      state.loading = false;
    },
    [verifyCode.fulfilled.toString()]: (state, { type, payload }) => {
      state.message = "";
      state.loading = false;
    },
    [verifyCode.pending.toString()]: (state, { type, payload }) => {
      state.loading = true;
    },
    [verifyCode.rejected.toString()]: (state, { type, payload }) => {
      state.message = payload;
      state.loading = false;
    },
    [resetPass.fulfilled.toString()]: (state, { type, payload }) => {
      state.message = "";
      state.loading = false;
    },
    [resetPass.pending.toString()]: (state, { type, payload }) => {
      state.loading = true;
    },
    [resetPass.rejected.toString()]: (state, { type, payload }) => {
      state.message = payload;
      state.loading = false;
    },
    [editUserDetails.fulfilled.toString()]: (state, { payload }) => {
      state.message = "";
      const metamaskId: any = state.user?.metamaskId ?? null;
      state.user = { ...payload, metamaskId: metamaskId };
      state.loading = false;
    },
    [editUserDetails.pending.toString()]: (state, { type, payload }) => {
      state.loading = true;
    },
    [editUserDetails.rejected.toString()]: (state, { type, payload }) => {
      state.message = payload;
      state.loading = false;
    },
    [changePassword.fulfilled.toString()]: (state, { payload }) => {
      state.message = "";
      state.loading = false;
    },
    [changePassword.pending.toString()]: (state, { type, payload }) => {
      state.loading = true;
    },
    [changePassword.rejected.toString()]: (state, { type, payload }) => {
      state.message = payload;
      state.loading = false;
    },
    [getUserAction.fulfilled.toString()]: (state, { type, payload }) => {
      state.user = payload.user;
      state.access_token = payload.access_token;
      state.message = "";
      state.loading = false;
    },
    [getUserAction.pending.toString()]: (state, { type, payload }) => {
      state.loading = true;
    },
    [getUserAction.rejected.toString()]: (state, { type, payload }) => {
      state.message = payload;
      state.loading = false;
    },
  },
});

export const { reducer: authReducer, actions: authActions } = slice;
