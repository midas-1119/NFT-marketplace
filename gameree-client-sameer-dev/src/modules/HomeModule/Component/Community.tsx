import Image from "next/image";
import React from "react";

const Community = () => {
  return (
    <div className="container">
      <div className="bg-purples rounded-[32px] grid lg:grid-cols-3 sm:grid-cols-2">
        <div className="flex flex-col justify-center items-center pb-[3.75rem] pt-[4rem]">
          <figure>
            <Image
              src="/assets/images/community.svg"
              height={158}
              width={158}
            />
          </figure>
          <h2 className="Headings text-white mb-[0.875rem] !font-EdoSZ">
            7k
          </h2>
          <p className="text-white text-2xl text-center uppercase">
            fast growing <span className="block">community members</span>
          </p>
        </div>
        <div className="flex flex-col justify-center items-center pb-[3.75rem] pt-[4rem]">
          <figure>
            <Image src="/assets/images/plots.svg" height={158} width={158} />
          </figure>
          <h2 className="Headings text-white mb-[0.875rem] !font-EdoSZ">
            100+
          </h2>
          <p className="text-white text-2xl uppercase">Ready to mint plots</p>
        </div>
        <div className="flex flex-col justify-center items-center pb-[3.75rem] pt-[4rem]">
          <figure>
            <Image src="/assets/images/traded.svg" height={158} width={158} />
          </figure>
          <h2 className="Headings text-white mb-[0.875rem] !font-EdoSZ">
            112K
          </h2>
          <p className="text-white text-2xl">TOTAL VOULME TRADED</p>
        </div>
      </div>
    </div>
  );
};

export default Community;
