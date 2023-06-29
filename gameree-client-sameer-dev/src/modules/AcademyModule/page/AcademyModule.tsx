import React, { useState } from "react";
import ImageComponent from "../../../components/imageComponent/ImageComponent";
import { AcademyData } from "../Components/AcademyData";
import Link from "next/link";


const tabs = [
  { name: "ALL", current: true },
  { name: "BLOCKCHAIN", current: false },
  { name: "METAVERSE", current: false },
  { name: "REAL ESTATE", current: false },
  { name: "WALLETS", current: false },
  { name: "LIQUIDITY", current: false },
];
const AcademyModule = () => {
  const [selectedTabIdx, setSelectedTabIdx] = useState(0);

  return (
    <div className="container pt-24  ">
      <Link href="/academy/academy-detail">
        <a>
          <div className="lg:flex gap-8   ">
            <ImageComponent
              src="/assets/images/pic1.png"
              figClassName="h-[29.188rem] lg:w-[60.688rem] w-full"
              objectFit="cover"
              layout="fill"
            />
            <div className=" lg:w-[33rem] w-full lg:mt-0 mt-10 ">
              <h2 className="text-7xl">
                Buying Land in the metaverse? Gameree is your destination
              </h2>
              <p className="sm:text-xl mt-10 text-[#D8D8D8] ">
                GameRee is a metaverse game that consists of blockchain based
                land that runs on the blockchain and has its own native
                money/token BNB stable coin.
              </p>
              <p className="text-[#9FA0A2] sm:text-xl mt-5 ">Oct 12, 2022</p>
            </div>
          </div>
        </a>
      </Link>
      <div className="  overflow-x-auto  mt-8">
        <h4 className="mb-7 text-[2rem] font-TTTrailers-Bold">OUR TOPICS </h4>
        <nav
          className=" flex  items-center gap-4 lg:w-full"
          aria-label="Tabs"
        >
          {tabs.map((tab, i) => (
            <a
              key={tab.name}
              className={` text-[2rem] border text-center px-6 sm:px-9 pt-3 pb-1.5  rounded-[3.438rem] text-primary
              font-TTTrailers-Bold
                ${
                  i === selectedTabIdx
                    ? "  bg-purples border-transparent    "
                    : "  border-purples text-primary "
                }
                whitespace-nowrap   text-white cursor-pointer text-base hover:bg-purples hover:border-transparent`}
              onClick={() => setSelectedTabIdx(i)}
            >
              <span className="text-primary text-2xl xl:text-[2rem]  font-TTTrailers-Bold ">
                {tab.name}
              </span>
            </a>
          ))}
        </nav>
      </div>

      {selectedTabIdx === 0 && (
          <div className="mt-36 grid xl:grid-cols-2 gap-14">
        {AcademyData.map((item: any) => {
          return (
            <div>
              <div>
                <ImageComponent
                  src={item.src1}
                  figClassName="h-[29.188rem]  w-full"
                  objectFit="cover"
                  layout="fill"
                />
              </div>
              <h4 className="xl:text-[4.063rem] mt-8  xl:w-[40rem] leading-tight ">
                {item.ideas}
              </h4>
              <div>
                <p className="sm:text-2xl mt-4 text-[#D8D8D8] ">
               {item.text}
                </p>
                <p className="text-[#9FA0A2] sm:text-xl mt-5 ">Oct 12, 2022</p>
              </div>
            </div>
          );
        })}
      </div> 
      )}
      

     
    </div>
  );
};

export default AcademyModule;
