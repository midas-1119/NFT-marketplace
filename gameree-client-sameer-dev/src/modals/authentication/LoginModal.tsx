import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  addAccount,
  connectMetamaskWallet,
  login,
  metamaskLogin,
} from "../../store/auth/async.fun";
import {
  selectLoading,
  selectMessage,
  selectUser,
} from "../../store/auth/selector";
import { validateLoginForm } from "../../schemas/auth.schema";
import { authActions } from "../../store/auth/auth";
import InputError from "../../components/input/InputError";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { FORGOT_PASSWORD, SIGNUP, TWOFA } from "../../constants";
import Modal from "../../components/modal/Modal";
import { handleShowModal } from "../../utils/showModal";
import { appMode, baseURL } from "../../environment/env";
import { authService } from "../../services/auth.service";
import { toast } from "react-toastify";
import { HttpService } from "../../services/base.service";
import Cookies from "js-cookie";

const LoginModal = () => {
  const modal = useModal();
  const user = useSelector(selectUser);
  const [eye, setEye] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validateLoginForm) });
  const router = useRouter();

  const message = useSelector(selectMessage);
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();

  const onSubmit = async (data: any) => {
    try {
      const res = await authService.login(data);
      if (res?.data?.data?.user?.isTwoFactorAuthenticationEnabled) {
        handleShowModal(TWOFA, { isAuth: true, data: res?.data?.data });
        closeModal();
      } else {
        await dispatch(login(res?.data?.data));
        HttpService.setToken(res?.data?.data.access_token);
        const resp: any = await dispatch(connectMetamaskWallet({}));
        closeModal();
        router.push("/");
      }
    } catch (error: any) {
      toast(error?.response?.data?.message || "Login failed");
    }
  };

  const handleMetamask = async () => {
    try {
      console.log("Metamask");
      const resp: any = await dispatch(connectMetamaskWallet({}));
      if (resp.payload.success && resp.payload.account) {
        console.log("Account: ", resp.payload);
        // const normalizedId = normalizeAccount(resp.payload.account);
        const res = await authService.loginWithMetamask({
          identifier: resp.payload.account,
        });
        if (res?.data?.data?.user?.isTwoFactorAuthenticationEnabled) {
          handleShowModal(TWOFA, {
            isAuth: true,
            data: res?.data?.data,
            isMetamask: true,
          });
          closeModal();
        } else {
          await dispatch(metamaskLogin(res.data.data));
          closeModal();
          router.push("/");
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    clearMessage();
  }, []);

  useEffect(() => {
    if (user) closeModal();
  }, []);

  const clearMessage = () => {
    dispatch(authActions.clear());
  };

  const closeModal = () => {
    if (loading) return;
    dispatch(authActions.clear());
    modal.remove();
  };

  const handleAuth = (modalName: string) => {
    handleShowModal(modalName);
    modal.remove();
  };

  const socialLogin = async (type: "facebook" | "google" | "linkedin") => {
    // const resp: any = await dispatch(connectMetamaskWallet({}));
    // await handleMetamask();

    localStorage.setItem("Social", type);
    let baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    // const link = `${baseURL}/auth/${type}`;

    const link = `${baseURL}/auth/${type}`;

    // Cookies.set("metamaskId", resp.payload.account, { secure: true });

    // console.log("Link: ", link);
    window.location.href = link;
  };

  return (
    <Modal
      hide={closeModal}
      show={modal.visible}
      afterClose={() => modal.remove()}
    >
      <div className="sm:w-[44.125rem] lg:w-[51.151rem] w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-full bg-black1 py-4 px-8  relative mb-8">
            <h3 className="text-4xl text-center lg:text-5xl xs:3xl">LOGIN</h3>
          </div>
          <h6 className="font-Montserrat-Medium text-[24px] text-black2">
            Please enter your details to login
          </h6>
          <div className="relative">
            {message && <InputError error={message} />}
          </div>
          <label className="block mb-2 text-[20px] font-Montserrat-Bold mt-10">
            EMAIL ADDRESS
          </label>
          <div className="relative">
            <Input
              name="identifier"
              register={register}
              className="bg-transparent !py-7 !px-6 border-2 border-[#9FA0A2] !rounded-2xl font-Montserrat-Medium !text-xl placeholder:text-grays text-black1"
              error={errors.identifier?.message}
              placeholder="abcd@mail.com"
            />
          </div>
          <label className="block mt-8 mb-2 text-[20px] font-Montserrat-Bold">
            PASSWORD
          </label>
          <div className="relative">
            <Input
              type={eye ? "password" : "text"}
              name="password"
              className="bg-transparent !py-7 !px-6 border-2 border-border-[#9FA0A2] !rounded-2xl font-Montserrat-Medium !text-xl placeholder:text-grays text-black1"
              register={register}
              error={errors.password?.message}
              placeholder="***********"
            />
            {eye ? (
              <i
                className="icon-hide text-[#4F4F4F] absolute top-1/2 -translate-y-1/2 right-4 text-[1.625rem] cursor-pointer"
                onClick={() => {
                  setEye(false);
                }}
              ></i>
            ) : (
              <i
                className="icon-eye text-[#4F4F4F] absolute top-1/2 -translate-y-1/2 right-4 text-[1.625rem] cursor-pointer"
                onClick={() => {
                  setEye(true);
                }}
              ></i>
            )}
          </div>
          <div className="w-full">
            <p
              style={{ display: "flex", justifyContent: "flex-end" }}
              className="mt-3 w-full cursor-pointer text-[#777E91]"
              onClick={() => handleAuth(FORGOT_PASSWORD)}
            >
              Forgot Password?
            </p>
          </div>
          <Button
            type="submit"
            className="w-full mt-10 mb-8 text-gxl shadows"
            disabled={loading}
            isLoading={loading}
          >
            LOGIN
          </Button>
          <div className="gap-1 mb-7">
            <fieldset className="border-t border-[#777E91]">
              <legend className="mx-auto px-4 text-[#777E91]">Or</legend>
            </fieldset>
          </div>

          <Button
            className="text-gxl shadows w-full gradient flex justify-between mb-6 !text-[2.5rem]"
            onClick={handleMetamask}
            // disabled={loading}
            disabled={true}
          >
            METAMASK
            <Image src="/assets/images/metamask.svg" height={40} width={40} />
          </Button>
          <Button
            className="text-gxl shadows w-full bg-[#0052FF] flex justify-between !text-[2.5rem] mt-4"
            onClick={async () => {
              // await handleMetamask();
              socialLogin("google");
            }}
          >
            Google
            <Image src="/assets/images/google.png" height={40} width={40} />
          </Button>

          {/* <Button className="text-gxl shadows w-full bg-[#0052FF] flex justify-between !text-[2.5rem]">
          COINBASE
          <Image src="/assets/images/coinbase.svg" height={40} width={40} />
            </Button>*/}

          <p className="text-base text-center text-[#777E91] mt-14">
            Don’t have an account?{" "}
            <span
              className="cursor-pointer text-purples"
              onClick={() => handleAuth(SIGNUP)}
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </Modal>
  );
};

export default NiceModal.create(LoginModal);
