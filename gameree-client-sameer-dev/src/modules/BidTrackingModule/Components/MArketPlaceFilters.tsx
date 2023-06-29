import React, { useState } from "react";
import Button from "../../../components/button/Button";
import ImageComponent from "../../../components/imageComponent/ImageComponent";
import { BNB, BUSDT, ETH } from "../../../constants/price.constant";
import FilterToggle from "./FilterToggle";
import MinMax from "./MinMax";
import RangeSlider from "./RangeSlider";

const MArketPlaceFilters = ({
  handleState,
  state,
  area,
  range,
  setArea,
  setRange,
  onSubmitRange,
  onSubmitArea,
  clearFilters,
  setCurrencyType,
  currType,
}: any) => {
  const onChangePrice = (e: any) => {
    setRange({
      ...range,
      [e.target.id]: e.target.value,
    });
  };

  const onChangeArea = (e: any) => {
    setArea({
      ...range,
      [e.target.id]: e.target.value,
    });
  };
  const usdt = [
    { title: "USDG", src: "/assets/images/wallet.png" },
    { title: "BNB", src: "/assets/images/card/01.svg" },
    { title: "ETH", src: "/assets/images/card/02.svg" },
    { title: "USDT", src: "/assets/images/card/03.svg" },
  ];
  return (
    <div className="">
      <div className="flex gap-3.5 items-center justify-between">
        <div className="flex gap-3.5">
          <i
            className="icon-filter text-2xl text-primary cursor-pointer"
            onClick={() => handleState(!state)}
          ></i>
          <h5>Filters</h5>
        </div>
        <a
          className="text-primary text-2xl h-full flex items-center font-TTTrailers-SemiBold cursor-pointer"
          onClick={clearFilters}
        >
          Clear
        </a>
      </div>
      {/* <p className="text-primary font-Montserrat-Bold mt-7 mb-16 uppercase">
        Price range
      </p>
      <RangeSlider /> */}
      <hr className="mt-5 border-[#26272F]" />
      <FilterToggle title="Price">
        <div className="mt-8 flex flex-col gap-5 text-2xl ">
          {usdt.map((item, idx) => (
            <div
              key={item.title}
              className="flex gap-3 items-center cursor-pointer"
              onClick={() => {
                setCurrencyType(item.title);
              }}
            >
              <ImageComponent
                figClassName="cursor-pointer leading-0 rounded-full overflow-hidden flex-shrink-0"
                src={item.src}
                width={38}
                height={38}
                objectFit="cover"
                className="rounded-2xl"
              />
              <h6
                className={`${
                  currType == item.title ? "text-purples" : "text-primary"
                }`}
              >
                {item.title}
              </h6>
            </div>
          ))}
        </div>
      </FilterToggle>
      <FilterToggle title="PRICE RANGE">
        <div className="mt-8 flex gap-5 items-center ">
          <MinMax
            placeholder="MIN"
            value={range.min}
            onChange={onChangePrice}
            id="min"
          />
          <p className="text-primary font-Montserrat-Bold">TO</p>
          <MinMax
            placeholder="MAX"
            value={range.max}
            onChange={onChangePrice}
            id="max"
          />
        </div>
        <Button
          className="!text-[2rem] bg-transparent border border-[#8264E2] mt-8 w-full"
          disabled={!range.min && !range.max}
          onClick={onSubmitRange}
        >
          APPLY
        </Button>
      </FilterToggle>
      <FilterToggle title="Plot Size">
        <div className="mt-8 flex gap-5 items-center ">
          <MinMax
            placeholder="MIN"
            value={area.min}
            onChange={onChangeArea}
            id="min"
          />
          <p className="text-primary font-Montserrat-Bold">TO</p>
          <MinMax
            placeholder="MAX"
            value={area.max}
            onChange={onChangeArea}
            id="max"
          />
        </div>
        <Button
          className="!text-[2rem] bg-transparent border border-[#8264E2] mt-8 w-full"
          disabled={!area.min && !area.max}
          onClick={onSubmitArea}
        >
          APPLY
        </Button>
      </FilterToggle>
    </div>
  );
};

export default MArketPlaceFilters;
