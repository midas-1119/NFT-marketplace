import React, { useEffect, useState } from "react";
import Button from "../button/Button";
import ImageComponent from "../imageComponent/ImageComponent";
import { AiOutlineHeart } from "react-icons/ai";
import { IoMdHeartDislike } from "react-icons/io";
import Link from "next/link";
import styles from "./Card.module.css";
import {
  getBNBRate,
  mintNFT,
  unlistNft,
  // getTokenId,
} from "../../metamask/metamask";
import { marketplaceService } from "../../services/marketplace.service";
import PayWithComponent from "./component/PayWithComponent";
import { useDispatch } from "react-redux";
import { marketplaceActions } from "../../store/marketplace/marketplace";
import Countdown from "react-countdown";
import { useRouter } from "next/router";
import moment from "moment";
import { handleModalHide, handleShowModal } from "../../utils/showModal";
import * as CONSTANTS from "../../constants";
import { BNB, BUSDT, ETH, USDG } from "../../constants/price.constant";
import { NFT_TYPES } from "../../constants/nftType.enum";
import { listNFT } from "../../metamask/metamask";
import { SUCCESS } from "../../constants";
import { toast } from "react-toastify";

import { useSelector } from "react-redux";
import { selectUser } from "../../store/auth/selector";

import { platformOwnerAddress } from "../../environment/env";

// const platformOwnerAddress = "0xCeBF6573C0B1B239fF233C5debF502842FFC4cFe";

interface IProps {
  id: string;
  bg?: string;
  nft: any;
  isDashboard?: boolean;
  user?: any;
  selectedTabIdx?: number;
  isOwner?: boolean;
  removeItemFromCurrentList: (index: number) => void;
  index: number;
  isAsset?: boolean;
  currType?: any;
  rate: number;
}

