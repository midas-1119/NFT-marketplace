import React, { useState } from "react";
import Image from "next/image";
import Input from "../../input/Input";
import Button from "../../button/Button";

const WithDrawCard = ({ setstate, setPopup }: any) => {
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
        <h3 className="text-5xl text-center">ADD FUNDS</h3>
      </div>
      <h3 className="text-black1 mb-4 text-5xl xs:text-4xl">
        SELECT THE AMOIUNT YOU WANT TO ADD
      </h3>
      <span className="text-lg font-Montserrat-Bold mb-2">ENTER AMOUNT</span>
      <div className="relative mb-12">
        <Input
          placeholder="1500"
          className="bg-transparent !py-5  border-2 border-black1 !rounded-2xl font-TTTrailers-Bold !text-[2rem] placeholder:text-grays text-black"
        />
        <Button
          onClick={() => setAble(true)}
          className="top-0 right-0 !absolute rounded-none bg-black1 rounded-r-2xl text-3xl font-TTTrailers-Regular h-full"
        >
          BNB
        </Button>
      </div>
      <div className="flex justify-between mb-4">
        <p className="text-base text-[#A7A7A7]">Pay through Debit or Credit card</p>
        <div className="flex gap-2 items-center">
          <div className="px-2 py-2 rounded-lg border-2 border-[#F2F2F2]">
            <Image src="/assets/images/visa-logo.svg" height={11} width={35}/>
          </div>
          <div className="px-2 py-2 rounded-lg border-2 border-[#F2F2F2]">
            <Image src="/assets/images/mastercard.svg" height={20} width={33}/>
          </div>
        </div>
      </div>

      <Button
        onClick={() => setstate(2)}
        className=" shadows w-full stripeBtnGradient mb-[1.125rem] flex justify-between !text-[2.5rem]"
      >
       CREDIT/DEBIT CARD
       <Image src="/assets/images/stripe.svg" height={70} width={70}/>
      </Button>
      <p className="text-base text-[#A7A7A7] font-Montserrat-Medium text-center mb-[1.125rem]">or pay through crypto currency</p>
      <Button
      onClick={() => setstate(2)}
        className=" !py-5 shadows w-full gradient flex justify-between mb-6 !text-[2.5rem]"
      >
       METAMASK
       <Image src="/assets/images/metamask.svg" height={40} width={40}/>
      </Button>
      
    </div>
  );
};

export default WithDrawCard;
