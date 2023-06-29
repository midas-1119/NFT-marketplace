import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { validateSignupForm } from "../../schemas/auth.schema";
import { useDispatch, useSelector } from "react-redux";
import { registerAction } from "../../store/auth/async.fun";
import { authActions } from "../../store/auth/auth";
import { selectMessage } from "../../store/auth/selector";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { handleShowModal } from "../../utils/showModal";
import { LOGIN } from "../../constants";
import Input from "../../components/input/Input";
import InputError from "../../components/input/InputError";
import Button from "../../components/button/Button";
import Modal from "../../components/modal/Modal";

const Signup = () => {
  const modal = useModal();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validateSignupForm) });
  const [eye, setEye] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();
  const message = useSelector(selectMessage);
  const onSubmit = async (data: any) => {
    let res = await dispatch(registerAction(data));
    if (res.meta && res.meta.requestStatus === "fulfilled") {
      closeModal();
    }
  };

  const closeModal = () => {
    dispatch(authActions.clear());
    modal.remove();
  };

  useEffect(() => {
    clearMessage();
  }, []);

  const clearMessage = () => {
    dispatch(authActions.clear());
  };

  const handleAuth = (modalName: string, modalProps: any = {}) => {
    handleShowModal(modalName, modalProps);
    modal.remove()
  };

  const socialLogin = (type: "facebook" | "google" | "linkedin") => {
    let baseURL = process.env.NEXT_PUBLIC_BASE_URL
    const link = `${baseURL}/auth/${type}`;
    window.location.href = link;
  };

  return (
    <Modal
      hide={closeModal}
      show={modal.visible}
      afterClose={() => modal.remove()}
    >
      <div className="sm:w-[44.125rem] lg:w-[51.151rem] w-full">
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-[32px] bg-black1 py-4 px-8  relative mb-8">
            {/* <i
          className="icon-back text-white absolute text-2xl top-[50%] -translate-y-1/2 left-8 cursor-pointer "
          onClick={() => {
            setPopup(false);
          }}
        ></i> */}
            <h3 className="text-5xl text-center">CREATE ACCOUNT</h3>
          </div>
          <h6 className="font-Montserrat-Medium text-black2">
            Please enter your details to login
          </h6>
          <div className="relative">
            {message && <InputError error={message} />}
          </div>
          <div className="flex sm:flex-row flex-col gap-7 mt-14">
            <div className="w-full">
              <label className="text-xl font-Montserrat-Bold mb-2 block ">
                FULL NAME
              </label>
              <div className="relative">
                <Input
                  name="fullName"
                  register={register}
                  error={errors.fullName?.message}
                  placeholder="John Doe"
                  className="bg-transparent !py-7 !px-6 border-2 border-black1 !rounded-2xl font-Montserrat-Medium !text-xl placeholder:text-grays text-black1"
                />
              </div>
            </div>
            <div className="w-full">
              <label className="text-xl font-Montserrat-Bold mb-2 block ">
                USERNAME
              </label>
              <div className="relative">
                <Input
                  name="username"
                  register={register}
                  error={errors.username?.message}
                  placeholder="@johndoe"
                  className="bg-transparent !py-7 !px-6 border-2 border-black1 !rounded-2xl font-Montserrat-Medium !text-xl placeholder:text-grays text-black1"
                />
              </div>
            </div>
          </div>
          <label className="text-xl font-Montserrat-Bold mb-2 block mt-8">
            EMAIL ADDRESS
          </label>
          <div className="relative">
            <Input
              name="email"
              register={register}
              error={errors.email?.message}
              placeholder="johndoe@mail.com"
              className="bg-transparent !py-7 !px-6 border-2 border-black1 !rounded-2xl font-Montserrat-Medium !text-xl placeholder:text-grays text-black1"
            />
          </div>
          <label className="text-xl font-Montserrat-Bold  mb-2 block mt-8 ">
            PASSWORD
          </label>
          <div className="relative">
            <Input
              name="password"
              register={register}
              error={errors.password?.message}
              type={eye ? "password" : "text"}
              placeholder="***********"
              className="bg-transparent !py-7 !px-6 border-2 border-black1 !rounded-2xl font-Montserrat-Medium !text-xl placeholder:text-grays placeholder:pt-3 text-black1"
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

          <Button type="submit" className="text-gxl shadows w-full mt-20">
            CREATE ACCOUNT
          </Button>

          <Button type="button" className="text-gxl shadows w-full mt-20" onClick={() => socialLogin("google")}>
            Sign Up With Google
          </Button>
          <p className="text-base text-black2 text-center mt-14">
            Already have an account?{" "}
            <span
              className="text-purples cursor-pointer"
              onClick={() => handleAuth(LOGIN)}
            >
              {" "}
              Login
            </span>
          </p>
        </form>
      </div>
    </Modal>
  );
};
export default NiceModal.create(Signup);
