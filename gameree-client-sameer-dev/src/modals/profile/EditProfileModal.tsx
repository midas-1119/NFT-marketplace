import React from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { validateEditProfileForm } from "../../schemas/user.schema";
import {
  selectLoading,
  selectMessage,
  selectUser,
} from "../../store/auth/selector";
import { useForm } from "react-hook-form";
import { editUserDetails } from "../../store/auth/async.fun";
import { userService } from "../../services/user.service";
import { toast } from "react-toastify";
import { authActions } from "../../store/auth/auth";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import Modal from "../../components/modal/Modal";
import { SETTINGS, SUCCESS } from "../../constants";
import { handleShowModal } from "../../utils/showModal";
import InputError from "../../components/input/InputError";
import ImageComponent from "../../components/imageComponent/ImageComponent";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";

const EditProfileModal = () => {
  const modal = useModal();
  const user = useSelector(selectUser);
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
    resolver: yupResolver(validateEditProfileForm),
    defaultValues: {
      username: user.username,
      fullName: user.fullName,
      email: user.email,
    },
  });
  const onSubmit = async (data: any) => {
    if (!validateEmail(data.email) || !validateUsername(data.username)) return;
    const obj = data;
    if (data.username) {
      obj.username = obj.username.toLowerCase().trim();
    }
    const res = await dispatch(editUserDetails(obj));
    if (res.meta && res.meta.requestStatus === "fulfilled") {
      dispatch(authActions.setType("edit"));
      handleShowModal(SUCCESS, {
        type: "edit",
      });
      modal.remove();
    }
  };

  const onSubmitAvatar = async (e: any) => {
    const formData = new FormData();
    formData.append("avatar", e.target.files[0]);
    const resp = await dispatch(editUserDetails(formData));
    if (resp.meta && resp.meta.requestStatus === "fulfilled") {
      toast.success(resp.payload.message);
    }
  };

  const validateUsername = async (value: string) => {
    try {
      if (!value) return;
      if (value === user.username) return;
      const res = await userService.validateUser({
        identifier: value,
      });
      if (!res.data.data.isRegistered) {
        clearErrors("username");
        setValue("username", value, { shouldValidate: true });
      } else {
        setError("username", {
          type: "manual",
          message: "This username is already registered!",
        });
      }
      return res.data.data.isRegistered;
    } catch (error) {}
  };

  const validateEmail = async (value: string) => {
    try {
      if (value === user.email) return;
      const res = await userService.validateUser({
        identifier: value,
      });
      if (!res.data.data.isRegistered) {
        clearErrors("email");
        setValue("email", value, { shouldValidate: true });
      } else {
        setError("email", {
          type: "manual",
          message: "This email is already registered!",
        });
      }
      return res.data.data.isRegistered;
    } catch (error) {}
  };
  const handleShow = (modalName: string) => {
    handleShowModal(modalName);
    modal.remove();
  };
  return (
    <Modal
      hide={() => modal.remove()}
      show={modal.visible}
      afterClose={() => modal.remove()}
    >
      <div className="sm:w-[44.125rem] w-full">
        <div className="rounded-[3.5rem] bg-black1 py-4 px-8  relative mb-8">
          <i
            className="icon-back text-white absolute text-2xl top-[50%] -translate-y-1/2 left-8 cursor-pointer "
            onClick={() => handleShow(SETTINGS)}
          ></i>
          <h3 className="text-5xl text-center">Edit Profile</h3>
        </div>
        <div className="relative">
          {message && <InputError error={message} />}
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="relative w-[7rem]">
            <ImageComponent
              src={user.avatar ?? "/assets/images/profile.png"}
              width={117}
              height={117}
              objectFit="cover"
              className="rounded-xl "
              figClassName="flex-shrink-0"
            />
            <div
              className="absolute bg-purples rounded-full flex justify-center items-center right-0 top-0 cursor-pointer mb-9"
              style={{ height: "2.13rem", width: "2.13rem" }}
            >
              <label className="relative cursor-pointer block ">
                <input
                  accept=".jpeg,.png,.gif,.jpg"
                  type="file"
                  className="w-0 absolute  hidden"
                  onChange={onSubmitAvatar}
                />
                <svg
                  width="19"
                  height="18"
                  viewBox="0 0 19 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.3744 1.26564C12.6031 0.0611936 14.596 0.0611936 15.8247 1.26564L17.1003 2.51603C18.329 3.72047 18.329 5.67404 17.1003 6.87848L7.51255 16.2769C6.96431 16.8143 6.221 17.1158 5.44516 17.1158H1.51863C1.15386 17.1158 0.860744 16.8212 0.869835 16.4638L0.968605 12.5801C0.988242 11.846 1.29465 11.1462 1.82426 10.6271L11.3744 1.26564ZM10.6321 3.79088L2.74207 11.5268C2.44768 11.8153 2.27707 12.205 2.26617 12.6126L2.18375 15.843L5.44516 15.8435C5.82892 15.8435 6.19797 15.7111 6.48927 15.4718L6.59473 15.3772L14.5238 7.6048L10.6321 3.79088ZM14.9069 2.16532C14.1851 1.45776 13.014 1.45776 12.2922 2.16532L11.5506 2.89112L15.4413 6.70503L16.1825 5.9788C16.8642 5.31054 16.9021 4.24947 16.2961 3.53756L16.1825 3.41571L14.9069 2.16532Z"
                    fill="white"
                  />
                </svg>
              </label>
            </div>
          </div>
          <div className="flex sm:flex-row flex-col gap-7 mt-14">
            <div className="w-full">
              <label className="text-xl font-Montserrat-Bold mb-2 block ">
                FULL NAME
              </label>
              <div className="relative">
                <Input
                  name="fullName"
                  placeholder="John Doe"
                  register={register}
                  error={errors.fullName?.message}
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
                  placeholder="@johndoe"
                  register={register}
                  error={errors.username?.message}
                  className="bg-transparent !py-7 !px-6 border-2 border-black1 !rounded-2xl font-Montserrat-Medium !text-xl placeholder:text-grays text-black1"
                  maxLength={14}
                  onChange={(e: any) => setValue("username", e.target.value)}
                  onBlur={(e: any) => validateUsername(e.target.value)}
                />
              </div>
            </div>
          </div>
          <label className="text-xl font-Montserrat-Bold mb-2 block mt-8">
            EMAIL ADDRESS
          </label>
          <div className="relative mb-11">
            <Input
              name="email"
              placeholder="johndoe@mail.com"
              register={register}
              error={errors.email?.message}
              className="bg-transparent !py-7 !px-6 border-2 border-black1 !rounded-2xl font-Montserrat-Medium !text-xl placeholder:text-grays text-black1"
              onBlur={(e: any) => validateEmail(e.target.value)}
              readOnly={user.email}
            />
          </div>

          <div className="flex justify-center ">
            <Button
              type="submit"
              isLoading={loading}
              disabled={loading}
              className="text-gxl shadows w-[70%] "
            >
              UPDATE PROFILE
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
export default NiceModal.create(EditProfileModal);
