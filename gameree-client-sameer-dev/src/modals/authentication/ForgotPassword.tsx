import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectLoading, selectMessage } from "../../store/auth/selector";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validateForgetPasswordForm } from "../../schemas/auth.schema";
import { forgotPassword } from "../../store/auth/async.fun";
import { authActions } from "../../store/auth/auth";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import InputError from "../../components/input/InputError";
import Modal from "../../components/modal/Modal";
import { handleShowModal } from "../../utils/showModal";
import { EMAIL_COFIRMATION, LOGIN } from "../../constants";

const ForgotPassword = () => {
  const modal = useModal();
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validateForgetPasswordForm),
  });
  const onSubmit = async (data: any) => {
    const res: any = await dispatch(forgotPassword({
      email: data.email.toLowerCase()
    }));
    if (res.type === "auth/forget-password/fulfilled") {
      closeModal()
      handleShowModal(EMAIL_COFIRMATION)
    }
  };
  const message = useSelector(selectMessage);

  useEffect(()=>{
    clearMessage()
  },[])
  
  const clearMessage = () => {
    dispatch(authActions.clear())
  }

  const closeModal = () => {
    if (loading) return;
    dispatch(authActions.clear());
    modal.remove();
    reset();
  };

  const handleAuth = (modalName: string, modalProps: any = {}) => {
    handleShowModal(modalName, modalProps);
    modal.remove()
  };
  return (
    <Modal hide={closeModal} show={modal.visible} afterClose={()=> modal.remove()}>
    <div className="sm:w-[44.125rem] lg:w-[51.151rem] w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded-[34px] bg-black1 py-4 px-8  relative mb-8">
        <i
          className="icon-back text-white absolute text-2xl top-[50%] -translate-y-1/2 left-8 cursor-pointer "
          onClick={closeModal}
        ></i>
        <h3 className="lg:text-5xl text-4xl xs:3xl text-center xs:ml-6">FORGOT PASSWORD</h3>
      </div>
      <h6 className="font-Montserrat-Medium text-black2">
        Enter your registered email to receive password reset instructions.
      </h6>
      <div className="relative">{message && <InputError error={message} />}</div>
      <label className="text-xl font-Montserrat-Bold mb-2 block mt-12">
        EMAIL ADDRESS
      </label>
      <div className="relative">
        <Input
          placeholder="abcd@mail.com"
          className="bg-transparent !py-7 !px-6 border-2 border-black1 !rounded-2xl font-Montserrat-Medium !text-xl placeholder:text-grays text-black1"
          name="email"
          register={register}
          error={errors.email?.message}
        />
      </div>
      <Button
        type="submit"
        className="text-gxl shadows w-full mt-20"
        disabled={loading}
        isLoading={loading}
      >
        SUBMIT
      </Button>
      <p className="text-base text-black2 text-center mt-14">
        Remember Password?{" "}
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

export default NiceModal.create(ForgotPassword);
