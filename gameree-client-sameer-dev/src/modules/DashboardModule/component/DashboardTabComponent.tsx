import React, { useEffect, useState } from "react";
import Button from "../../../components/button/Button";
import Card from "../../../components/card/Card";
import ShimmerCard from "../../../components/skelton/ShimmerCard";
import { IBuilding } from "../../../interfaces/marketplace.interface";
import { getBNBRate, getEthRate } from "../../../metamask/metamask";
import { tabs } from "../DashbaordModule";

interface IProps {
  buildings: IBuilding[];
  selectedTabIdx: any;
  setSelectedTabIdx: any;
  handleLoadMore: any;
  hasMore: boolean;
  loading: boolean;
  currType: any;
  rate: any;
  removeItemFromCurrentList: ( index: number ) => void;
}
const DashboardTabComponent = ({
  selectedTabIdx,
  setSelectedTabIdx,
  buildings,
  handleLoadMore,
  hasMore,
  loading,
  currType,
  rate,
  removeItemFromCurrentList,
}: IProps) => {




  return (
    <div>
      <div className="  overflow-x-auto ">
        <nav
          className=" flex  items-center space-x-4   gap-x-4 lg:gap-x-6  lg:w-full"
          aria-label="Tabs"
        >
          {tabs.map((tab, i) => (
            <a
              key={tab.name}
              className={` text-lg border text-center px-6 sm:px-9 pt-3 pb-1.5  rounded-[3.438rem] text-primary
              font-TTTrailers-Bold
                ${
                  i === selectedTabIdx
                    ? "  bg-purples border-transparent    "
                    : "  border-purples text-primary "
                }
                whitespace-nowrap  w-[11.5rem] text-white cursor-pointer text-base hover:bg-purples hover:border-transparent`}
              onClick={() => setSelectedTabIdx(i)}
            >
              <span className="text-primary text-2xl xl:text-[2rem]  font-TTTrailers-Bold ">
                {tab.name}
              </span>
            </a>
          ))}
        </nav>
      </div>
      <div className="sm:mt-14 mt-[3.5rem] grid xl:grid-cols-4 lg:grid-cols-3  sm:grid-cols-2  gap-8 ">
        {loading ? (
          <>
            <ShimmerCard />
            <ShimmerCard />
            <ShimmerCard />
            <ShimmerCard />
          </>
        ) : buildings.length === 0 ? (
          <h3 className="text-center">No NFTs Found!</h3>
        ) : (
          buildings.map((building: any, index: number) => {
            let nft: any = {};
            if (building.name === "ListingPlaced" || selectedTabIdx === 4)
              nft = { ...building.nft, ...building };
            else nft = building;
            return (
              <Card 
                key={building._id} 
                index={index} 
                isDashboard 
                bg="transparent" 
                nft={nft} 
                id={building?.nft?._id || building._id} 
                selectedTabIdx={selectedTabIdx} 
                removeItemFromCurrentList={removeItemFromCurrentList}
                isAsset={selectedTabIdx === 4 || nft?.isFavourite}
                currType={currType}
                rate={rate}
                
              />
            );
          })
        )}
      </div>
      <div className="text-center">
        {hasMore && (
          <Button
            className="mt-[4.5rem] text-[3.5rem] !px-28 "
            onClick={handleLoadMore}
            isLoading={loading}
            disabled={loading}
          >
            Load More
          </Button>
        )}
      </div>
    </div>
  );
};
export default DashboardTabComponent;
