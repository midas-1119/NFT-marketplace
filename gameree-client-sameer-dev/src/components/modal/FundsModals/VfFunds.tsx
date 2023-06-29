import React from "react";
import Button from "../../button/Button";
import ImageComponent from "../../imageComponent/ImageComponent";

const VfFunds = ({ setstate, setPopup }: any) => {
  return (
    <div className="sm:w-[44.125rem] w-full">
      <div className="rounded-[3.5rem] bg-black1 py-4 px-8  relative mb-8">
        <i
          className="icon-back text-white absolute text-2xl top-[50%] -translate-y-1/2 left-8 cursor-pointer "
          onClick={() => {
            setPopup(false);
          }}
        ></i>
        <h3 className="text-5xl text-center">ADD FUNDS</h3>
      </div>
      <ImageComponent
        src="/assets/images/modal/verify.gif"
        width={200}
        height={200}
        objectFit="cover"
        className="rounded-xl"
        figClassName="flex-shrink-0 table mx-auto"
      />
      <h3 className="text-black text-center">VERIFYING PAYMENT</h3>

      <div className="flex justify-center mt-4 ">
        <Button onClick={() => setstate(3)} className="!px-13">
          Next
        </Button>
      </div>
    </div>
  );
};

export default VfFunds;
