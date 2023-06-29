import React from "react";
import ImageComponent from "../../imageComponent/ImageComponent";
const PayWithComponent = () => {
  return (
    <>
      <p className="text-white opacity-[0.5] text-sm font-Montserrat-Regular mt-14">
        PAY WITH
      </p>
      <div className="flex gap-3">
        <ImageComponent
          figClassName="cursor-pointer leading-0 rounded-full mt-2 overflow-hidden flex-shrink-0"
          src="/assets/images/card/01.svg"
          width={38}
          height={38}
          objectFit="cover"
          className="rounded-2xl"
        />
        <ImageComponent
          figClassName="cursor-pointer leading-0 rounded-full mt-2 overflow-hidden flex-shrink-0"
          src="/assets/images/card/02.svg"
          width={38}
          height={38}
          objectFit="cover"
          className="rounded-2xl"
        />
        <ImageComponent
          figClassName="cursor-pointer leading-0 rounded-full mt-2 overflow-hidden flex-shrink-0"
          src="/assets/images/card/03.svg"
          width={38}
          height={38}
          objectFit="cover"
          className="rounded-2xl"
        />{" "}
        <ImageComponent
          figClassName="cursor-pointer leading-0 rounded-full mt-2 overflow-hidden flex-shrink-0"
          src="/assets/images/card/04.svg"
          width={38}
          height={38}
          objectFit="cover"
          className="rounded-2xl"
        />{" "}
        <ImageComponent
          figClassName="cursor-pointer leading-0 rounded-full mt-2 overflow-hidden flex-shrink-0"
          src="/assets/images/card/05.svg"
          width={38}
          height={38}
          objectFit="cover"
          className="rounded-2xl"
        />{" "}
        {/* <ImageComponent
          figClassName="cursor-pointer leading-0 rounded-full mt-2 overflow-hidden flex-shrink-0"
          src="/assets/images/card/06.svg"
          width={38}
          height={38}
          objectFit="cover"
          className="rounded-2xl"
        /> */}
      </div>
    </>
  );
};
export default PayWithComponent;
