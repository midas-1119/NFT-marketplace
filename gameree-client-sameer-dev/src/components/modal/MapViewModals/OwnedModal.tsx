import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  buyNFT,
  listNFT,
  mintNFT,
  placeBid,
  unlistNft,
} from "../../../metamask/metamask";
import { marketplaceService } from "../../../services/marketplace.service";
import { selectUser } from "../../../store/auth/selector";
import { marketplaceActions } from "../../../store/marketplace/marketplace";
import Button from "../../button/Button";
import ImageComponent from "../../imageComponent/ImageComponent";

const OwnedModal = ({
  setstate,
  setPopup,
  toggleStreetView,
  nft,
  setType,
}: any) => {
  const [selectedTabIdx, setSelectedTabIdx] = useState(0);
  const tabs = [
    { name: "DETAIL", type: "minted" },
    { name: "ASSETS", type: "owned" },
  ];

  const [loading, setLoading] = useState(false);
  // const [isComplete, setIsComplete] = useState(false);
  const [hash, setHash] = useState("");

  const user = useSelector(selectUser);
  const router = useRouter();
  const dispatch = useDispatch();

  const mint = async () => {
    try {
      setType("mint");
      setPopup(true);
      setstate(6);
      setLoading(true);
      const response: any = await mintNFT({
        price: nft.price,
        image: nft.image,
        area: nft.area,
        address: nft.address,
        location: nft.location,
        geometry: nft.geometry,
        incAddress: nft.incAddress,
        id: nft.id,
      });
      const { success, ...rest } = response;
      if (success) {
        const res = await marketplaceService.buyNft(nft._id, rest);
        setPopup(true);
        setstate(7);
        // refetch();
      } else {
        setPopup(false);
      }
      setLoading(false);
    } catch (error) {
      setPopup(false);
      setLoading(false);
    }
  };

  const performAction = async (actionType: string) => {
    setLoading(true);
    setPopup(true);
    if (actionType === "list") {
      setType("list");
      setstate(13);
    } else if (actionType === "unlist") {
      setType("unlist");
      setstate(6);
      setPopup(true);
      const response = await unlistNft(nft.listingId, nft.to);
      if (response) {
        setstate(7);
      } else {
        setPopup(false);
      }
    }
    setLoading(false);
  };

  const buy = () => {
    if (!user || !user.metamaskId) {
      setstate(1);
      setPopup(true);
      return;
    }
    if (nft.status === "PLACED") {
      setstate(8);
      setPopup(true);
    } else {
      mint();
    }
  };

  const placeABid = () => {
    setType("bid");
    setstate(12);
    setPopup(true);
  };

  const getCase = () => {
    if (
      user?.metamaskId?.toLowerCase() == nft?.owner?.toLowerCase() &&
      !nft.isActive &&
      nft.status === "Minted"
    ) {
      return (
        <Button
          className="shadows text-4xl md:text-[2.8rem] w-full"
          disabled={loading}
          onClick={() => performAction("list")}
        >
          LIST
        </Button>
      );
    } else if (
      nft.isActive &&
      user?.metamaskId.toLowerCase() == nft?.sender?.toLowerCase()
    ) {
      return (
        <Button
          className="shadows text-4xl md:text-[2.8rem] w-full"
          disabled={loading}
          onClick={() => performAction("unlist")}
        >
          UNLIST
        </Button>
      );
    } else {
      if (nft.isActive && nft.status !== "SOLD") {
        return nft.sellMode === "1" ? (
          <Button
            className="shadows text-4xl md:text-[2.8rem] w-full"
            disabled={loading}
            onClick={placeABid}
          >
            PLACE A BID
          </Button>
        ) : (
          <Button
            className="shadows text-4xl md:text-[2.8rem] w-full"
            disabled={loading}
            onClick={buy}
          >
            BUY NOW
          </Button>
        );
      } else {
        if (!nft.status) {
          return (
            <Button
              className="shadows text-4xl md:text-[2.8rem] w-full"
              disabled={loading}
              onClick={buy}
            >
              MINT
            </Button>
          );
        } else return <></>;
      }
    }
  };

  return (
    <div className="sm:w-[38.125rem] w-full">
      <div className="bg-[#C164E2] rounded-[2.8rem] text-center mb-8">
        <div className="rounded-[2.8rem] bg-black1 py-4 px-8 relative ">
          <i
            className="icon-cross text-white absolute text-2xl top-[50%] -translate-y-1/2 right-8 cursor-pointer "
            onClick={() => {
              setPopup(false);
            }}
          ></i>
          <h3 className="text-5xl">{nft.text}</h3>
          <p className="text-white">{nft.address}</p>
        </div>
        <p className="text-white text-xl py-2 uppercase">
          This Property is OWNED
        </p>
      </div>
      <div className=" mb-5">
        <nav
          className=" grid grid-cols-2 w-[20rem] rounded-xl text-center mx-auto bg-white justify-cente  py-2"
          aria-label="Tabs"
        >
          {tabs.map((tab, i) => (
            <a
              key={tab.name}
              className={` text-lg text-center block
              font-TTTrailers-Bold
                ${
                  i === selectedTabIdx
                    ? "  !text-purples"
                    : "   !text-[#A4A8B2] "
                }
                ${i == 0 && "border-r-[3px] border-[#070E1E2B]"}
                whitespace-nowrap  cursor-pointer text-base !text-purples`}
              onClick={() => setSelectedTabIdx(i)}
            >
              <span className="text-4xl md:text-[2.8rem] font-TTTrailers-Bold ">
                {tab.name}
              </span>
            </a>
          ))}
        </nav>
      </div>
      {selectedTabIdx === 0 ? (
        <div className="">
          <ImageComponent
            src={nft.image ?? "/assets/images/modal/map.png"}
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
            figClassName="flex-shrink-0 table mx-auto h-[16.625rem] w-[16.625rem] "
          />

          <div className="bg-[rgba(0,0,0,.4)] text-center pt-3 mt-6">
            <p className="text-sm text-lightgray">OWNER OF THE PROPERTY</p>
            <h4 className="mt-3">
              {nft.ownerId?.username
                ? nft.ownerId?.username
                : nft.owner
                ? nft.owner.substring(0, 8) +
                  "..." +
                  nft.owner.substring(nft.owner.length - 5)
                : "GAMEREE"}
            </h4>
            <div className="grid grid-cols-2 border-t border-[#070E1E2B] mt-4">
              <div className="border-r border-[#070E1E2B] py-4 pl-5">
                <p className="text-sm text-lightgray text-left">BNB PRICE</p>
                <h4 className="mt-3">{nft.price ?? "-"}</h4>
              </div>
              <div className="border-r border-[#070E1E2B] py-4 pl-5">
                <p className="text-sm text-lightgray text-left">SQFT SIZE</p>
                <h4 className="mt-3">{nft.area}</h4>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 mt-4 gap-6 px-4 xs:grid-cols-1">
            <Button
              className="shadows bg-white text-4xl md:text-[2.8rem] !text-black1 w-full hover:!text-white"
              onClick={toggleStreetView}
            >
              <i className="icon-street text-4xl mr-5"></i>
              STREET VIEW
            </Button>
            {/* <Button className="shadows text-4xl md:text-[2.8rem] w-full">
              <i className="icon-offer text-3xl mr-5"></i>
              OFFER NOW
            </Button> */}
            {/* {user?.metamaskId !== nft.owner &&
            nft.isActive &&
            nft.name === "ListingPlaced" &&
            nft.status === "PLACED" ? (
              nft.sellMode === "1" ? (
                <Button
                  className="shadows text-4xl md:text-[2.8rem] w-full"
                  disabled={loading}
                  onClick={placeABid}
                >
                  PLACE A BID
                </Button>
              ) : (
                <Button
                  className="shadows text-4xl md:text-[2.8rem] w-full"
                  disabled={loading}
                  onClick={buy}
                >
                  BUY NOW
                </Button>
              )
            ) : !nft.status ? (
              <Button
                className="shadows text-4xl md:text-[2.8rem] w-full"
                disabled={loading}
                onClick={buy}
              >
                MINT
              </Button>
            ) : user?.metamaskId === nft.owner ? (
              nft.isActive ? (
                <Button
                  className="shadows text-4xl md:text-[2.8rem] w-full"
                  disabled={loading}
                  onClick={unlistNft}
                >
                  UNLIST
                </Button>
              ) : (
                <Button
                  className="shadows text-4xl md:text-[2.8rem] w-full"
                  disabled={loading}
                  onClick={listNFT}
                >
                  LIST
                </Button>
              )
            ) : null} */}
            {getCase()}
          </div>
        </div>
      ) : selectedTabIdx === 1 ? (
        <div className="bg-white shadows w-[80%] mx-auto rounded-[1.438rem]  h-[547px] mt-12 overflow-auto">
          <h4 className="text-black1 text-center py-4">PROPERTIES</h4>
          <div className="">
            <hr />
            <div className="flex justify-between border-l-[5px] border-blue1 pl-3">
              <div className="py-2">
                <h5 className="text-black">SELFRIDGES BUILDINGS</h5>
                <p className="text-black2 text-lg">
                  400 Oxford St, London W1A 1AB
                </p>
              </div>
              <div className="bg-black px-8 text-center py-2">
                <h5> 20,000</h5>
                <p className="text-gray2 text-lg">USDG</p>
              </div>
            </div>
            <hr />
            <div className="flex justify-between border-l-[5px] border-blue1 pl-3">
              <div className="py-2">
                <h5 className="text-black">SELFRIDGES BUILDINGS</h5>
                <p className="text-black2 text-lg">
                  400 Oxford St, London W1A 1AB
                </p>
              </div>
              <div className="bg-black px-8 text-center py-2">
                <h5> 20,000</h5>
                <p className="text-gray2 text-lg">USDG</p>
              </div>
            </div>
            <hr />
            <div className="flex justify-between border-l-[5px] border-blue1 pl-3">
              <div className="py-2">
                <h5 className="text-black">SELFRIDGES BUILDINGS</h5>
                <p className="text-black2 text-lg">
                  400 Oxford St, London W1A 1AB
                </p>
              </div>
              <div className="bg-black px-8 text-center py-2">
                <h5> 20,000</h5>
                <p className="text-gray2 text-lg">USDG</p>
              </div>
            </div>
            <hr />
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default OwnedModal;
