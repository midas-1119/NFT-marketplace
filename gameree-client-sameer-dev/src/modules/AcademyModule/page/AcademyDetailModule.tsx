import React from "react";
import ImageComponent from "../../../components/imageComponent/ImageComponent";

const AcademyDetailModule = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full pt-36 pb-16  ">
      <div className=" sm:w-[50rem]  w-full lg:mt-0 mt-10  lg:px-0 px-12">
        <h2 className=" ">
          Blockchain in Real Estate: 17 Companies Shaping the Industry
        </h2>

        <p className=" sm:text-xl mt-5 font-Montserrat-Medium">Oct 12, 2022</p>

        <ImageComponent
          src="/assets/images/pic1.png"
          figClassName="h-[29.188rem] sm:w-[48.375rem] mt-14 w-full"
          objectFit="cover"
          layout="fill"
        />

        <p className="sm:text-2xl mt-12 text-[#D8D8D8] ">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Arcu et arcu
          vitae vitae sed eros magna. Dignissim ac tincidunt eu consectetur
          elementum .
        </p>

        <h5 className="sm:w-[48.063rem] mt-10 font-Montserrat-Bold leading-10">
          How does tokenization impact real estate funds and asset management?
        </h5>

        <p className=" sm:text-2xl mt-5 sm:w-[48.063rem]  text-[#D8D8D8]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ut ut
          vestibulum, et consectetur vel ante enim viverra. Nisl vitae nunc diam
          tellus lectus penatibus vulputate. Volutpat amet, non non amet in
          magna tristique. Nisl, purus viverra vel vitae eu mattis tincidunt
          risus. Id semper vitae tincidunt amet condimentum vitae.
        </p>

        <p className=" sm:text-2xl mt-5 sm:w-[48.063rem] text-[#D8D8D8]">
          Enim faucibus mi, quisque pharetra eu sed turpis malesuada. At
          vestibulum in augue feugiat consectetur eros. Non massa turpis posuere
          ullamcorper tristique erat feugiat velit. Augue mauris curabitur est
          vivamus in egestas sapien ut bibendum. Nibh malesuada id vestibulum
          faucibus consectetur sed aliquam. Tincidunt cras dui, sed odio eget
          condimentum accumsan. Enim, id sit vel feugiat ut.
        </p>

        <p className=" sm:text-2xl mt-5 sm:w-[48.063rem] text-[#D8D8D8]">
          Tellus pharetra non ut facilisis eu id in lacus orci. Etiam habitasse
          sed aliquet congue mattis vitae id amet quam. Semper dictum quam et
          quis morbi nunc venenatis. Diam sodales arcu praesent dis in diam
          mauris suscipit duis.
        </p>

        <h5 className="sm:w-[48.063rem] mt-10 font-Montserrat-Bold leading-10">
          How does tokenization impact real estate funds and asset management?
        </h5>

        <p className=" sm:text-2xl mt-5 sm:w-[48.063rem] text-[#D8D8D8]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra ut ut
          vestibulum, et consectetur vel ante enim viverra. Nisl vitae nunc diam
          tellus lectus penatibus vulputate. Volutpat amet, non non amet in
          magna tristique. Nisl, purus viverra vel vitae eu mattis tincidunt
          risus. Id semper vitae tincidunt amet condimentum vitae.
        </p>
        <p className=" sm:text-2xl mt-5 sm:w-[48.063rem] text-[#D8D8D8]">
          Enim faucibus mi, quisque pharetra eu sed turpis malesuada. At
          vestibulum in augue feugiat consectetur eros. Non massa turpis posuere
          ullamcorper tristique erat feugiat velit. Augue mauris curabitur est
          vivamus in egestas sapien ut bibendum.
        </p>
        <div className="flex justify-center items-center mt-20 ">
          <h2 className="text-[7.5rem] font-TTTrailers-SemiBold text-center mb-[3.188rem] w-[23.125rem]  border-b-[11px] border-purples">
            MORE FROM US
          </h2>
        </div>
      </div>
      <div className="container">
        <div className="mt-36 grid xl:grid-cols-2 gap-14">
          <div>
            <div>
              <ImageComponent
                src="/assets/images/pic2.png"
                figClassName="h-[29.188rem]  w-full"
                objectFit="cover"
                layout="fill"
              />
            </div>
            <h4 className="xl:text-[4.063rem] mt-8  xl:w-[40rem] leading-tight ">
              LIQUIDIFTY MARKETPLACE: WHAT OPPORTUNITIES DOES IT GIVE?
            </h4>
            <div>
              <p className="sm:text-2xl mt-4 text-[#D8D8D8] ">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Arcu et
                arcu vitae vitae sed eros magna. Dignissim ac tincidunt eu
                consectetur elementum .
              </p>
              <p className="text-[#9FA0A2] sm:text-xl mt-5 ">Oct 12, 2022</p>
            </div>
          </div>
          <div>
            <div>
              <ImageComponent
                src="/assets/images/pic3.png"
                figClassName="h-[29.188rem]  w-full"
                objectFit="cover"
                layout="fill"
              />
            </div>
            <h4 className="xl:text-[4.063rem] mt-8  xl:w-[40rem] leading-tight ">
              NFT Staking: ultimate collect-to-earn experience (UPDATED)
            </h4>
            <div>
              <p className="sm:text-2xl mt-4 text-[#D8D8D8] ">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Arcu et
                arcu vitae vitae sed eros magna. Dignissim ac tincidunt eu
                consectetur elementum .
              </p>
              <p className="text-[#9FA0A2] sm:text-xl mt-5 ">Oct 12, 2022</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademyDetailModule;
