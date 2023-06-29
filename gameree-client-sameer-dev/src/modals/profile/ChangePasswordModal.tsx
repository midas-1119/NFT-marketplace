import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectLoading, selectMessage } from "../../store/auth/selector";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validateChangePasswordForm } from "../../schemas/user.schema";
import { changePassword } from "../../store/auth/async.fun";
import { authActions } from "../../store/auth/auth";
import InputError from "../../components/input/InputError";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import Modal from "../../components/modal/Modal";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { handleShowModal } from "../../utils/showModal";
import { SETTINGS, SUCCESS } from "../../constants";

const ChangePasswordModal = () => {
  const modal = useModal()
  const loading = useSelector(selectLoading);
  const message = useSelector(selectMessage);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validateChangePasswordForm),
  });

  const onSubmit = async (data: any) => {
    const { confirm_password, ...rest } = data;
    const res = await dispatch(changePassword(rest));
    if (res.meta && res.meta.requestStatus === "fulfilled") {
      handleShowModal(SUCCESS,{
        type: "editPassword"
      })
      modal.remove()
    }
  };

  const handleShow = ( modalName : string ) => {
    handleShowModal(modalName)
    modal.remove()
  }
  return (
    <Modal hide={()=>modal.remove()} show={modal.visible} afterClose={()=> modal.remove()}>
    <div className="sm:w-[44.125rem] w-full">
      <div className="rounded-[3.5rem] bg-black1 py-4 px-8  relative mb-10">
        <i
          className="icon-back text-white absolute text-2xl top-[50%] -translate-y-1/2 left-8 cursor-pointer "
          onClick={() => handleShow(SETTINGS)}
        ></i>
        <h3 className="text-5xl text-center">Change Password</h3>
      </div>
      <div className="relative">
        {message && <InputError error={message} />}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
      <label className="text-xl font-Montserrat-Bold mb-2 block mt-12">
        CURRENT PASSWORD
      </label>
      <div className="relative">
        <Input
          placeholder="*****"
          type="password"
          className="bg-transparent !py-7 !px-6 border-2 border-black1 !rounded-2xl font-Montserrat-Medium !text-xl placeholder:text-grays text-black1"
          name="currentPassword"
          register={register}
          error={errors.currentPassword?.message}
        />
      </div>
      <label className="text-xl font-Montserrat-Bold mb-2 block mt-12">
        NEW PASSWORD
      </label>
      <div className="relative">
        <Input
          placeholder="******"
          className="bg-transparent !py-7 !px-6 border-2 border-black1 !rounded-2xl font-Montserrat-Medium !text-xl placeholder:text-grays text-black1"
          type="password"
          name="newPassword"
          register={register}
          error={errors.newPassword?.message}
        />
      </div>
      <label className="text-xl font-Montserrat-Bold mb-2 block mt-12">
        CONFIRM PASSWORD
      </label>
      <div className="relative mb-[3.563rem]">
        <Input
          placeholder="*****"
          type="password"
          className="bg-transparent !py-7 !px-6 border-2 border-black1 !rounded-2xl font-Montserrat-Medium !text-xl placeholder:text-grays text-black1"
          name="confirm_password"
          register={register}
          error={errors.confirm_password?.message}
        />
      </div>
      <div className="flex justify-center mt-9">
        <Button type="submit" isLoading={loading} disabled={loading} className="text-gxl shadows w-[70%] ">UPDATE PASSWORD</Button>
      </div>
      </form>
    </div>
    </Modal>
  );
};
export default NiceModal.create(ChangePasswordModal);
