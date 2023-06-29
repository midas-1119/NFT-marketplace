import React from "react";
import Button from "../../button/Button";
import ImageComponent from "../../imageComponent/ImageComponent";

const ForSaleModal = ({ setstate, setPopup }: any) => {
  return (
    <div className="sm:w-[38.125rem] w-full">
      <div className="bg-blue1 rounded-[2.8rem] text-center mb-8">
        <div className="rounded-[2.8rem] bg-black1 py-4 px-8 relative ">
          <i
            className="icon-cross text-white absolute text-2xl top-[50%] -translate-y-1/2 right-8 cursor-pointer "
            onClick={() => {
              setPopup(false);
            }}
          ></i>
          <h3 className="text-5xl">COSTA COFEE</h3>
          <p className="text-white">4 Great Portland St , London</p>
        </div>
        <p className="text-white text-xl py-2 uppercase">The Property is for sale</p>
      </div>
      <ImageComponent
        src="/assets/images/modal/map.png"
        layout="fill"
        objectFit="cover"
        className="rounded-xl"
        figClassName="flex-shrink-0 table mx-auto h-[16.625rem] w-[16.625rem] "
      />

      <div className="bg-[rgba(0,0,0,.4)] text-center pt-3 mt-6">
        <p className="text-sm text-lightgray">OWNER OF THE PROPERTY</p>
        <h4 className="mt-3">SALENA ZOBIC</h4>
        <div className="grid grid-cols-2 border-t border-[#070E1E2B] mt-4">
          <div className="border-r border-[#070E1E2B] py-4 pl-5">
            <p className="text-sm text-lightgray text-left">PRICE</p>
            <h4 className="mt-3">12.1 USDG</h4>
          </div>
          <div className="border-r border-[#070E1E2B] py-4 pl-5">
            <p className="text-sm text-lightgray text-left">SQFT SIZE</p>
            <h4 className="mt-3">218</h4>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 mt-4 gap-6 px-4 xs:grid-cols-1">
        <Button className="shadows bg-white text-4xl md:text-[2.8rem] !text-black1 w-full hover:!text-white ">
          <i className="icon-street text-4xl mr-5"></i>
          STREET VIEW
        </Button>
        <Button className="shadows text-4xl md:text-[2.8rem] w-full">
          <i className="icon-funds text-3xl mr-5"></i>
          MINT NOW
        </Button>
      </div>
    </div>
  );
};

export default ForSaleModal;
