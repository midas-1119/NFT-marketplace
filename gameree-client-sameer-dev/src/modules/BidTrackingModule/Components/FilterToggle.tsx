import React from "react";

import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface Iprops {
  children: any;
  title: string;
  title_class?: any;
}

const FilterToggle = ({ children, title, title_class }: Iprops) => {
  return (
    <div>
      <Disclosure as="div" defaultOpen={true} key="" className="mt-8">
        {({ open }) => (
          <>
            <Disclosure.Button className="flex items-center justify-between w-full ">
              <p className={`text-primary ${title_class} font-Montserrat-Bold`}>
                {title}
              </p>
              <ChevronDownIcon
                className={`${
                  open ? " " : "rotate-180 transform"
                } h-7 w-7 text-primary `}
              />
            </Disclosure.Button>
            <Disclosure.Panel as="dd" className="mt-2">
              {children}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default FilterToggle;
