import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { IoIosArrowDown } from "react-icons/io";

interface Iprops {
  selected: any;
  setSelected: any;
  className?: string;
  Data?: any;
  iconClass?: string;
  placeholder?: any;
}

export default function SelectComponent({
  className,
  Data,
  iconClass,
  placeholder,
  selected,
  setSelected,
}: Iprops) {
  return (
    <Listbox as="div" value={selected} onChange={setSelected}>
      <div className="relative mt-1">
        <Listbox.Button
          className="relative flex items-center justify-between w-full  bg-white   border border-[#C1C9D0] py-4 pl-6 pr-14
          font-Roboto-Medium text-xl text-left rounded-[4.5px]  focus:outline-none "
        >
          <span
            className={`text-lightgrey block truncate`}
            title={selected?.name || placeholder}
          >
            {selected?.name || placeholder}
          </span>
          <span className="pointer-events-none absolute  inset-y-1/2 right-5 flex items-center ">
            <i
              className={`${iconClass ? iconClass : ""} text-primary  text-2xl`}
              aria-hidden="true"
            >
              <IoIosArrowDown />
            </i>
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className={` absolute border border-[#C1C9D0] max-h-[20.5rem]  w-full mt-1  
              font-Roboto-Medium text-xl overflow-auto rounded-[4.5px] bg-white z-10 focus:outline-none`}
          >
            {Data.map((item: any, Idx: any) => {
              return (
                <>
                  <Listbox.Option
                    key={Idx}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-4 px-6  ${
                        active ? "bg-[#F5F8FA] " : ""
                      }`
                    }
                    value={item}
                  >
                    <div className="truncate text-primary">{item.name}</div>
                  </Listbox.Option>
                </>
              );
            })}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
