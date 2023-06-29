import Image from "next/image";
import React from "react";
import ImageComponent from "../../../components/imageComponent/ImageComponent";

const RoadMap = () => {
  return (
    <div className="container">
      <div className="flex flex-col justify-center items-center mt-24">
        <h2 className="Headings font-TTTrailers-SemiBold text-center mb-[5.625rem] px-4  border-b-[11px] border-purples">
          ROADMAP
        </h2>
      </div>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 2xl:gap-2 2xl:grid-cols-4">
        <div className="flex flex-col justify-center items-center">
          <ul className="text-white mb-4">
            <li className="font-Montserrat-Medium text-lg">
              <span className="text-purples text-7xl leading-0 mr-2">.</span>
              Minting & resale of NFTs in Oxford Street metaverse.
            </li>
            <li className="font-Montserrat-Medium text-lg">
              <span className="text-purples text-7xl leading-0 mr-2">.</span>
              Send and receive offers on virtual properties.
            </li>
            <li className="font-Montserrat-Medium text-lg">
              <span className="text-purples text-7xl leading-0 mr-2">.</span>
              Support of debit/credit card for minting.
            </li>
            <li className="font-Montserrat-Medium text-lg">
              <span className="text-purples text-7xl leading-0 mr-2">.</span>
              Cross trading of virtual properties between crypto and fiat users.
            </li>
            <li className="font-Montserrat-Medium text-lg flex">
              <span className="text-purples text-7xl leading-0 mr-2 ">.</span>
              Sub-plot offerings with real world area, address and dimensions.
            </li>
            <li className="font-Montserrat-Medium text-lg">
              <span className="text-purples text-7xl leading-0 mr-2">.</span>
              Enhance of activities on social media.
            </li>
          </ul>
          <ImageComponent
            figClassName=""
            width={392}
            height={247}
            src="/assets/images/gamery/q1.png"
            objectFit="contain"
          />
        </div>
        <div className="flex flex-col justify-center items-center">
          <ImageComponent
            figClassName="mb-4 mt-4"
            width={392}
            height={247}
            src="/assets/images/gamery/q2.png"
            objectFit="contain"
          />
          <ul className="text-white mb-4">
            <li className="font-Montserrat-Medium text-lg">
              <span className="text-purples text-7xl leading-0 mr-2">.</span>
              3d Metaverse Chat Rooms.
            </li>
            <li className="font-Montserrat-Medium text-lg flex ">
              <span className="text-purples text-7xl leading-0 mr-2">.</span>
              Avatars and metaverse costumes offerings.
            </li>
            <li className="font-Montserrat-Medium text-lg flex">
              <span className="text-purples text-7xl leading-0 mr-2">.</span>
              Metaverse cities town planning and creation.
            </li>
            <li className="font-Montserrat-Medium text-lg flex">
              <span className="text-purples text-7xl leading-0 mr-2">.</span>
              USDG in-game utility token offered to mint NFT.
            </li>
            <li className="font-Montserrat-Medium text-lg whi">
              <span className="text-purples text-7xl leading-0 mr-2">.</span>
              USDG stable coin airdrop and giveaway.
            </li>
            <li className="font-Montserrat-Medium text-lg">
              <span className="text-purples text-7xl leading-0 mr-2">.</span>
              Major exchange listings.
            </li>
            <li className="font-Montserrat-Medium text-lg flex">
              <span className="text-purples text-7xl leading-0 mr-2">.</span>
              Post-Sale IDO launch.
            </li>
          </ul>
        </div>
        <div className="flex flex-col justify-center items-center">
          <ul className="text-white mb-4">
            <li className="font-Montserrat-Medium text-lg">
              <span className="text-purples text-7xl leading-0 mr-2">.</span>
              Additional offering of NFTs.
            </li>
            <li className="font-Montserrat-Medium text-lg">
              <span className="text-purples text-7xl leading-0 mr-2">.</span>
              Earn rentals on your properties.
            </li>
            <li className="font-Montserrat-Medium text-lg">
              <span className="text-purples text-7xl leading-0 mr-2">.</span>
              Offer your properties for advertisement.
            </li>
            <li className="font-Montserrat-Medium text-lg">
              <span className="text-purples text-7xl leading-0 mr-2">.</span>
              Offer digital assets for collateral via perpetual swaps.
            </li>
          </ul>
          <ImageComponent
            figClassName=""
            width={392}
            height={247}
            src="/assets/images/gamery/q3.png"
            objectFit="contain"
          />
        </div>
        <div className="flex flex-col justify-center items-center">
          <ImageComponent
            figClassName="mb-4 mt-4"
            width={392}
            height={247}
            src="/assets/images/gamery/q4.png"
            objectFit="contain"
          />
          <ul className="text-white mb-4">
            <li className="font-Montserrat-Medium text-lg sm:whitespace-nowrap flex items-center">
              <span className=" mr-2 !block h-2.5 flex-shrink-0 w-2.5 rounded-full bg-purples"></span>
              Launch on Android platforms.
            </li>
            <li className="font-Montserrat-Medium text-lg  flex items-center">
              <span className=" mr-2 !block h-2.5 flex-shrink-0 w-2.5 rounded-full bg-purples"></span>
              Launch on IOS platforms.
            </li>
            <li className="font-Montserrat-Medium text-lg flex items-center">
              <span className=" mr-2 !block h-2.5 flex-shrink-0 w-2.5 rounded-full bg-purples"></span>
              Launch of properties in California and New York.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RoadMap;
