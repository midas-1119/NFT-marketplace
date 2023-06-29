import { createSelector } from "@reduxjs/toolkit";

const selectDomain = (state: any) => state.marketplace;

export const selectLoading = createSelector(
  selectDomain,
  (marketplace) => marketplace.loading
);
export const selectRefetch = createSelector(
  selectDomain,
  (marketplace) => marketplace.refetch
);

export const selectPriceRange = createSelector(selectDomain, (marketplace) => marketplace.price);