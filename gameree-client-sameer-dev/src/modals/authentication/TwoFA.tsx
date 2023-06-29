import React, { useEffect, useReducer, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLoading,
  selectMessage,
  selectToken,
} from "../../store/auth/selector";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  validateCode,
  validateForgetPasswordForm,
} from "../../schemas/auth.schema";
import {
  addAccount,
  connectMetamaskWallet,
  forgotPassword,
  getUserAction,
  login,
  metamaskLogin,
} from "../../store/auth/async.fun";
import { authActions } from "../../store/auth/auth";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import InputError from "../../components/input/InputError";
import Modal from "../../components/modal/Modal";
import { handleShowModal } from "../../utils/showModal";
import { EMAIL_COFIRMATION, LOGIN, SETTINGS } from "../../constants";
import PinInputExamples from "../../components/pinCodeinput/PinCodeInput";
import QRIcon from "../../../public/assets/images/qrimage.png";
import { userService } from "../../services/user.service";
import { toast } from "react-toastify";
import { id } from "ethers/lib/utils";
import { HttpService } from "../../services/base.service";
import { useRouter } from "next/router";

const TwoFAModal = ({
  isAuth = false,
  data: authData,
  isMetamask = false,
}: any) => {
  const modal = useModal();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const loading = useSelector(selectLoading);
  const [otp, setOtp] = useState<number>();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validateCode),
  });
  const onSubmit = async (data: any) => {
    const res: any = await dispatch(
      forgotPassword({
        email: data.email.toLowerCase(),
      })
    );
    if (res.type === "auth/forget-password/fulfilled") {
      closeModal();
      handleShowModal(EMAIL_COFIRMATION);
    }
  };
  const message = useSelector(selectMessage);

  useEffect(() => {
    clearMessage();
  }, []);

  const clearMessage = () => {
    dispatch(authActions.clear());
  };

  const closeModal = () => {
    if (loading) return;
    dispatch(authActions.clear());
    modal.remove();
    reset();
  };

  const handleAuth = (modalName: string, modalProps: any = {}) => {
    handleShowModal(modalName, modalProps);
    modal.remove();
  };
  const recieveOTP = (value: number) => {
    setOtp(value);
  };

  const handleShow = (modalName: string) => {
    handleShowModal(modalName);
    modal.remove();
  };

  const reducer = (state: any, action: any) => {
    return { ...state, ...action };
  };

  const intialState = {
    error: null,
    data: null,
    loading: false,
  };

  const [state2FA, dispatch2FA] = useReducer(reducer, intialState);
  const [stateSubmit, dispatchSubmit] = useReducer(reducer, intialState);

  const router = useRouter();

  const generate2FA = async () => {
    try {
      dispatch2FA({ loading: true });
      const { data } = await userService.generate2FA();
      dispatch2FA({ data });
    } catch (error: any) {
      dispatch2FA({ error: error.response });
    } finally {
      dispatch2FA({ loading: false });
    }
  };
  const turnOn2FA = async () => {
    try {
      dispatchSubmit({ loading: true });
      let data = null;
      if (!isAuth) {
        const res = await userService.turnOn2FA({
          twoFactorAuthenticationCode: otp,
        });
        dispatch(authActions.logout());
        HttpService.setToken(null);
        router.push("/");
        data = res.data;
      } else {
        const res = await userService.authenticate2FA(
          {
            twoFactorAuthenticationCode: otp,
          },
          authData.access_token
        );
        data = res.data;
        HttpService.setToken(authData?.access_token);
        const resp: any = await dispatch(connectMetamaskWallet({}));
        await dispatch(isMetamask ? metamaskLogin(authData) : login(authData));
      }
      dispatchSubmit({ data });
      if (!isAuth) {
        toast.success("2FA enabled");
      }
      modal.remove();
    } catch (error: any) {
      console.log(error, "error");

      dispatchSubmit({ error: error.response });
      toast.error(error.response?.data?.data);
    } finally {
      dispatchSubmit({ loading: false });
    }
  };

  useEffect(() => {
    if (!isAuth) {
      generate2FA();
    }
  }, [isAuth]);

  return (
    <Modal
      hide={closeModal}
      show={modal.visible}
      afterClose={() => modal.remove()}
    >
      <div className="sm:w-[44.125rem] lg:w-[51.151rem] w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-[34px] bg-black1 py-4 px-8  relative mb-8">
            <i
              className="icon-back text-white absolute text-2xl top-[50%] -translate-y-1/2 left-8 cursor-pointer "
              onClick={() => handleShow(!isAuth ? SETTINGS : LOGIN)}
            ></i>
            <h3 className="lg:text-5xl text-4xl xs:3xl text-center xs:ml-6">
              AUTHENTICATE
            </h3>
          </div>
          <h6 className="font-Montserrat-Medium text-black2">
            Open GA and scan the QR code below or enter the key to add a code
            pin
          </h6>
          {!isAuth && (
            <div className="flex justify-center">
              {state2FA.data ? (
                <Image
                  src={state2FA?.data?.data}
                  alt="no-image"
                  width={180}
                  height={180}
                />
              ) : (
                "Loading..."
              )}
            </div>
          )}
          <label className="text-xl font-Montserrat-Bold mb-2 block mt-12">
            Enter PIN
          </label>
          <div className="flex justify-center">
            <PinInputExamples submit={recieveOTP} />
          </div>
          <Button
            className="text-gxl shadows w-full mt-20"
            disabled={stateSubmit.loading || otp === undefined}
            isLoading={loading}
            onClick={turnOn2FA}
          >
            SUBMIT
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default NiceModal.create(TwoFAModal);
