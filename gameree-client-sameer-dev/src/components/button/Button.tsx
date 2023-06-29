import React from "react";
import { ImSpinner9 } from "react-icons/im";

interface Iprops {
  className?: string;
  children: any;
  type?: any;
  onClick?: any;
  disabled?: boolean;
  isLoading?: boolean;
  disabledClass?: string;
}

const Button = ({
  children,
  className,
  type,
  disabled,
  isLoading,
  disabledClass,
  ...rest
}: Iprops) => {
  return (
    <button
      className={`${
        disabled &&
        `${
          disabledClass
            ? disabledClass
            : "opacity-20 hover:bg-transparent disabled:text-white"
        }`
      } inline-flex items-center justify-center px-6 sm:px-9 pt-3 pb-1.5 border
       border-transparent bg-purples hover:bg-[#7756e5] active:bg-[#4d2db5] relative text-primary font-TTTrailers-Bold text-3xl  md:text-5xl rounded-full 
       focus:outline-none , ${
         isLoading &&
         "relative !text-transparent hover:!text-transparent !cursor-wait !transition-none"
       }, ${className ? className : ""} `}
      type={type ? type : "button"}
      disabled={disabled ? true : false}
      {...rest}
    >
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
          <ImSpinner9 className="animate-spin text-2xl" />
        </div>
      )}
      {children}
    </button>
  );
};

export default Button;
