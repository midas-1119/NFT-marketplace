import React from "react";
import ImageComponent from "../../imageComponent/ImageComponent";
import Input from "../../input/Input";

const CoinsData = [
  {
    coins: "BSC",
    image: "/assets/images/modal/coins/coin1.svg",
  },
  {
    coins: "DAI",
    image: "/assets/images/modal/coins/coin2.svg",
  },
  {
    coins: "SAND",
    image: "/assets/images/modal/coins/coin3.svg",
  },
  {
    coins: "USDT",
    image: "/assets/images/modal/coins/coin4.svg",
  },
];
const TokenData=[
    {
        token:"MATIC Token",
        name:"MATIC",
        image: "/assets/images/modal/coins/token1.svg",

    },
    {
        token:"Wrapped Ether",
        name:"WETH",
        image: "/assets/images/modal/coins/token2.svg",

    },
    {
        token:"USD Coin",
        name:"USDC",
        image: "/assets/images/modal/coins/token3.svg",

    },
    {
        token:"Aave Token",
        name:"AAVE",
        image: "/assets/images/modal/coins/token4.svg",

    },
]

const SelectToken = ({ setstate, setPopup }: any) => {
  return (
    <div className="sm:w-[44.125rem] w-full">
      <div className="rounded-[3.5rem] bg-black1 py-4 px-8  relative mb-10">
        <div
          onClick={() => setPopup(false)}
          className="absolute right-8 top-[50%] -translate-y-1/2"
        >
          <ImageComponent
            src="/assets/images/modal/cross.svg"
            width={30}
            height={29}
            objectFit="cover"
            className="rounded-xl"
            figClassName="flex-shrink-0 table cursor-pointer"
          />
        </div>
        <h3 className="sm:text-5xl text-2xl text-center">SELECT YOUR TOKEN</h3>
      </div>
      <div className="relative mb-7">
        <Input
          placeholder="Enter the token symbol or address."
          className="border border-[#9FA0A2] !py-[18px] !text-xl placeholder:text-[#6E6D81] text-black1 pl-[4.188rem]"
        />
        <div
          onClick={() => setPopup(false)}
          className="absolute left-7 top-[50%] -translate-y-1/2"
        >
          <ImageComponent
            src="/assets/images/modal/icon-search.svg"
            width={20}
            height={19}
            objectFit="cover"
            className="rounded-xl"
            figClassName="flex-shrink-0 table cursor-pointer"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-5 pb-8 border-b border-[#E8E8E8] mb-6">
        {CoinsData.map((item) => (
          <div className=" px-[0.625rem] py-[0.625rem] border border-[#6E6D81] rounded-lg flex gap-2 cursor-pointer">
            <ImageComponent
              src={item.image}
              width={24}
              height={24}
              objectFit="cover"
              className="rounded-xl"
              figClassName="flex-shrink-0 table cursor-pointer"
            />
            <span className="text-base font-Montserrat-Regularrem text-[#4F4F4F]">{item.coins}</span>
          </div>
        ))}
      </div>
      <div className="pb-[1.75rem]">
        {
            TokenData.map((item)=>(
                <div className="flex gap-[0.625rem] mb-[1.375rem] items-center justify-start">
             <ImageComponent
              src={item.image}
              width={40}
              height={40}
              objectFit="cover"
              className="rounded-xl"
              figClassName="flex-shrink-0 table cursor-pointer"
            />
            <div>
                <h5 className="text-[#4F4F4F] text-base font-Montserrat-SemiBold">{item.token}</h5>
                <p className="text-[#6E6D81] text-sm">{item.name}</p>

            </div>

                </div>
            ))

        }
      </div>
    </div>
  );
};

export default SelectToken;
