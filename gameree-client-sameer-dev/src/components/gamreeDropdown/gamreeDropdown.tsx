import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import Button from "../button/Button";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
export default function GamreeDropdown({ logout }: any) {
  const router = useRouter();

  const MenuItems = ({ text,icon, href }: any) => {
    return (
      <Menu.Item>
        <div onClick={() => router.push(`${href}`)} className="cursor-pointer">
          <a
            className={classNames(
              "text-[2.5rem] text-black1 font-TTTrailers-Bold"
            )}
          >
            <i className={`${icon} text-purples mr-5`}></i>

            {text}
          </a>
        </div>
      </Menu.Item>
    );
  };

  return (
    <Menu as="div" className="relative inline-block text-left leading-0">
      <Menu.Button>
        <Button className="sm:!px-6 !px-3 xs:!text-xl  gap-4 !text-4xl whitespace-nowrap xs:!py-4  flex sm:gap-8 items-center">
          GAMEREE WORLD
          <i className="icon-Arrow text-sm"></i>
        </Button>
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
        <Menu.Items className="z-50 border-[5px] border-[#070E1E] shadow-[7px_8px_37px_#6B2E6F] absolute sm:right-0 -right-[12.188rem] mt-7  w-[20.875rem] rounded-xl  bg-white   focus:outline-none">
          <div className="pt-6 pb-9 px-7 space-y-5  flex flex-col">
            <MenuItems icon="icon-2d" text="2D MAPS" href="/mapview" />
            <MenuItems icon="icon-3d" text="3D MAPS" href="/mapview" />
            <MenuItems icon="icon-metavers" text="METAVERSE " href="javascript:void(0)" />
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
