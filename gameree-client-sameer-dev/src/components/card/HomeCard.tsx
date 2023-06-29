import React, { useEffect, useState } from "react";
import Button from "../button/Button";
import ImageComponent from "../imageComponent/ImageComponent";
import DashboardDropdown from "../dashboardDropdown/dashboardDropdown";
import { AiOutlineHeart } from "react-icons/ai";
import Link from "next/link";
import { getBNBRate, getEthRate } from "../../metamask/metamask";

interface IProps {
  id: string;
  price: number;
  src: string;
  area: number;
  address: string;
}

const HomeCard = ({ price, src, area, address,id }: IProps) => {
  const [rate, setRate] = useState(0);
  const [rateETH, setETHRate] = useState(0);
  const [currType, setCurrencyType] = useState<string>("USDG");

  useEffect(() => {
    const storedValue = localStorage.getItem("currType");
    if (storedValue !== null) {
      setCurrencyType(storedValue);
    }
  }, []); // empty dependency array, so this effect only runs once on mount
  const getBnbRe = async () => {
    const response = await getBNBRate();
    if (response) {
      setRate(response);
    }
  };
  const getETHR = async () => {
    const response = await getEthRate();
    if (response) {
      setETHRate(response);
    }
  };

  useEffect(() => {
    getBnbRe();
    getETHR();
  }, []);
  return (
    <>
      <div className="border-[2px] rounded-[20px] overflow-hidden border-[#8264E24D] relative p-5">
        <div className="cursor-pointer z-20 absolute right-8 p-2 opacity-50 rounded-md bg-[#14151B] text-xl text-white flex justify-center items-center top-7">
          <AiOutlineHeart className="text-3xl" />
        </div>
        <Link href={`/marketplace/${id}`}>
          <div className="relative">
            <ImageComponent
              figClassName="cursor-pointer mx-auto flex justify-center"
              src={src ?? "/assets/images/gamery/NFT.png"}
              width={386}
              height={330}
              objectFit="cover"
              className="rounded-2xl"
              priority
            />
          </div>
        </Link>
        <div className="mt-3 w-full xl:w-[24rem]">
          <h4 className=" text-primary mt-4">
            {/* MAYSA APARTMENTS{" "} */}
            <span className="block">{address}</span>
          </h4>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="border border-[#2B2C2D] bg-[#14151B] text-center rounded-xl px-6 py-2 w-1/2 truncate">
            <p className="pb-2">PRICE</p>
            <h5 className="whitespace-nowrap truncate">
              {(price / (currType === "BNB" ? rate : currType === "ETH" ? rateETH : 1)).toFixed(2)} {currType}
            </h5>
          </div>
          <div className="border border-[#2B2C2D] bg-[#14151B] text-center rounded-xl px-6 py-2 w-1/2">
            <p className="pb-2">Size</p>
            <h5 className="whitespace-nowrap truncate">
              {area} Sqft
            </h5>
          </div>
        </div>
      </div>
    </>
  );
};
export default HomeCard;
