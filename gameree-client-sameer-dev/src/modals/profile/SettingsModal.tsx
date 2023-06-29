import NiceModal, { useModal } from "@ebay/nice-modal-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { authActions } from "../../store/auth/auth";
import { selectUser } from "../../store/auth/selector";
import Modal from "../../components/modal/Modal";
import ImageComponent from "../../components/imageComponent/ImageComponent";
import { handleShowModal } from "../../utils/showModal";
import { CHANGE_PASSWORD, EDIT_PROFILE, TWOFA } from "../../constants";

const SettingsModal = () => {
  const modal = useModal();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    clearMessage();
  }, []);

  const clearMessage = () => {
    dispatch(authActions.clear());
  };

  const handleShow = (modalName: string, payload?: any) => {
    handleShowModal(modalName, payload);
    modal.remove();
  };

  console.log(user, "user");

  return (
    <Modal
      hide={() => modal.remove()}
      show={modal.visible}
      afterClose={() => modal.remove()}
    >
      <div className="sm:w-[38rem] w-full">
        <div className="rounded-[3.5rem] bg-black1 py-4 pb-10 px-8 mb-10 relative">
          <svg
            className=" absolute text-2xl top-8 right-8 cursor-pointer "
            width="31"
            height="30"
            viewBox="0 0 31 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => modal.remove()}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M23.3327 0.0717337C23.1543 0.174947 23.0651 0.313356 23.0629 0.490493C23.0614 0.614653 22.7201 0.987499 21.4461 2.25656C20.151 3.54664 16.9703 6.61874 16.166 7.35633L16.0021 7.50661L15.5924 7.14917C14.0468 5.80034 13.0874 4.89596 13.0138 4.71821C12.9659 4.60264 12.7533 4.37606 12.5059 4.17694C12.2718 3.9886 11.7477 3.44397 11.3412 2.9667C10.9347 2.48948 10.3124 1.81022 9.95837 1.45735C9.52359 1.02397 9.29093 0.743015 9.24137 0.591636C9.14037 0.282849 8.86285 0.059068 8.58105 0.059068C8.4116 0.059068 8.16801 0.170928 7.57452 0.521426C4.89654 2.10269 3.52387 3.09652 2.7468 4.01673C2.58078 4.21329 2.40891 4.376 2.36484 4.37831C2.20112 4.38677 1.93181 4.73197 1.93181 4.93323C1.93181 5.09496 2.01639 5.21565 2.42986 5.64378C2.95827 6.19103 4.14036 7.2888 5.04082 8.06853C5.70247 8.64153 8.51241 10.9162 9.737 11.8701L10.6299 12.5658L10.4011 12.7884C10.2752 12.9108 9.46588 13.6767 8.6026 14.4902C6.50785 16.4644 0.232361 22.8142 0.101782 23.0917C0.0458202 23.2107 0 23.3752 0 23.4573C0 23.6661 0.23719 24.0031 0.460677 24.1117C0.564029 24.1619 0.740367 24.3442 0.852533 24.5169C1.58191 25.6395 2.87061 26.8078 4.81613 28.1102C5.73911 28.728 6.40951 29.0661 7.02757 29.2254C7.60398 29.374 7.7977 29.3778 8.32104 29.251C8.96597 29.0948 8.99349 29.0713 9.34919 28.3719C10.8652 25.3912 12.7966 22.2112 15.201 18.7374L16.2023 17.2907L16.3868 17.4645C16.4883 17.5601 17.4948 18.4577 18.6235 19.4592C19.7522 20.4607 21.0969 21.6874 21.6118 22.1852C23.7484 24.2508 25.2149 25.3079 26.0393 25.3769C26.3146 25.3999 26.3816 25.3824 26.5438 25.2447C26.649 25.1554 26.8062 25.0857 26.9031 25.0854C27.211 25.0843 27.6631 24.8185 28.0213 24.4279C28.3755 24.0417 29.1509 22.9806 29.6985 22.1327C30.0119 21.6475 30.0142 21.6455 30.2781 21.6426C30.7974 21.6369 31.0348 21.1849 30.7883 20.6713C30.4168 19.8971 29.4362 18.7468 28.2037 17.6392C26.9363 16.5003 24.4089 14.3656 22.4997 12.8213C21.3995 11.9314 20.7125 11.3358 20.7308 11.2877C20.7472 11.2445 21.6122 10.1184 22.6529 8.78524C23.6937 7.45217 25.0805 5.67185 25.7348 4.82898C26.6266 3.68017 26.9807 3.2686 27.1492 3.18487C27.4548 3.03313 27.5876 2.77854 27.6001 2.3202C27.6093 1.9837 27.5927 1.9272 27.4369 1.76315C27.2678 1.5851 26.8975 1.43171 26.7934 1.49656C26.7648 1.5144 26.0584 1.18455 25.2237 0.763597C24.389 0.342585 23.6492 -0.000972216 23.5797 2.0671e-06C23.5102 0.00103724 23.3991 0.0333104 23.3327 0.0717337ZM7.75079 8.24518C8.07673 8.44393 8.67342 8.89698 9.07668 9.25192C9.48001 9.6068 10.24 10.2594 10.7656 10.7021C11.2911 11.1447 11.7027 11.5069 11.68 11.5069C11.6574 11.5069 10.9286 10.9369 10.0604 10.2403C9.19217 9.54366 8.16945 8.73074 7.78762 8.43376C7.40579 8.13685 7.06621 7.8674 7.03301 7.83501C6.95984 7.76358 6.98054 7.77545 7.75079 8.24518ZM3.4574 21.9957C3.43941 22.0711 3.36443 22.2012 3.29078 22.2849C3.21713 22.3686 3.14016 22.4851 3.11976 22.5437C3.09935 22.6023 3.03965 22.6503 2.98719 22.6503C2.93466 22.6503 2.81157 22.6921 2.71359 22.7432C2.41205 22.9005 2.51431 22.7406 3.00337 22.29C3.26072 22.053 3.47545 21.859 3.48064 21.8588C3.48584 21.8588 3.47539 21.9203 3.4574 21.9957ZM8.34899 27.613C8.248 27.8266 8.16378 27.8588 7.93854 27.77C7.83392 27.7287 7.85813 27.7012 8.11965 27.5639C8.28567 27.4769 8.42783 27.4043 8.43562 27.4028C8.44335 27.4012 8.40441 27.4958 8.34899 27.613Z"
              fill="white"
            />
          </svg>
          <h3 className="text-5xl text-center mb-10">Settings</h3>
          <div className="flex xs:flex-col flex-row justify-between">
            <div className="flex gap-3 xs:mb-5">
              <ImageComponent
                src="/assets/images/profile.png"
                width={67}
                height={67}
                objectFit="cover"
                className="rounded-xl"
                figClassName="flex-shrink-0 table"
              />
              <div>
                <h4 className="mb-1 text-3xl">{user.fullName ?? ""}</h4>
                <p className="text-lg">@{user.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-2xl">
                {user.metamaskId
                  ? user.metamaskId.substring(0, 8) +
                    "..." +
                    user.metamaskId.substring(user.metamaskId.length - 5)
                  : ""}
              </p>
              <i
                className="icon-copy text-white"
                onClick={() => {
                  navigator.clipboard.writeText(user.metamaskId);
                  toast.success("copied");
                }}
              ></i>
            </div>
          </div>
        </div>
        <h2
          className="text-7xl text-black1 font-TTTrailers-Bold mb-10 cursor-pointer"
          onClick={() => handleShow(EDIT_PROFILE)}
        >
          EDIT PROFILE
        </h2>
        <h2
          className="text-7xl  text-black1 font-TTTrailers-Bold mb-10  cursor-pointer"
          onClick={() => handleShow(CHANGE_PASSWORD)}
        >
          Change Password
        </h2>
        <h2
          className={`text-7xl  text-black1 font-TTTrailers-Bold mb-4 cursor-pointer`}
          onClick={() => {
            if (!user?.isTwoFactorAuthenticationEnabled) {
              handleShow(TWOFA, { isAuth: false });
            }
          }}
        >
          {!user?.isTwoFactorAuthenticationEnabled
            ? "Enable 2FA"
            : "2FA Enabled"}
        </h2>
      </div>
    </Modal>
  );
};
export default NiceModal.create(SettingsModal);
