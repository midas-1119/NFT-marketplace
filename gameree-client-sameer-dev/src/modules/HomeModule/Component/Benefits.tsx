import Image from "next/image";
import React from "react";

const Benefits = () => {
  return (
    <div>
      <div className="flex flex-col justify-center items-center container ">
        <h2 className="Headings font-TTTrailers-SemiBold text-center mb-[5.625rem] px-4  border-b-[11px] border-purples">
          BENEFITS
        </h2>
        <h2 className="Headings  text-center  !font-TTTrailers-SemiBold">
          WORLD’S FIRST REAL ESTATE BASED
        </h2>
        <h2 className="Headings  text-center  !font-TTTrailers-SemiBold   mb-5">
          <span className="text-purples">NFT MARKETPLACE </span>& TRADING
          PLATFORM.
        </h2>

        <div className="lg:w-[63.813rem] w-full grid  md:grid-cols-2 grid-cols-1 gap-[5.188rem] lg:gap-[7.188rem]">
          <div className="bg-[#191B20] border border-[#5E6063] pt-6 pb-7 flex flex-col items-center rounded-[20px]">
            <figure className="mb-6">
              <Image
                src="/assets/images/dollar-img.svg"
                width={81}
                height={81}
              />
            </figure>
            <h5 className="!font-Montserrat-SemiBold xs:text-lg text-xl xs:px-4 text-center leading-[24px] px-6 uppercase">
              book and own your digital land in the metaverse and participate
              early in the metaverse for exponential returns
            </h5>
          </div>

          <div className="bg-[#191B20] border border-[#5E6063] pt-6 pb-7 flex flex-col items-center rounded-[20px]">
            <figure className="mb-6">
              <Image
                src="/assets/images/binance-img.svg"
                width={81}
                height={81}
              />
            </figure>
            <h5 className="!font-Montserrat-SemiBold text-xl xs:text-lg xs:px-4 text-center leading-[24px] px-6 uppercase">
              Deposit BNB to fund your wallet with BNB stable coin for minting
              and resale in the metaverse
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benefits;
