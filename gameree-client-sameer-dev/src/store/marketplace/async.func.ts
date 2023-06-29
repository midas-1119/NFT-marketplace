import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { marketplaceService } from "../../services/marketplace.service";

export const getMarketplaceBuildingsAction : any = createAsyncThunk(
  "buildings",
  async (body: any, thunkAPI) => {
    try {
      const res = await marketplaceService.getBuildings(body);
      return res.data.data;
    } catch (error: any) {
      console.log(error, "error");
      const err = error?.response.data.message;
      toast.error(err);
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const getUserBuildings : any = createAsyncThunk(
  "user-buildings",
  async (body: any, thunkAPI) => {
    try {
      const res = await marketplaceService.getUserBuildings(body);
      return res.data.data;
    } catch (error: any) {
      console.log(error, "error");
      const err = error?.response.data.message;
      toast.error(err);
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const getMarketplaceBuildingAction : any = createAsyncThunk(
  "building",
  async (body: any, thunkAPI) => {
    try {
      const res = await marketplaceService.getById(body);
      return res.data.data;
    } catch (error: any) {
      console.log(error, "error");
      const err = error?.response.data.message;
      toast.error(err);
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const getMarketplaceFeaturedBuildingsAction : any = createAsyncThunk(
  "featured",
  async (body: any, thunkAPI) => {
    try {
      const res = await marketplaceService.getFeaturedBuildings();
      return res.data.data;
    } catch (error: any) {
      console.log(error, "error");
      const err = error?.response.data.message;
      toast.error(err);
      return thunkAPI.rejectWithValue(err);
    }
  }
);


export const getMostFeaturedBuildingAction : any = createAsyncThunk(
  "most-featured",
  async (body: any, thunkAPI) => {
    try {
      const res = await marketplaceService.getMostFeaturedBuilding();
      return res.data.data;
    } catch (error: any) {
      console.log(error, "error");
      const err = error?.response.data.message;
      toast.error(err);
      return thunkAPI.rejectWithValue(err);
    }
  }
);

export const getMarketplaceSimilarBuildingsAction : any = createAsyncThunk(
  "similar",
  async (body: any, thunkAPI) => {
    try {
      const res = await marketplaceService.getSimilarBuildings();
      return res.data.data;
    } catch (error: any) {
      console.log(error, "error");
      const err = error?.response.data.message;
      toast.error(err);
      return thunkAPI.rejectWithValue(err);
    }
  }
);