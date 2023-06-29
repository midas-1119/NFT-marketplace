import React from "react";
import Button from "../../../button/Button";
import ImageComponent from "../../../imageComponent/ImageComponent";
import Input from "../../../input/Input";

const ListPropertyModal = ({ setstate, setPopup }: any) => {
  return (
    <div className="sm:w-[44.125rem] w-full">
      <div className="rounded-[3.5rem] bg-black1 py-4 px-8  relative mb-10">
        <i
          className="icon-back text-white absolute text-2xl top-[50%] -translate-y-1/2 left-8 cursor-pointer "
          onClick={() => {
            setPopup(false);
          }}
        ></i>
        <h3 className="text-5xl text-center">LIST PROPERTY</h3>
      </div>
      <div className="flex gap-3">
        <ImageComponent
          src="/assets/images/modal/NFT.png"
          width={62}
          height={63}
          objectFit="cover"
          className="rounded-xl"
          figClassName="flex-shrink-0 table"
        />
        <div className="mb-8">
          <h5 className="text-3xl text-black font-Montserrat-Bold mb-1">
            W1C 2DT
          </h5>
          <p>400 Oxford St, London W1A 1AB</p>
        </div>
      </div>

      <span className="text-lg font-Montserrat-Bold mb-2">PRICE</span>
      <div className="relative mb-12">
        <Input
          placeholder="0.00"
          className="bg-transparent !py-5  border-2 border-black1 !rounded-2xl font-TTTrailers-Bold !text-[2rem] placeholder:text-grays text-black"
        />
        <Button className="top-0 right-0 !absolute rounded-none bg-black1 rounded-r-2xl text-3xl font-TTTrailers-Regular h-full">
          USDG
        </Button>
      </div>
      <div className="flex justify-center ">
        <Button className="text-gxl shadows w-[70%] pt-4 pb-2 flex gap-4">
          <i className="icon-funds"></i>
          RESALE
        </Button>
      </div>
    </div>
  );
};

export default ListPropertyModal;
