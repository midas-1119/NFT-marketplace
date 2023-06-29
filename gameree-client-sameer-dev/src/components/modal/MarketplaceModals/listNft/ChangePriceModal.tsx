import React, { useState } from "react";
import Button from "../../../button/Button";
import ImageComponent from "../../../imageComponent/ImageComponent";
import Input from "../../../input/Input";

const ChangePriceModal = ({ setstate, setPopup }: any) => {
  const [able, setAble] = useState(false);
  return (
    <div className="sm:w-[44.125rem] w-full">
      <div className="rounded-[3.5rem] bg-black1 py-4 px-8  relative mb-8">
        <i
          className="icon-back text-white absolute text-2xl top-[50%] -translate-y-1/2 left-8 cursor-pointer "
          onClick={() => {
            setPopup(false);
          }}
        ></i>
        <h3 className="text-5xl text-center">CHANGE PRICE</h3>
      </div>
      <div className=" flex items-center gap-3">
        <ImageComponent
          src="/assets/images/modal/2.png"
          width={62}
          height={63}
          objectFit="cover"
          className="rounded-xl"
        />
        <div>
          <h5 className=" text-black">76 Wimpole St</h5>
          <p className="font-Montserrat-Regular text-lg text-black2">
            76 Wimpole St, London W1G 9RT, UK
          </p>
        </div>
      </div>
      <span className="text-lg font-Montserrat-Medium text-black1 mt-8 block mb-2">
        List your price
      </span>
      <div className="relative mb-11">
        <Input
          placeholder="240,000"
          className="bg-transparent !py-5  border-2 border-black1 !rounded-2xl font-TTTrailers-Bold !text-[2rem] placeholder:text-grays text-black"
        />
        <Button
          onClick={() => setAble(true)}
          className="top-0 right-0 !absolute rounded-none bg-black1 rounded-r-2xl text-3xl font-TTTrailers-Regular h-full"
        >
          BNB
        </Button>
      </div>
      <div className="flex justify-center">
        <Button
          onClick={() => {
            setstate(2);
          }}
          className="text-gxl shadows w-[70%]"
        >
          CHANGE PRICE
        </Button>
      </div>
    </div>
  );
};

export default ChangePriceModal;
