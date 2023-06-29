import React from "react";

const DetailShimmer = () => {
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-8 lg:gap-[5rem] xl:gap-[8.188rem] pt-10 lg:pt-[6.75rem] mb-[8.313rem]">
      <div className="shadow-md rounded-[20px] border bg-[#2c2f50] border-purples animate-pulse">
        <div className="h-[25rem] lg:h-full bg-[#c9cdd3] rounded-2xl"></div>
      </div>
      <div className="p-5 shadow-md rounded-[20px] border bg-[#2c2f50] border-purples animate-pulse">
        <div className="h-[4rem] bg-[#c9cdd3]"></div>
        <div className="flex gap-10 mb-[2.688rem] mt-8  xs:flex-col">
          <div className="flex gap-2">
            <div className="w-12 h-12 rounded-full bg-[#c9cdd3] "></div>
            <div className="">
              <div className="h-4 w-40 bg-[#c9cdd3]"></div>
              <div className="h-4 w-20 bg-[#c9cdd3] mt-4"></div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-12 h-12 rounded-full bg-[#c9cdd3] "></div>
            <div className="">
              <div className="h-4 w-40 bg-[#c9cdd3]"></div>
              <div className="h-4 w-20 bg-[#c9cdd3] mt-4"></div>
            </div>
          </div>
        </div>
        <div className="flex gap-10 mb-8 mt-8 justify-between">
          <div>
            <div className="h-4 w-20 bg-[#c9cdd3]"></div>
            <div className="h-14 w-48 mt-3 bg-[#c9cdd3]"></div>
            <div className="h-10 w-32 bg-[#c9cdd3] rounded-2xl mt-3"></div>
          </div>
          <div className="h-28 w-[20rem] bg-[#c9cdd3] mt-4 rounded-2xl"></div>
        </div>
        <div className="h-12 w-[14rem] bg-[#c9cdd3] rounded-full"></div>

        <div className="h-[13rem] xs:w-full w-[80%] bg-[#c9cdd3] mt-8 rounded-2xl"></div>
      </div>
    </div>
  );
};

export default DetailShimmer;
