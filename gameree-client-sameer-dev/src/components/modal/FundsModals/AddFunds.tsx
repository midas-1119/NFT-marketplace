import React, { useState } from "react";
import Button from "../../button/Button";
import ImageComponent from "../../imageComponent/ImageComponent";
import Input from "../../input/Input";
import Image from "next/image";
import { RadioGroup } from "@headlessui/react";

const AddFunds = ({ setstate, setPopup }: any) => {
  const [plan, setPlan] = useState("startup");
  const [checked, setChecked] = useState(false);

  const [able, setAble] = useState(false);
  console.log(able, "ab");
  let UsdData = () => {
    if (able == false) {
      setChecked(true);
    }
    else{
      setstate(6)
    }
  };

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
        SELECT THE DESPOSIT DETAILS
      </h3>

      <RadioGroup value={plan} onChange={setPlan} className="">
        <div className="mt-6 flex gap-3 items-center flex-wrap">
          <RadioGroup.Option value="startup1" className="sm:mt-0 mt-6">
            {({ checked }) => (
              <div
                onClick={() => setAble(false)}
                className={`border-2  ${
                  checked
                    ? "border-purples bg-[rgba(130,100,226,0.1)]"
                    : " border-[#9FA0A2]"
                }    rounded-lg h-[5.375rem] w-[5.375rem] flex justify-center items-center`}
              >
                <ImageComponent
                  figClassName="cursor-pointer  flex-shrink-0"
                  src="/assets/images/cr-card.png"
                  width={44}
                  height={33}
                  objectFit="cover"
                />
              </div>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value="startup2" className="sm:mt-0 mt-6">
            {({ checked }) => (
              <div
                onClick={() => {
                  setAble(true);
                  setChecked(false);
                }}
                className={`border-2  ${
                  checked
                    ? "border-purples bg-[rgba(130,100,226,0.1)]"
                    : " border-[#9FA0A2]"
                }    rounded-lg h-[5.375rem] w-[5.375rem] flex justify-center items-center`}
              >
                <ImageComponent
                  figClassName="cursor-pointer flex-shrink-0"
                  src="/assets/images/mask.png"
                  width={40}
                  height={40}
                  objectFit="cover"
                />
              </div>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value="startup3" className="sm:mt-0 mt-6">
            {({ checked }) => (
              <div
                onClick={() => setAble(true)}
                className={`border-2  ${
                  checked
                    ? "border-purples bg-[rgba(130,100,226,0.1)]"
                    : " border-[#9FA0A2]"
                }    rounded-lg h-[5.375rem] w-[5.375rem] flex justify-center items-center`}
              >
                <ImageComponent
                  figClassName="cursor-pointer  flex-shrink-0"
                  src="/assets/images/c.png"
                  width={50}
                  height={50}
                  objectFit="cover"
                />
              </div>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value="startup4" className="sm:mt-0 mt-6">
            {({ checked }) => (
              <div
                onClick={() => setAble(true)}
                className={`border-2  ${
                  checked
                    ? "border-purples bg-[rgba(130,100,226,0.1)]"
                    : " border-[#9FA0A2]"
                }    rounded-lg h-[5.375rem] w-[5.375rem] flex justify-center items-center`}
              >
                <ImageComponent
                  figClassName="cursor-pointer flex-shrink-0"
                  src="/assets/images/global.png"
                  width={50}
                  height={50}
                  objectFit="cover"
                />
              </div>
            )}
          </RadioGroup.Option>
        </div>
      </RadioGroup>

      <div className="mt-12">
        <span className="text-lg font-Montserrat-Bold mb-2 m">
          ENTER AMOUNT
        </span>
        <div className="relative mb-12">
          <Input
            placeholder="100"
            className="bg-transparent !py-5  border-2 border-black1 !rounded-2xl font-TTTrailers-Bold !text-[2rem] placeholder:text-grays text-black"
          />
          <Button
            onClick={UsdData}
            // onClick={()=>{
            //   setstate(6)
            // }}

            className="top-0 right-0 !absolute rounded-none hover:!bg-black1 bg-black1 rounded-r-2xl text-[2rem] font-TTTrailers-Regular h-full"
          >
            {" "}
            <span className="flex  gap-2 items-center text-[2rem] font-TTTrailers-Bold">
              <span className={`${able == true ? "block " : "hidden"}`}>
                <Image
                  className={`  rounded-full `}
                  src="/assets/images/t.png"
                  height={36}
                  width={36}
                />
              </span>
              USDT{" "}
              <svg
                className={` ml-2 ${able == true ? "block " : "hidden"}`}
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.00039 0.800049L6.00039 4.80005L10.0004 0.800049L11.6004 1.60005L6.00039 7.20005L0.400391 1.60005L2.00039 0.800049Z"
                  fill="white"
                />
              </svg>
            </span>
          </Button>
        </div>
        <div className={`mb-12 ${checked ? "block" : "hidden"} `}>
          <h5 className="text-[#A1A1A5] font-Montserrat-Medium text-lg">
            Total tokens <span className="text-black1"> 2200 USDG</span>{" "}
          </h5>
          <h5 className="text-[#A1A1A5] font-Montserrat-Medium text-lg mt-4">
            Service fee <span className="text-black1"> 2.5%</span>{" "}
          </h5>
          <h5 className="text-[#A1A1A5] font-Montserrat-Medium text-lg mt-4">
            You will get <span className="text-black1"> 2145 USDG</span>{" "}
          </h5>
        </div>
      </div>
      {/* <div className="flex justify-between mb-4">
        <p className="text-base text-[#A7A7A7]">
          Pay through Debit or Credit card
        </p>
        <div className="flex gap-2 items-center">
          <div className="px-2 py-2 rounded-lg border-2 border-[#F2F2F2]">
            <Image src="/assets/images/visa-logo.svg" height={11} width={35} />
          </div>
          <div className="px-2 py-2 rounded-lg border-2 border-[#F2F2F2]">
            <Image src="/assets/images/mastercard.svg" height={20} width={33} />
          </div>
        </div>
      </div> */}

      {/* <Button
        onClick={() => setstate(2)}
        className=" shadows w-full stripeBtnGradient mb-[1.125rem] flex justify-between !text-[2.5rem]"
      >
        CREDIT/DEBIT CARD
        <Image src="/assets/images/stripe.svg" height={70} width={70} />
      </Button> */}
      {/* <p className="text-base text-[#A7A7A7] font-Montserrat-Medium text-center mb-[1.125rem]">
        or pay through crypto currency
      </p> */}
      <Button
        onClick={() => setstate(7)}
        className=" !py-5  w-full flex justify-center shadows items-center  rounded-[3.438rem] mb-6 !text-[2.5rem]"
      >
        ADD FUNDS
      </Button>
    </div>
  );
};

export default AddFunds;
