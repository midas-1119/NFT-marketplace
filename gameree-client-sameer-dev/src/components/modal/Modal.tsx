import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
interface Iprops {
  className?: string;
  children: any;
  show: any;
  hide: any;
  afterClose?: any;
  close?: any;
  hideBg?: boolean;
  style?: any;
}

export default function Modal({
  show,
  hide,
  children,
  className,
  afterClose,
  hideBg,
  style,
}: Iprops) {
  return (
    <Transition.Root show={show} as={Fragment} afterLeave={afterClose}>
      <Dialog
        as="div"
        className="fixed z-50 inset-0 overflow-auto"
        onClose={hide}
      >
        <div className=" flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center w-full sm:block sm:p-0">
          <Transition.Child>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />
          </Transition.Child>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen "
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div
            style={style}
            className={`${className}  inline-block align-top ${
              !hideBg && "bg-white"
            } w-full sm:w-auto
            rounded-[30px] sm:rounded-[56px] sm:px-8 px-4 text-left sm:pb-8 pb-10 sm:pt-4 pt-6 border-[5px] border-black1 overflow-auto shadow-xl
            transform transition-all sm:align-middle`}
          >
            <div className=" absolute top-14 right-14">
              <button
                type="button"
                className=" text-black text-xl hover:text-gray-500 focus:outline-none "
                onClick={() => hide()}
              >
                <span className="sr-only">Close</span>
                <i className="icon-cross" aria-hidden="true" />
              </button>
            </div>
            {/* <div className="bd w-full sm:w-[38rem] md:w-[44remrem] h-[40rem]"></div> */}
            {children}
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
