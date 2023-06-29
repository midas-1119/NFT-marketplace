import { createSlice } from "@reduxjs/toolkit";
import { getMarketplaceBuildingAction, getMarketplaceBuildingsAction, getMarketplaceFeaturedBuildingsAction, getMarketplaceSimilarBuildingsAction, getMostFeaturedBuildingAction, getUserBuildings } from "./async.func";

const initialState = {
  loading: false,
  refetch: false,
  price: 0
};

export const slice = createSlice({
  name: "marketplace",
  initialState,
  reducers: {
    setRefetch: (state) => {
      state.refetch = !state.refetch
    },
    priceRange: (state, action) => {
      state.price = action.payload
  },
  },
  extraReducers: {
    [getMarketplaceBuildingsAction.pending.toString()]: (state) => {
      state.loading = true;
    },
    [getMarketplaceBuildingsAction.fulfilled.toString()]: (state: any, { payload }: any) => {
      state.loading = false;
    },
    [getMarketplaceBuildingsAction.rejected.toString()]: (state) => {
      state.loading = false;
    },
    [getMarketplaceBuildingAction.pending.toString()]: (state) => {
      state.loading = true;
    },
    [getMarketplaceBuildingAction.fulfilled.toString()]: (state: any, { payload }: any) => {
      state.loading = false;
    },
    [getMarketplaceBuildingAction.rejected.toString()]: (state) => {
      state.loading = false;
    },
    [getMarketplaceFeaturedBuildingsAction.pending.toString()]: (state) => {
      state.loading = true;
    },
    [getMarketplaceFeaturedBuildingsAction.fulfilled.toString()]: (state: any, { payload }: any) => {
      state.loading = false;
    },
    [getMarketplaceFeaturedBuildingsAction.rejected.toString()]: (state) => {
      state.loading = false;
    },
    [getMostFeaturedBuildingAction.pending.toString()]: (state) => {
      state.loading = true;
    },
    [getMostFeaturedBuildingAction.fulfilled.toString()]: (state: any, { payload }: any) => {
      state.loading = false;
    },
    [getMostFeaturedBuildingAction.rejected.toString()]: (state) => {
      state.loading = false;
    },
    [getMarketplaceSimilarBuildingsAction.pending.toString()]: (state) => {
      state.loading = true;
    },
    [getMarketplaceSimilarBuildingsAction.fulfilled.toString()]: (state: any, { payload }: any) => {
      state.loading = false;
    },
    [getMarketplaceSimilarBuildingsAction.rejected.toString()]: (state) => {
      state.loading = false;
    },
    [getUserBuildings.pending.toString()]: (state) => {
      state.loading = true;
    },
    [getUserBuildings.fulfilled.toString()]: (state: any, { payload }: any) => {
      state.loading = false;
    },
    [getUserBuildings.rejected.toString()]: (state) => {
      state.loading = false;
    },
  },
});

export const { reducer: marketplaceReducer, actions: marketplaceActions } = slice;