const Card = ({
  id,
  nft,
  isDashboard,
  user,
  selectedTabIdx = 0,
  isOwner = false,
  removeItemFromCurrentList,
  index,
  isAsset,
  currType,
  rate,
}: IProps) => {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("mint");
  const [hash, setHash] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [checkAdded, setCheckAdded] = useState(0);

  const loggedUser = useSelector(selectUser);

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      JSON.parse(localStorage.getItem("favoriteNFTs") || "[]")?.some(
        (item: any) => item?._id === nft?._id
      )
    ) {
      setIsAdded(true);
    } else {
      setIsAdded(false);
    }
  }, [checkAdded]);
  console.log("User: ", user);
  console.log("Nft: ", nft);

  const mint = async () => {
    console.log("Inside Mint: ", nft);
    try {
      handleModalHide(CONSTANTS.MINT_NFT);
      handleShowModal(CONSTANTS.LOADING, {
        type: "mint",
        address: nft.address,
        name: nft.address,
        src: nft.image,
      });
      setLoading(true);
      const response: any = await mintNFT({
        price: nft.price,
        image: nft.image,
        area: nft.area,
        address: nft.address,
        location: nft.location,
        geometry: nft.geometry,
        incAddress: nft.incAddress,
      });

      const { success, ...rest } = response;
      if (success) {
        console.log("Rest: ", rest);

        const res = await marketplaceService.mintNft(id, rest);

        handleModalHide(CONSTANTS.LOADING);
        handleShowModal(CONSTANTS.SUCCESS, { type: "mint" });
        removeItemFromCurrentList(index);

        //Default 1% of total price

        const defaultPrice = (1 / 100) * nft.price;

        console.log("Default Price: ", defaultPrice);

        handleShowModal(CONSTANTS.LIST_NFT, {
          id: id,
          src: nft.image,
          tokenId: rest.tokenId,
          owner: nft.owner,
          ownerAddress: rest.ownerAddress,
          creatorAddress: rest.ownerAddress,
          name: nft.address,
          index: index,
          price: Number(defaultPrice).toFixed(3),
          removeItemFromCurrentList: removeItemFromCurrentList,
        });

        // payload.price = defaultPrice;

        // console.log("Payload: ", payload);

        // const response = await listNFT(payload);
        // console.log("Response from listing: ", response);

        // const { success: result, ...restt } = response;

        // if (result) {
        //   console.log("Rest from listing: ", restt);

        //   restt.listingPrice = defaultPrice;

        //   const res = await marketplaceService.listNft(id, restt);

        //   handleShowModal(SUCCESS, {
        //     type: "list",
        //   });
        // }
      } else {
        handleModalHide(CONSTANTS.LOADING);
      }
      setLoading(false);
    } catch (error) {
      handleModalHide(CONSTANTS.LOADING);
      setLoading(false);
    }
  };

  const performAction = async () => {
    console.log("Action", nft);
    if (nft.status === "minted") {
      handleShowModal(CONSTANTS.LIST_NFT, {
        id: id,
        src: nft.image,
        tokenId: nft.tokenId,
        owner: nft.owner,
        ownerAddress: nft.ownerAddress,
        creatorAddress: nft.creatorAddress,
        name: nft.address,
        index: index,
        price: (Number(nft?.price) / rate).toFixed(3),
        removeItemFromCurrentList: removeItemFromCurrentList,
      });
    } else if (nft.status === "listed") {
      console.log("Inside Listed Action");
      handleShowModal(CONSTANTS.LOADING, {
        type: "unlist",
        address: nft.address,
        name: nft.address,
        src: nft.image,
      });

      let response: any = {};

      // if (platformOwnerAddress !== nft.ownerAddress) {
      //   response = await unlistNft(nft.listingId, nft.to);
      // } else {
      //   response.success = true;
      // }

      console.log("Logged User: ", loggedUser);

      if (loggedUser.isMetamaskUser) {
        response = await unlistNft(nft.listingId, nft.to);
      } else {
        response.success = true;
      }

      console.log("Response: ", response);

      const { success, ...rest } = response;

      if (success) {
        console.log("Rest: ", rest);

        rest.listingId = nft.listingId;

        const res = await marketplaceService.unlistNft(id, rest);

        handleModalHide(CONSTANTS.LOADING);
        handleShowModal(CONSTANTS.SUCCESS, { type: "unlist" });
        removeItemFromCurrentList(index);
      } else {
        handleModalHide(CONSTANTS.LOADING);
      }
    }
  };

  const refetch = () => {
    if (type !== "bid") removeItemFromCurrentList(index);
    else dispatch(marketplaceActions.setRefetch());
  };

  const mintNft = () => {
    if (isOwner) return;
    if (!user) {
      handleShowModal(CONSTANTS.LOGIN);
      return;
    }

    handleShowModal(CONSTANTS.MINT_NFT, {
      src: nft.image,
      name: nft.address,
      id: id,
      mint: mint,
      lat: nft.location.lat,
      lng: nft.location.lng,
    });
  };

  const buyNft = () => {
    if (isOwner) return;
    if (!user) {
      handleShowModal(CONSTANTS.LOGIN);
      return;
    }

    handleShowModal(CONSTANTS.BUY_NFT, {
      id: id,
      tokenId: nft.tokenId,
      ownerAddress: nft.ownerAddress,
      from: nft?.from,
      price: nft?.price,
      src: nft.image,
      refetch: refetch,
      to: user?.metamaskId,
      address: nft.address,
      listingId: nft.listingId,
      lat: nft?.location?.lat,
      lng: nft?.location?.lng,
    });
  };

  const placeABid = () => {
    console.log("Logged User: ", loggedUser);
    handleShowModal(CONSTANTS.MAKE_AN_OFFER, {
      src: nft.image,
      name: nft.address,
      listingId: nft.listingId,
      loading: loading,
      nftId: nft?._id,
      bidder: loggedUser._id,
      highestBiddingPrice: nft.listing.highestBiddingId
        ? nft.listing.highestBiddingId.price
        : nft.listing.price,
    });
  };

  const getButtonState = () => {
    if (nft.status === "minted") {
      return selectedTabIdx === 0 ? "LIST ON MARKETPLACE" : "RESALE";
    }
    if (nft.status === "listed") return "UNLIST FROM MARKETPLACE";
  };

  const saveFavorite = async (building: any) => {
    console.log(building, "building");

    try {
      const res = localStorage.getItem("favoriteNFTs") || "[]";
      const favoriteNFTs = JSON.parse(res);
      localStorage.setItem(
        "favoriteNFTs",
        JSON.stringify([...favoriteNFTs, { ...building, isFavourite: true }])
      );
      setCheckAdded((state) => state + 1);
      toast.success("Added to favorites");
    } catch (error) {}
  };
  const removeFavorite = async (building: any) => {
    try {
      const res = localStorage.getItem("favoriteNFTs") || "[]";
      const favoriteNFTs = JSON.parse(res);
      localStorage.setItem(
        "favoriteNFTs",
        JSON.stringify([
          ...favoriteNFTs.filter((item: any) => item?._id !== building?._id),
        ])
      );
      setCheckAdded((state) => state + 1);
      toast.success("Removed from favorites");
    } catch (error) {}
  };

  return (
    <>
      <div className={styles.card}>
        <div
          className={`group relative overflow-hidden ${"AtCardGradient"}  hover:p-[2px] h-full`}
        >
          <div
            className={` p-[20px] ${"AtBoxInner"} hover:p-[18px]  relative h-full`}
          >
            <div className="absolute left-0 z-20 flex items-center justify-between w-full pt-2 px-7 top-5 gap-4x">
              <div className="flex items-center invisible gap-1 truncate group-hover:visible">
                <ImageComponent
                  figClassName="cursor-pointer leading-0 rounded-full overflow-hidden flex-shrink-0"
                  src="/assets/images/profile.png"
                  width={40}
                  height={40}
                  objectFit="cover"
                  className="rounded-2xl"
                />
                {/* <p className="flex items-center justify-center h-[40px] w-[40px]  text-sm rounded-full bg-purples text-white">
                  CW
                </p> */}
                <div></div>
                <p className="text-sm text-white truncate font-Montserrat-SemiBold">
                  Cameron Williamson
                </p>
              </div>
              {!isAdded ? (
                <div
                  onClick={() => saveFavorite(nft)}
                  className="cursor-pointer absolute right-8 p-2.5 opacity-50 rounded-md bg-[#14151B] text-xl text-white flex justify-center items-center"
                >
                  <AiOutlineHeart />
                </div>
              ) : (
                <div
                  onClick={() => removeFavorite(nft)}
                  className="cursor-pointer absolute right-8 p-2.5 opacity-50 rounded-md bg-[#14151B] text-xl text-white flex justify-center items-center"
                >
                  <IoMdHeartDislike />
                </div>
              )}
            </div>

            <div className="relative">
              <Link href={!isDashboard ? `/marketplace/${id}` : "/dashboard"}>
                <a href="">
                  {/* <div className="absolute w-full h-full -top-1/2 invisible cursor-pointer group-hover:visible left-0  bg-gradient-to-b z-10 from-[black] to-transparent "></div> */}
                  <>
                    {/* <div className="w-full h-full AtBoxInner rounded-2xl">
                      <MagnifyImage src={nft.image ?? "/assets/images/detail-page.png"} />
                    </div> */}
                    <div>
                      <ImageComponent
                        figClassName="cursor-pointer mx-auto flex justify-center vimeo-video-container"
                        src={nft.image || "/assets/images/detail-page.png"}
                        layout="fill"
                        className="rounded-2xl vimeo-video transition-all duration-700"
                        priority
                      />
                    </div>

                    {console.log("NFT: ", nft, isOwner)}

                    {nft?.status === "listed" &&
                      nft?.listing?.sellMode === NFT_TYPES.auction && (
                        <div className="absolute bottom-0 flex items-center justify-center w-full gap-3 py-3 timeAuctiondiv">
                          <ImageComponent
                            figClassName="cursor-pointer"
                            src={nft.image || "/assets/images/noto_fire.svg"}
                            width={28}
                            height={28}
                            objectFit="cover"
                            className="rounded-2xl"
                            priority
                          />

                          <Countdown
                            date={
                              new Date(
                                nft?.listing?.startTime * 1000
                              ).getTime() +
                              nft?.listing?.duration * 1000
                            }
                            renderer={({
                              days,
                              hours,
                              minutes,
                              seconds,
                              completed,
                            }) => {
                              if (completed) {
                                return (
                                  <>
                                    <div className="flex gap-2">
                                      <p className="text-[2.063rem] text-white font-TTTrailers-Bold">
                                        Auction Ended:{" "}
                                        {moment(nft?.endTime).fromNow()}
                                      </p>
                                    </div>
                                  </>
                                );
                              } else {
                                return (
                                  <div className="flex gap-2">
                                    <p className="text-[2.063rem] text-white font-TTTrailers-Bold">
                                      {days}D :
                                    </p>
                                    <p className="text-[2.063rem] text-white font-TTTrailers-Bold">
                                      {hours}H :
                                    </p>
                                    <p className="text-[2.063rem] text-white font-TTTrailers-Bold">
                                      {minutes}M :
                                    </p>
                                    <p className="text-[2.063rem] text-white font-TTTrailers-Bold">
                                      {seconds}S
                                    </p>
                                  </div>
                                );
                              }
                            }}
                          />
                        </div>
                      )}
                  </>
                </a>
              </Link>

              {!isDashboard ? (
                nft?.status === "listed" &&
                nft?.listing?.sellMode === NFT_TYPES.auction &&
                nft?.listing?.endTime === undefined &&
                !isOwner ? (
                  <Button
                    disabled={loading || isOwner}
                    className="!absolute w-[184px]  bottom-2 hover:!text-white !text-3xl hidden group-hover:block  left-1/2 -translate-x-1/2  !text-purples bg-white !pt-2 !pb-1"
                    onClick={placeABid}
                  >
                    PLACE A BID
                  </Button>
                ) : nft?.status === "listed" &&
                  nft?.listing?.sellMode === NFT_TYPES.fixedPrice &&
                  isOwner ? (
                  <Button
                    disabledClass="opacity-70 hover:bg-transparent disabled:text-white"
                    // disabled={loading || isOwner}
                    disabled={loading}
                    className="!absolute w-[184px] bottom-2  hover:!text-white !text-3xl block hover:!bg-purples  left-1/2 -translate-x-1/2 border-purples border-2 !text-purples !bg-white !pt-2 !pb-1"
                    onClick={performAction}
                  >
                    UNLIST
                  </Button>
                ) : nft.status === "listed" &&
                  nft?.listing?.sellMode === NFT_TYPES.fixedPrice &&
                  !isOwner ? (
                  <Button
                    disabledClass="opacity-70 hover:bg-transparent disabled:text-white"
                    disabled={loading || isOwner}
                    className="!absolute w-[184px] bottom-2  hover:!text-white !text-3xl block hover:!bg-purples  left-1/2 -translate-x-1/2 border-purples border-2 !text-purples !bg-white !pt-2 !pb-1"
                    onClick={buyNft}
                  >
                    BUY
                  </Button>
                ) : !nft?.ownerId?._id ? (
                  <Button
                    disabledClass="opacity-70 hover:bg-transparent disabled:text-white"
                    disabled={loading || isOwner}
                    className="!absolute w-[184px] bottom-2  hover:!text-white !text-3xl block hover:!bg-purples  left-1/2 -translate-x-1/2 border-purples border-2 !text-purples !bg-white !pt-2 !pb-1"
                    onClick={mintNft}
                  >
                    MINT
                  </Button>
                ) : null
              ) : null}
            </div>

            <div>
              {isDashboard && nft.status !== "SOLD" && !isAsset ? (
                <div className="mt-5 ">
                  <h4 className="mt-4 truncate text-primary">{nft?.address}</h4>

                  <p className="text-lg text-[secondary] leading-7 mt-1">
                    {nft.address}
                  </p>

                  {nft.status === "listed" &&
                  nft.listing.sellMode === "AUCTION" ? (
                    <Button
                      // onClick={performAction}
                      disabled={true}
                      className="w-full !text-[2.25rem] mt-6"
                    >
                      AUCTIONED
                    </Button>
                  ) : nft.status !== "SOLD" ? (
                    <Button
                      onClick={performAction}
                      className="w-full !text-[2.25rem] mt-6"
                    >
                      {getButtonState()}
                    </Button>
                  ) : null}

                  {/* {nft.status !== "SOLD" && (
                    <Button
                      onClick={performAction}
                      className="w-full !text-[2.25rem] mt-6"
                    >
                      {getButtonState()}
                    </Button>
                  )} */}
                </div>
              ) : (
                <div className="mt-5 ">
                  {!isDashboard && !isAsset && <PayWithComponent />}
                  <h4 className="mt-4  text-primary line-clamp-2 sm:h-[85px]">
                    {nft.address}
                  </h4>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="border border-[#2B2C2D] bg-[#14151B] text-center rounded-xl px-6 py-2 w-1/2 truncate">
                      <p>PRICE</p>
                      <h5 className="whitespace-nowrap">
                        {`${(Number(nft?.price) / rate).toFixed(3)} ${
                          currType || "$"
                        }`}
                      </h5>
                    </div>
                    <div className="border border-[#2B2C2D] bg-[#14151B] text-center rounded-xl px-6 py-2 w-1/2">
                      <p>SIZE</p>
                      <h5 className="truncate">{nft.area} SQFT</h5>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Card;
