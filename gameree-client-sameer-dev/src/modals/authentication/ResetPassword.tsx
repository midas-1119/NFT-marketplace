import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectEmail,
  selectLoading,
  selectMessage,
} from "../../store/auth/selector";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  validateResetPasswordForm,
} from "../../schemas/auth.schema";
import { resetPass } from "../../store/auth/async.fun";
import { toast } from "react-toastify";
import { authActions } from "../../store/auth/auth";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import InputError from "../../components/input/InputError";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import Modal from "../../components/modal/Modal";
import { handleShowModal } from "../../utils/showModal";
import { SUCCESS } from "../../constants";

const ResetPassword = () => {
  const modal = useModal();
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const message = useSelector(selectMessage);
  const email = useSelector(selectEmail);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validateResetPasswordForm),
  });
  const onSubmit = async (body: any) => {
    if (!email || email === "") {
      toast.error("Invalid Request");
      return;
    }
    const res = await dispatch(
      resetPass({
        pin: body.code,
        email: email,
        password: body.password,
      })
    );
    if (res.meta && res.meta.requestStatus === "fulfilled") {
      closeModal()
      handleShowModal(SUCCESS, { 
        type: "reset"
      })
    }
  };
  const closeModal = () => {
    if (loading) return;
    dispatch(authActions.clear());
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
          <h3 className="lg:text-5xl text-4xl xs:3xl text-center xs:ml-6">
            RESET PASSWORD
          </h3>
        </div>
        <h6 className="font-Montserrat-Medium text-black2">
          Enter your new password.
        </h6>
        <div className="relative">
          {message && <InputError error={message} />}
        </div>
        <label className="text-xl font-Montserrat-Bold mb-2 block mt-12">
          RECOVERY PIN
        </label>
        <div className="relative">
          <Input
            placeholder="*****"
            className="bg-transparent !py-7 !px-6 border-2 border-black1 !rounded-2xl font-Montserrat-Medium !text-xl placeholder:text-grays text-black1"
            name="code"
            type="password"
            register={register}
            error={errors.code?.message}
          />
        </div>
        <label className="text-xl font-Montserrat-Bold mb-2 block mt-12">
          NEW PASSWORD
        </label>
        <div className="relative">
          <Input
            placeholder="******"
            className="bg-transparent !py-7 !px-6 border-2 border-black1 !rounded-2xl font-Montserrat-Medium !text-xl placeholder:text-grays text-black1"
            name="password"
            type="password"
            register={register}
            error={errors.password?.message}
          />
        </div>
        <label className="text-xl font-Montserrat-Bold mb-2 block mt-12">
          CONFIRM PASSWORD
        </label>
        <div className="relative">
          <Input
            placeholder="*****"
            type="password"
            className="bg-transparent !py-7 !px-6 border-2 border-black1 !rounded-2xl font-Montserrat-Medium !text-xl placeholder:text-grays text-black1"
            name="confirm_password"
            register={register}
            error={errors.confirm_password?.message}
          />
        </div>
        <Button
          type="submit"
          isLoading={loading}
          disabled={loading}
          className="text-gxl shadows w-full mt-20"
        >
          SUBMIT
        </Button>
      </form>
    </div>
    </Modal>
  );
};
export default NiceModal.create(ResetPassword);
