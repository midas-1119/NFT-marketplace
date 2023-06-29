import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { authActions } from "../../store/auth/auth";
import { useDispatch } from "react-redux";
import { handleShowModal } from "../../utils/showModal";
import { SETTINGS } from "../../constants";
import moment from "moment";
import { authService } from "../../services/auth.service";
import { HttpService } from "../../services/base.service";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
const ProfileDropdown = ({ user }: any) => {
  const router = useRouter();

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(authActions.logout());
    HttpService.setToken(null);
    router.push("/");
  };

  const MenuItems = ({ text, onClick }: any) => {
    return (
      <Menu.Item>
        <div onClick={onClick} className="cursor-pointer">
          <a
            className={classNames(
              "text-[2.5rem] text-black1 font-TTTrailers-Bold"
            )}
          >
            {text}
          </a>
        </div>
      </Menu.Item>
    );
  };

  return (
    <Menu as="div" className="relative inline-block text-left leading-0">
      <Menu.Button className=" border-gray-600 -z-10 w-[3.3rem] h-[3.3rem] rounded-full">
        <Image
          src={user.avatar ?? "/assets/images/profile.png"}
          objectFit="contain"
          layout="fill"
          alt="Profile"
          priority
          className="rounded-full"
        />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="z-50 border-[5px] border-[#070E1E] shadow-[7px_8px_37px_#6B2E6F] absolute right-0 mt-7  w-60 rounded-xl  bg-white   focus:outline-none">
          <div className="py-12 flex flex-col space-y-10 items-center gap-6">
            <MenuItems
              text="DASHBOARD"
              onClick={() => router.push("/dashboard")}
            />
            <MenuItems
              text="SETTINGS"
              onClick={() => handleShowModal(SETTINGS)}
            />
            <Menu.Item>
              <div onClick={() => handleLogout()} className="cursor-pointer">
                <a
                  className={classNames(
                    "text-[2.5rem] text-black1 font-TTTrailers-Bold"
                  )}
                >
                  Sign Out
                </a>
              </div>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
export default ProfileDropdown;
