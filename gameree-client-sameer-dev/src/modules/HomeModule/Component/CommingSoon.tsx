import React from "react";
import ImageComponent from "../../../components/imageComponent/ImageComponent";

const CommingSoon = () => {
  return (
    <div className="container">
      <div className="bg-[#FFFFFF] py-11 px-10 rounded-[32px] grid xl:grid-cols-2  grid-cols-1 ">
        <ImageComponent
          figClassName="cursor-pointer leading-0  overflow-hidden flex-shrink-0 relative w-full w-full h-[37rem]"
          src="/assets/images/Mockup.svg"
          objectFit="cover"
          layout="fill"
          className="rounded-2xl"
        />
        <div className="">
          <h2 className="text-[#8264E2] sm:w-[25.375rem] text-center mx-auto  mb-6">
            A New World is a Click Away.
          </h2>
          <div className="flex justify-center items-center mb-[2.875rem]">
          <ImageComponent
          figClassName="cursor-pointer leading-0  overflow-hidden  relative"
          src="/assets/images/comming.svg"
          objectFit="cover"
         width={318}
         height={210}
          className="rounded-2xl"
        />
        </div>
        <p className="sm:w-[34.375rem] text-[#070E1E] text-2xl mx-auto text-center">We're building a 3D social chat platform so people can enjoy 3D Conversations.</p>
        </div>
      </div>
    </div>
  );
};

export default CommingSoon;
