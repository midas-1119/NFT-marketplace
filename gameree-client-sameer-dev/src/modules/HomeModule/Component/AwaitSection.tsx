import Link from "next/link";
import React from "react";
import Button from "../../../components/button/Button";
import ImageComponent from "../../../components/imageComponent/ImageComponent";

const AwaitSection = () => {
  return (
    <div className=" mt-[4.563rem] ">
      <div className="relative w-full xs:h-[40rem] h-[50rem] md:h-[55rem]  lg:h-[68rem] 2xl:h-[79.938rem]">
        <div className=" absolute Bg h-full w-full bgimg top-0"></div>
        <div className="main absolute h-full w-full opacity-60"></div>
        {/* <ImageComponent
          figClassName="bd absolute bd opacity-60 w-full h-full"
          src="/assets/images/gamery/main.jpg"
          objectFit="contain"
          layout="fill"
        /> */}
        <ImageComponent
          figClassName="!absolute h-[20rem] lg:h-[51.875rem]  w-[80%] lg:w-[70rem] xl:w-[95rem] 2xl:w-[101.438rem] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-8 lg:mt-20"
          src="/assets/images/gamery/4.png"
          objectFit="contain"
          layout="fill"
        />
        <div className="absolute w-full h-full  top-0  flex flex-col justify-between px-4">
          <p className="text-center mt-12">
            <span className="text-5xl xs:text-4xl  sm:text-7xl text-primary md:Headings bg-purples px-2 md:px-12 font-TTTrailers-Bold">
              The Gamereverse Awaits You
            </span>
          </p>
          <div className="text-center px-2 mb-7 md:mb-14">
            <p className="xl:w-[80.188rem] w-full mb-14 text-center text-primary font-Montserrat-Bold  text-4xl md:text-5xl lg:text-6xl uppercase lg:leading-[82px] mx-auto">
              Objective of the metaverse is to{" "}
              <br className="sm:block hidden" /> evolve into a virtual world
              created by users and community.
            </p>
            <Link href="/mapview">
            <Button className="shadows w-auto text-center">
              ENTER GAMEREE WORLD
            </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwaitSection;
