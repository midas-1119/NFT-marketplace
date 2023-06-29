import { createSelector } from "@reduxjs/toolkit";

const selectDomain = (state: any) => state.auth;

export const selectToken = createSelector(
  selectDomain,
  (auth) => auth.access_token
);
export const selectUser = createSelector(selectDomain, (auth) => auth.user);
export const selectUserId = createSelector(
  selectDomain,
  (auth) => auth.user._id
);
export const selectMessage = createSelector(
  selectDomain,
  (auth) => auth.message
);
export const selectEmail = createSelector(
  selectDomain,
  (auth) => auth.email
);
export const selectLoading = createSelector(
  selectDomain,
  (auth) => auth.loading
);
export const selectMetamaskConnected = createSelector(
  selectDomain,
  (auth) => auth.metamaskConnected
);
export const selectMetamaskLoading = createSelector(
  selectDomain,
  (auth) => auth.metamaskLoading
);
export const selectType = createSelector(
  selectDomain,
  (auth) => auth.type
);