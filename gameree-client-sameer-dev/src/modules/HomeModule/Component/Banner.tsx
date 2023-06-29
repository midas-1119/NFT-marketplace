import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Button from "../../../components/button/Button";
import Card from "../../../components/card/Card";
import HomeCard from "../../../components/card/HomeCard";
import ImageComponent from "../../../components/imageComponent/ImageComponent";
import { IBuilding } from "../../../interfaces/marketplace.interface";

interface IProps {
  building: IBuilding | null;
}
const Banner = ({ building }: IProps) => {
  return (
    <div className="container pt-[4.563rem] pb-[7.063rem] b">
      <div className="flex justify-between gap-5 lg:flex-row flex-col">
        <div className="md:w-[47rem] relative flex sm:gap-4 lg:gap-9 ">
          <ImageComponent
            figClassName="sm:mt-14 flex-shrink-0 !absolute sm:!relative -top-16 sm:top-0"
            src="/assets/images/gamery/star.svg"
            height={56}
            width={56}
          />
          <div className="">
            <h2 className="text-[5rem] uppercase lg:[text-4rem] xl:text-[5rem] 2xl:text-[5.7rem] font-TTTrailers-SemiBold relative 2xl:leading-[90px]">
              Explore, MINT and earn profits by TRADING your digital <br />
              <span className="bg-purples inline-block -mt-2 relative z-10 pt-2 px-2">
                land parcels
                <ImageComponent
                  figClassName="!absolute hidden xl:block w-[30rem] lg:w-[37.563rem] h-[21.125rem] left-[65%] top-5 -z-10"
                  src="/assets/images/banner/01.png"
                  layout="fill"
                  objectFit="contain"
                />
              </span>
            </h2>

            <p className="text-[#CBCDD2] text-2xl font-Montserrat-Regular mb-12 mt-6">
              A marketplace for non-fungible tokens (NFTs), and more exclusive
              digital assets.
            </p>
            <Link href="/marketplace">
              <Button className="text-[2.5rem] cursor-pointer font-TTTrailers-Bold !px-6 !py-4 !items-center !justify-between !min-w-[18.938rem]">
                EXPLORE NOW
                <div className="bg-white w-[3.563rem] h-[3.563rem] flex justify-center items-center rounded-full ">
                  {" "}
                  <i className="icon-arrowleft text-4xl text-purples"></i>
                </div>
              </Button>
            </Link>
          </div>
        </div>
        {building && (
          <div className=" w-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
            <HomeCard
              src={building.image}
              id={building._id}
              price={building.price}
              area={building.area}
              address={building.address}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Banner;
