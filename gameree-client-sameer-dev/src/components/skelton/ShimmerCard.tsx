import React from "react";

const ShimmerCard = () => {
  return (
    <div className="inline-block p-5 shadow-md rounded-[20px] border bg-[#2c2f50] border-purples animate-pulse">
      <div className="h-[20rem] bg-[#c9cdd3] rounded-2xl"></div>
      <div className="AtSkeltonText h-6 bg-[#c9cdd3] w-1/2  mt-14 rounded-xl"></div>
      <div className="flex gap-3 mt-4">
        <div className="AtSkeltonText h-9 w-9 rounded-full bg-[#c9cdd3] "></div>
        <div className="AtSkeltonText h-9 w-9 rounded-full bg-[#c9cdd3] "></div>
        <div className="AtSkeltonText h-9 w-9 rounded-full bg-[#c9cdd3] "></div>
        <div className="AtSkeltonText h-9 w-9 rounded-full bg-[#c9cdd3] "></div>
        <div className="AtSkeltonText h-9 w-9 rounded-full bg-[#c9cdd3] "></div>
      </div>
      <div className="AtSkeltonText h-10 bg-[#c9cdd3] w-full mt-4 rounded-xl"></div>
      <div className="flex justify-between gap-4 mt-4">
        <div className=" bg-[#c9cdd3] h-[4.5rem] w-1/2 rounded-xl"></div>
        <div className="w-1/2 bg-[#c9cdd3] h-[4.5rem] rounded-xl"></div>
      </div>
    </div>
  );
};

export default ShimmerCard;
