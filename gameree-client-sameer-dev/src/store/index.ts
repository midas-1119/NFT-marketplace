import { applyMiddleware, createStore, Store } from "@reduxjs/toolkit";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import thunkMiddleware from "redux-thunk";
import { createWrapper } from "next-redux-wrapper";
import { authReducer } from "./auth/auth";
import { combineReducers } from "redux";
import { appMode } from "../environment/env";
import { marketplaceReducer } from "./marketplace/marketplace";

const rootReducers = combineReducers({
  // here we will be adding reducers
  auth: authReducer,
  marketplace: marketplaceReducer
});

const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();
const bindMiddleware = (middleware: any) => {
  if (appMode !== "production") {
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

export const makeStore = ({ isServer }: any) => {
  if (isServer) {
    //If it's on server side, create a store
    return createStore(rootReducers, bindMiddleware([thunkMiddleware]));
  } else {
    const persistConfig = {
      key: "root",
      storage: storage,
      whitelist: ["auth"],
    };
    const persistedReducer = persistReducer(persistConfig, rootReducers);
    const store = createStore(
      persistedReducer,
      bindMiddleware([thunkMiddleware])
    );
    (store as any).__persistor = persistStore(store);
    return store;
  }
};
export const wrapper = createWrapper(makeStore);
