import "../../public/assets/icomoon.css";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { useDispatch, useSelector, useStore } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Layout from "../components/layout/Layout";
import "react-rangeslider/lib/index.css";
import { ToastContainer } from "react-toastify";
import { wrapper } from "../store";
import { useEffect, useState } from "react";
import { selectToken, selectUser } from "../store/auth/selector";
import { HttpService } from "../services/base.service";
import { authActions } from "../store/auth/auth";
import { useRouter } from "next/router";
import {
  addAccount,
  getUserAction,
  metamaskLogin,
} from "../store/auth/async.fun";
import Script from "next/script";
import Link from "next/link";
import Head from "next/head";
import NiceModal from "@ebay/nice-modal-react";
import "../modals/index";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { Router } from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { authService } from "../services/auth.service";
import { TWOFA } from "../constants";
import { handleShowModal } from "../utils/showModal";
// import axios from "axios";

function MyApp({ Component, pageProps }: AppProps) {
  // const stripePromise = loadStripe( stripePublishableKey);
  const store: any = useStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (token && !isAuthenticated) {
      HttpService.setToken(token);
      setIsAuthenticated(true);
    }
  }, [token]);

  const { token: tokenGoogle = "" } = router.query;

  useEffect(() => {
    checkSocialLogin();
  }, [tokenGoogle]);

  const checkSocialLogin = async () => {
    if (tokenGoogle) {
      HttpService.setToken(tokenGoogle);
      const res: any = await dispatch(getUserAction(tokenGoogle));
      if (res.type === "auth/getUser/fulfilled") {
        router.replace("/");
      }
    }
  };

  useEffect(() => {
    //@ts-ignore
    if (window.ethereum) {
      //@ts-ignore
      window.ethereum.on("accountsChanged", async (account: any) => {
        await login(account[0]);
        account.length === 0 && (await logout());
      });
    }
  }, []);

  const login = async (metamaskId: any) => {
    try {
      if (!user) {
        dispatch(metamaskLogin({ identifier: metamaskId }));
        setIsAuthenticated(false);
      } else if (user && user?.metamaskId !== metamaskId) {
        const res = await authService.loginWithMetamask({
          identifier: metamaskId,
        });
        await dispatch(addAccount(res.data.data));

        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    dispatch(authActions.logout());
    router.push("/");
    setIsAuthenticated(false);
  };

  Router.events.on("routeChangeStart", () => {
    NProgress.start(); // start the progress bar when a route change starts
  });

  Router.events.on("routeChangeComplete", () => {
    NProgress.done(); // stop the progress bar when a route change completes
  });

  Router.events.on("routeChangeError", () => {
    NProgress.done(); // stop the progress bar when a route change errors out
  });

  return (
    <div className="Bg">
      <Head>
        <link
          rel="stylesheet"
          type="text/css"
          href={
            "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.2/mapbox-gl-geocoder.css"
          }
        ></link>
        <Script src="https://api.mapbox.com/mapbox-gl-js/v2.8.2/mapbox-gl.js"></Script>
        <script
          type="text/javascript"
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBxZ5mUOwo3CUldbWrsKCZyeVJVffyP8AU&libraries=places"
        ></script>
      </Head>
      <PersistGate loading={null} persistor={store.__persistor}>
        <NiceModal.Provider>
          <Layout>
            <Component {...pageProps} />
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              draggable={false}
              closeOnClick
              pauseOnHover
            />
          </Layout>
        </NiceModal.Provider>
      </PersistGate>
    </div>
  );
}
export default wrapper.withRedux(MyApp);
