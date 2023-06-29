import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";

interface Iprops {
  className?: string;
  Data?: any;
  iconClass?: string;
  selected: any;
  setSelected: any
}

export default function CreateYourOwnSelect({
  className,
  Data,
  iconClass,
  selected,
  setSelected
}: Iprops) {

  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative w-full ">
        <Listbox.Button className="relative flex items-center pl-4 sm:pl-10 w-full bg-white  border border-[#C1C9D0] py-7  font-Roboto-Regular text-2xl sm:text-3xl text-left rounded-[4.5px]  focus:outline-none ">
          <span className="text-lightgrey block truncate">
            {selected?.name ? selected?.name : "Choose Template"}
          </span>
          <span className="pointer-events-none absolute  inset-y-1/2 right-0 sm:right-6 flex items-center pr-5">
            <i
              className={`${iconClass ? iconClass : ""
                } icon-angle text-[#9DAFBD] block rotate-90 text-2xl`}
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className={`relative border border-[#C1C9D0] max-h-[23rem] -mt-24  w-full font-Roboto-Regular text-2xl 
            sm:text-3xl text-left  overflow-auto rounded-[4.5px] bg-white z-10   focus:outline-none`}
          >
            {Data.map((item: any, Idx: any) => (
              <Listbox.Option
                key={Idx}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-7 px-4 sm:px-11  ${active ? "bg-[#F5F8FA] " : ""
                  }`
                }
                value={item}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${selected ? " text-lightgrey" : " text-lightgrey "
                        }`}
                    >
                      {item.name}
                    </span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
