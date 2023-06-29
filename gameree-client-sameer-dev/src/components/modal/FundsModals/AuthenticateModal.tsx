import React, { useState } from "react";
import PinField from "react-pin-field";
import Button from "../../button/Button";
const AuthenticateModal = ({ setstate, setPopup }: any) => {
  const [fullCode, setFullCode] = useState("");
  return (
    <div className="sm:w-[44.125rem] w-full">
      <div className="rounded-[3.5rem] bg-black1 py-4 px-8  relative mb-8">
        <i
          className="icon-back text-white absolute text-2xl top-[50%] -translate-y-1/2 left-8 cursor-pointer "
          onClick={() => {
            setPopup(false);
          }}
        ></i>
        <h3 className="text-5xl text-center">AUTHENTICATE</h3>
      </div>

      <h3 className="text-[#070E1E] leading-[4.25rem] text-5xl font-TTTrailers-Bold mb-1">
        Authenticate Your Account
      </h3>
      <p className="sm:w-[36.438rem] text-[#A7A7A7] text-base leading-[20px] mb-[3.875rem]">
        Two factor authentication. Please confirm your account by entering the
        authentication code sent to *****@email.com
      </p>

      <div className="sm:w-[21.62rem]   grid grid-cols-4  mx-auto my-[3.75rem] gap-4 mb-[5.813rem]">
        <PinField
          type=""
          length={4}
          validate={/^[0-9]$/}
          onChange={async (pin) => {
            await setFullCode(pin);

            // if (pin && pin.length === 4) {
            //   autoSubmitForm(pin);
            // }
          }}
          className="h-[4.75rem] text-center  text-[2rem] font-Poppins-Bold  inline-block border-2 dark:text-[#000000] border-[#000000] dark:bg-transparent  dark:border-b-2 dark:border-x-0 dark:rounded-none dark:border-t-0  rounded-lg outline-none"
        />
      </div>
      <Button className=" !py-5 shadows  w-full flex justify-center items-center  rounded-[3.438rem] mb-7 !text-[2.5rem]"
      onClick={()=>{
        setstate(2)
      }}
      >
        SUBMIT
      </Button>
      <p className="sm:w-[21.25rem] text-base text-center mx-auto ">
        It may take a minute to receive your code. Haven’t recieved it? <span className="text-[#070E1E] font-Montserrat-Medium">Resend new code.</span>
      </p>
    </div>
  );
};

export default AuthenticateModal;
