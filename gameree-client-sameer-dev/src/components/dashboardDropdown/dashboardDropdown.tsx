import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/router";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
export default function dashboardDropdown({ logout }: any) {
  const [popup, setPopup] = useState(false);
  const [state, setState] = useState(0);
  const router = useRouter();

  const MenuItems = ({ text, state, pop, className }: any) => {
    return (
      <Menu.Item>
        {({ active }) => (
          <div
            onClick={() => {
              setState(state);
              setPopup(pop);
            }}
          >
            <a
              href="#"
              className={classNames(
                "text-[2rem] text-black1 font-TTTrailers-Bold "
              )}
            >
              {text}
            </a>
          </div>
        )}
      </Menu.Item>
    );
  };

  return (
    <div>
      <Menu as="div" className="relative inline-block text-left leading-0">
        <Menu.Button className=" border-gray-600 -z-10">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="18.2768" cy="18.2768" r="17.7231" fill="#232330" />
            <path
              d="M19.875 24.25C19.875 24.7473 19.6775 25.2242 19.3258 25.5758C18.9742 25.9275 18.4973 26.125 18 26.125C17.5027 26.125 17.0258 25.9275 16.6742 25.5758C16.3225 25.2242 16.125 24.7473 16.125 24.25C16.125 23.7527 16.3225 23.2758 16.6742 22.9242C17.0258 22.5725 17.5027 22.375 18 22.375C18.4973 22.375 18.9742 22.5725 19.3258 22.9242C19.6775 23.2758 19.875 23.7527 19.875 24.25ZM19.875 18C19.875 18.4973 19.6775 18.9742 19.3258 19.3258C18.9742 19.6775 18.4973 19.875 18 19.875C17.5027 19.875 17.0258 19.6775 16.6742 19.3258C16.3225 18.9742 16.125 18.4973 16.125 18C16.125 17.5027 16.3225 17.0258 16.6742 16.6742C17.0258 16.3225 17.5027 16.125 18 16.125C18.4973 16.125 18.9742 16.3225 19.3258 16.6742C19.6775 17.0258 19.875 17.5027 19.875 18ZM19.875 11.75C19.875 12.2473 19.6775 12.7242 19.3258 13.0758C18.9742 13.4275 18.4973 13.625 18 13.625C17.5027 13.625 17.0258 13.4275 16.6742 13.0758C16.3225 12.7242 16.125 12.2473 16.125 11.75C16.125 11.2527 16.3225 10.7758 16.6742 10.4242C17.0258 10.0725 17.5027 9.875 18 9.875C18.4973 9.875 18.9742 10.0725 19.3258 10.4242C19.6775 10.7758 19.875 11.2527 19.875 11.75Z"
              fill="white"
            />
          </svg>
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
          <Menu.Items className="z-50 border-[3px] py-4 border-[#070E1E]  shadow-[7px_8px_37px_#6B2E6F] absolute right-0  mt-2  w-[11.188rem] rounded-xl  bg-white   focus:outline-none">
            <div className="p-4 flex flex-col  gap-6 gap-y-10">
              <MenuItems state={1} pop={true} text="CHANGE PRICE" />
              <MenuItems text="UNLIST" />
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
