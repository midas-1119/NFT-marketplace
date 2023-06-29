import Link from "next/link";
import React from "react";
import Button from "../../../components/button/Button";
import ImageComponent from "../../../components/imageComponent/ImageComponent";
import { GameryAcademyData } from "./GameryAcademyData";

const GamreeAcademy = () => {
  return (
    <div className="flex flex-col justify-center items-center  py-[7.5rem] container">
      <h2 className="Headings px-4 font-TTTrailers-SemiBold text-center  border-b-[11px] border-purples">
        GAMEREE ACADEMY
      </h2>
      <div className="mt-20 grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1  gap-14 mb-12">
        {GameryAcademyData.map((item: any) => {
          return (
            <div className="bg-[#191B20] border border-[#5E6063] rounded-[20px]" key={item.id}>
              <div>
                <ImageComponent
                  src={item.src}
                  figClassName="h-[25.313rem] rounded-t-[20px]  w-full"
                  className="rounded-t-[20px]"
                  objectFit="cover"
                  layout="fill"
                />
              </div>
              <div className="px-[1.375rem]">
                <h4 className="xl:!text-[3rem] mt-6 2xl:leading-[62px] uppercase">
                  {item.ideas}
                </h4>
                <p className="text-base mt-[0.625rem] mb-12 text-[#9FA0A2]">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <Link href="/academy">
      <Button className="sm:w-[400px] w-full rounded-[55px] !background-transparent !py-5 !border-purples">
        VIEW ALL
      </Button>
      </Link>
    </div>
  );
};

export default GamreeAcademy;
