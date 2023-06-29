import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../components/button/Button";
import Card from "../../../components/card/Card";
import ImageComponent from "../../../components/imageComponent/ImageComponent";
import { nftMarketplaceAddress } from "../../../environment/env";
import {
  getBNBRate,
  getEthRate,
  mintNFT,
  unlistNft,
} from "../../../metamask/metamask";
import { marketplaceService } from "../../../services/marketplace.service";
import { selectUser } from "../../../store/auth/selector";
import {
  getMarketplaceBuildingAction,
  getMarketplaceSimilarBuildingsAction,
} from "../../../store/marketplace/async.func";
import { handleModalHide, handleShowModal } from "../../../utils/showModal";
import * as CONSTANTS from "../../../constants";
import DetailShimmer from "../../../components/skelton/DetailShimmer";
import dynamic from "next/dynamic";
import Head from "next/head";
import { NFT_TYPES } from "../../../constants/nftType.enum";
import Countdown from "react-countdown";

const MagnifyImage = dynamic(
  () => import("../../../components/MagnifyImage/MagnifyImage"),
  { ssr: false }
);

const platformOwnerAddress = "0xCeBF6573C0B1B239fF233C5debF502842FFC4cFe";

const MarketPlaceDetailModule = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id, status, success } = router.query;
  const [loading, setLoading] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  // const [rate, setRate] = useState(0);
  const [building, setBuilding] = useState<any>(null);
  const [listing, setListing] = useState<any>(null);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [bids, setBids] = useState<any[]>([]);
  const [activity, setBuildingActivity] = useState<any[]>([]);
  const [currType, setCurrencyType] = useState<string>("USDG");
  const [bnbRate, setBnbRate] = useState(1);
  const [ethRate, setEthRate] = useState(1);

  useEffect(() => {
    const storedValue = localStorage.getItem("currType");
    if (storedValue !== null) {
      setCurrencyType(storedValue);
    }
  }, []); // empty dependency array, so this effect only runs once on mount

  const user = useSelector(selectUser);

  const fetchBuilding = async (buildingId: string) => {
    try {
      setPageLoader(true);
      const response = await dispatch(getMarketplaceBuildingAction(buildingId));
      console.log("Response: ", response);
      if (response.meta && response.meta.requestStatus === "fulfilled") {
        let payload = response.payload;
        let nft = {};
        if (payload.nft.name === "ListingPlaced") {
          setBuilding({ ...payload.nft.nft, ...payload.nft });
        } else setBuilding(payload.nft);

        const data = { listingId: response.payload.nft.listingId };

        const listingData = await marketplaceService.getListing(
          response.payload.nft._id,
          data
        );

        setListing(listingData.data.data);

        console.log("Listing: ", listingData);

        const biddingData = await marketplaceService.getBidsByListingId({
          listingId: listingData.data.data._id,
        });

        setBids(biddingData.data.data);

        console.log("Biddings: ", biddingData);

        if (payload.nft.nft?._id)
          fetchBuildingActivity(1, payload.nft.nft?._id);
        setPageLoader(false);
      } else {
        setPageLoader(false);
      }
    } catch (err: any) {
      console.log(err);
      setPageLoader(false);
    }
  };
  const fetchBuildingActivity = async (page = 1, buildingId: string) => {
    try {
      const response = await marketplaceService.getNftActivity(buildingId, {
        page: page,
      });
      if (response?.data?.data) {
        setBuildingActivity(response.data.data.buildings);
      }
    } catch (err: any) {
      console.log(err.request.statusCode);
    }
  };
  // const getBnbRate = async () => {
  //   const response = await getBNBRate();
  //   if (response) {
  //     setRate(response);
  //   }
  // };

  const fetchBuildings = async (page: number = 1) => {
    try {
      const response = await dispatch(getMarketplaceSimilarBuildingsAction());
      if (response.meta && response.meta.requestStatus === "fulfilled") {
        setBuildings(response.payload);
      }
    } catch (err: any) {
      console.log(err.request.statusCode);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBuilding(id.toString());
    }
  }, [id]);

  const showStreetView = () => {
    handleShowModal(CONSTANTS.STREET_VIEW, {
      address: building?.address,
      lat: building?.location?.lat,
      lng: building?.location?.lng,
    });
  };

  console.log(building, "building");

  useEffect(() => {
    if (success && status && building && user) {
      handleShowModal(CONSTANTS.BUY_NFT_SUCCESS, {
        src: building?.image,
        name: building?.address,
        listingId: building?.listingId,
        loading: loading,
        tokenId: building?.tokenId,
        from: building?.from,
        address: building.address,
        status: building.status,
        price: building.price,
        owner: building?.ownerId?.username,
        rate: currType === "BNB" ? bnbRate : currType === "ETH" ? ethRate : 1,
        currType,
        refetch: () => (id ? fetchBuilding(id.toString()) : () => {}),
      });
    }
  }, [success, status, building]);

  useEffect(() => {
    // getBnbRate();
    fetchBuildings();
  }, []);

  useEffect(() => {
    getRates();
  }, []);

  const getButtonState = () => {
    if (building?.status?.toLowerCase() === "Minted".toLowerCase())
      return "LIST ON MARKETPLACE";
    if (
      building?.status?.toLowerCase() === "PLACED".toLowerCase() &&
      building.isActive
    )
      return "UNLIST";
  };

  const placeABid = () => {
    handleShowModal(CONSTANTS.MAKE_AN_OFFER, {
      src: building.image,
      name: building.address,
      listingId: building.listingId,
      loading: loading,
      nftId: building?._id,
      bidder: user._id,
      highestBiddingPrice: listing.highestBiddingId
        ? listing.highestBiddingId.price
        : listing.price,
      refetch: () => (id ? fetchBuilding(id.toString()) : () => {}),
    });
  };

  const sendOffer = () => {
    console.log("Inside send offer");
    if (!user) {
      handleShowModal(CONSTANTS.LOGIN);
      return;
    }
    // console.log("LOG: ", user);
    handleShowModal(CONSTANTS.SEND_OFFER, {
      id: id,
      src: building.image,
      tokenId: building.tokenId,
      listingId: building.listingId,
      buyer: user._id,
      seller: building.ownerId._id,
      name: building.address,
      removeItemFromCurrentList: () => router.push("/recieveOffers"),
    });
  };

  const mintNft = () => {
    if (isOwner) return;
    if (!user) {
      handleShowModal(CONSTANTS.LOGIN);
      return;
    }

    handleShowModal(CONSTANTS.MINT_NFT, {
      src: building.image,
      name: building.address,
      id: id,
      mint: mint,
      lat: building.location.lat,
      lng: building.location.lng,
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
      tokenId: building.tokenId,
      ownerAddress: building.ownerAddress,
      from: building?.from,
      price: building?.price,
      src: building.image,
      refetch: () => (id ? fetchBuilding(id.toString()) : () => {}),
      to: user?.metamaskId,
      address: building.address,
      listingId: building.listingId,
      lat: building.location.lat,
      lng: building.location.lng,
    });
  };

  const mint = async () => {
    try {
      handleModalHide(CONSTANTS.MINT_NFT);
      handleShowModal(CONSTANTS.LOADING, {
        type: "mint",
        address: building.address,
        name: building.address,
        src: building.image,
      });
      setLoading(true);
      const response: any = await mintNFT({
        price: building.price,
        image: building.image,
        area: building.area,
        address: building.address,
        location: building.location,
        geometry: building.geometry,
        incAddress: building.incAddress,
      });
      const { success, ...rest } = response;
      if (success && id) {
        console.log("Rest: ", rest);

        const res = await marketplaceService.mintNft(id.toString(), rest);

        handleModalHide(CONSTANTS.LOADING);
        handleShowModal(CONSTANTS.SUCCESS, { type: "mint" });
        id && fetchBuilding(id.toString());

        router.push("/dashboard");
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
    console.log("Action", building);
    if (building.status === "minted") {
      handleShowModal(CONSTANTS.LIST_NFT, {
        id: id,
        src: building.image,
        tokenId: building.tokenId,
        owner: building.owner,
        ownerAddress: building.ownerAddress,
        creatorAddress: building.creatorAddress,
        name: building.address,
        price: currType === "BNB" ? bnbRate : currType === "ETH" ? ethRate : 1,
        index: 0,
        removeItemFromCurrentList: () => router.push("/marketplace"),
      });
    } else if (building.status === "listed") {
      console.log("Inside Listed Action");
      handleShowModal(CONSTANTS.LOADING, {
        type: "unlist",
        address: building.address,
        name: building.address,
        src: building.image,
      });

      let response: any = {};

      // if (platformOwnerAddress !== building.ownerAddress) {
      //   response = await unlistNft(building.listingId, building.to);
      // } else {
      //   response.success = true;
      // }

      if (user.isMetamaskUser) {
        response = await unlistNft(building.listingId, building.to);
      } else {
        response.success = true;
      }

      console.log("Response: ", response);

      const { success, ...rest } = response;

      if (success) {
        console.log("Rest: ", rest);

        rest.listingId = building.listingId;

        const res = await marketplaceService.unlistNft(building._id, rest);

        handleModalHide(CONSTANTS.LOADING);
        handleShowModal(CONSTANTS.SUCCESS, { type: "unlist" });
        id && fetchBuilding(id.toString());
      } else {
        handleModalHide(CONSTANTS.LOADING);
      }
    }
  };

  // useEffect(() => {
  //   getRates();
  // }, []);

  const getRates = async () => {
    const response = await getBNBRate();
    if (response) {
      setBnbRate(response);
    }
    const ethResponse = await getEthRate();
    if (ethResponse) {
      setEthRate(ethResponse);
    }
  };

  useEffect(() => {
    const storedValue = localStorage.getItem("currType");
    if (storedValue !== null) {
      setCurrencyType(storedValue);
    }
  }, []); // empty dependency array, so this effect only runs once on mount

  const isCreator =
    user?.metamaskId?.toLowerCase() === building?.creater?.toLowerCase();
  const isOwner = user?._id === building?.ownerId?._id;

  if (pageLoader)
    return (
      <div className="container">
        <DetailShimmer />
      </div>
    );
  return (
    <div className="container">
      <Head>
        <title>{building?.address || "NFT"} - Gameree</title>
      </Head>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-[8.188rem] pt-[6.75rem] mb-[8.313rem]">
        <div className="AtGradient rounded-2xl  h-fit">
          <div className="w-full h-full AtBoxInner rounded-2xl duration-800	transition-all overflow-hidden">
            <MagnifyImage
              figClassName={` relative w-full h-full vimeo-video-container `}
              src={building?.image ?? "/assets/images/detail-page.png"}
            />
          </div>
        </div>
        <div className="">
          <h2 className="text-[6.75rem] text-primary  mb-[1.125rem]  AtStroke break-all">
            {building?.address}
          </h2>
          <div className="flex gap-10 mb-[2.688rem]"></div>
          <div className="mb-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#CEC7D1] text-xl font-Montserrat-Medium">
                  PRICE
                </p>
                <h3 className="text-[3.5rem] leading-[4.563rem]">
                  {(
                    Number(building?.price || 0) /
                    (currType === "BNB"
                      ? bnbRate
                      : currType === "ETH"
                      ? ethRate
                      : 1)
                  ).toFixed(3)}{" "}
                  {currType}{" "}
                  <span className="text-2xl text-[#9FA0A2]">
                    (${building?.price})
                  </span>
                </h3>
              </div>

              {building?.status === "listed" &&
                listing?.sellMode === NFT_TYPES.auction && (
                  <Countdown
                    date={
                      new Date(listing?.startTime * 1000).getTime() +
                      listing?.duration * 1000
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
                                {moment(listing?.endTime).fromNow()}
                              </p>
                            </div>
                          </>
                        );
                      } else {
                        return (
                          <div className="flex gap-2">
                            <h3 className="text-[3.5rem] leading-[4.563rem]">
                              {days}D :
                            </h3>
                            <h3 className="text-[3.5rem] leading-[4.563rem]">
                              {hours}H :
                            </h3>
                            <h3 className="text-[3.5rem] leading-[4.563rem]">
                              {minutes}M :
                            </h3>
                            <h3 className="text-[3.5rem] leading-[4.563rem]">
                              {seconds}S
                            </h3>
                          </div>
                        );
                      }
                    }}
                  />
                )}
            </div>
          </div>

          {building?.status === "listed" &&
          listing?.sellMode === NFT_TYPES.auction &&
          listing?.endTime === undefined &&
          !isOwner ? (
            <Button
              disabled={loading}
              className="bg-white !text-purples mb-[3.25rem] hover:!text-white"
              onClick={placeABid}
            >
              PLACE A BID
            </Button>
          ) : building?.status === "listed" &&
            listing?.sellMode === NFT_TYPES.fixedPrice &&
            isOwner ? (
            <Button
              disabled={loading}
              className="bg-white !text-purples mb-[3.25rem] hover:!text-white"
              onClick={performAction}
            >
              UNLIST
            </Button>
          ) : building?.status === "listed" &&
            listing?.sellMode === NFT_TYPES.fixedPrice &&
            !isOwner ? (
            <Button
              disabled={loading}
              className="bg-white !text-purples mb-[3.25rem] hover:!text-white"
              onClick={buyNft}
            >
              BUY
            </Button>
          ) : !building?.ownerId?._id ? (
            <Button
              disabled={loading}
              className="bg-white !text-purples mb-[3.25rem] hover:!text-white"
              onClick={mintNft}
            >
              MINT
            </Button>
          ) : null}
          {building?.status?.toLowerCase() === "listed".toLowerCase() &&
          listing?.sellMode === NFT_TYPES.fixedPrice &&
          !isOwner ? (
            <Button
              disabled={loading}
              className="bg-white !text-purples mb-[3.25rem] hover:!text-white mx-5"
              onClick={sendOffer}
            >
              Send Offer
            </Button>
          ) : null}
          {building?.status === "listed" &&
          building?.listing?.sellMode === NFT_TYPES.fixedPrice &&
          isOwner ? (
            <Button
              disabled={loading}
              className="bg-white !text-purples mb-[3.25rem] hover:!text-white"
              onClick={performAction}
            >
              UNLIST
            </Button>
          ) : building?.status === "minted" && isOwner ? (
            <Button
              disabled={loading}
              className="bg-white !text-purples mb-[3.25rem] hover:!text-white"
              onClick={performAction}
            >
              LIST ON MARKETPLACE
            </Button>
          ) : null}
          <Button
            className="shadows bg-white text-4xl md:text-[2.8rem] !text-black1 hover:!text-white mx-5"
            onClick={showStreetView}
            disabled={loading}
          >
            <i className="icon-street text-4xl mr-5"></i>
            STREET VIEW
          </Button>
          <div className="w-full px-8 pt-5 pb-10 border-2 rounded-2xl border-primary">
            <h5 className="mb-6">Details</h5>
            <div className="">
              <span className="text-[#9FA0A2] text-base font-Montserrat-Medium mb-2">
                Contract Address
              </span>
              <p className="text-lg font-Montserrat-SemiBold text-primary mr-12 break-all">
                {nftMarketplaceAddress}
              </p>
            </div>
            <div className="mt-8">
              <span className="text-[#9FA0A2] text-base font-Montserrat-Medium mb-2">
                OWNER OF THE PROPERTY
              </span>
              <p className="text-md font-Montserrat-SemiBold text-primary break-all">
                {building?.ownerId?.username || building?.owner || "GAMEREE"}
              </p>
            </div>
            <div className="flex xs:flex-col  gap-[6.18rem] xs:gap-[1rem]  mt-8">
              <div className="w-1/3">
                <span className="text-[#9FA0A2] text-base font-Montserrat-Medium mb-2">
                  Blockchain
                </span>
                <p className="text-lg font-Montserrat-SemiBold text-primary">
                  BSC
                </p>
              </div>
              <div className="w-1/3">
                <span className="text-[#9FA0A2] text-base font-Montserrat-Medium mb-2">
                  Royalty
                </span>
                <p className="text-lg font-Montserrat-SemiBold text-primary">
                  {building?.royalty ?? 0}%
                </p>
              </div>
              <div className="w-1/3">
                <span className="text-[#9FA0A2] text-base font-Montserrat-Medium mb-2">
                  Last updated
                </span>
                <p className="text-lg font-Montserrat-SemiBold text-primary">
                  {building
                    ? moment(building.updatedAt).format("DD MMM, YYYY")
                    : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:w-[46.313rem] w-full mb-[6.25rem]">
        <h5 className="text-primary mb-[0.875rem] ">Description</h5>
        <p className="text-[#9FA0A2] text-lg mb-4 font-Montserrat-Medium">
          Address: {building?.address}
        </p>
        <p className="text-[#9FA0A2] text-lg mb-12 font-Montserrat-Medium">
          Area: {building?.area} SQFT
        </p>
        {activity.length > 0 && (
          <div className="bg-[#17191F] px-8 pt-5 pb-[1.125rem] border-2 border-primary rounded-2xl">
            <h5 className="mb-5 text-primary ">Item Activity</h5>

            {activity.map((item, i) => {
              const soldTo =
                item.soldTo.substring(0, 8) +
                "..." +
                item.soldTo.substring(item.soldTo.length - 5);
              return (
                <div
                  className="bg-[#1C1E25] py-5 px-4 rounded-2xl mb-4 flex sm:flex-row flex-col justify-between"
                  key={i}
                >
                  <div className="flex gap-3">
                    <ImageComponent
                      figClassName="cursor-pointer"
                      src="/assets/images/profile.png"
                      width={42}
                      height={42}
                      objectFit="cover"
                      className="rounded-full"
                    />

                    <div className="">
                      <p className="text-base text-primary font-Montserrat-SemiBold">
                        Bought by{" "}
                        <span className="text-base font-Montserrat-Regular text-primary">
                          {soldTo}
                        </span>
                      </p>
                      <span className="text-[#7F828B] text-base">
                        {moment(item.updatedAt).format("MMM DD, YYYY")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:ml-0 ml-[4.2rem]">
                    <p className="text-xl font-Montserrat-SemiBold text-primary">
                      {item.price} {"BNB"}
                    </p>
                    <i
                      className={`icon-copy-1 text-base text-[#9FA0A2] cursor-pointer`}
                      onClick={() => {
                        window.open(
                          "https://testnet.bscscan.com/tx/" +
                            item.transactionHash,
                          "_blank"
                        );
                      }}
                    ></i>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="sm:w-[46.313rem] w-full mb-[6.25rem]">
        {bids.length > 0 && (
          <div className="bg-[#17191F] px-8 pt-5 pb-[1.125rem] border-2 border-primary rounded-2xl">
            <h5 className="mb-5 text-primary ">Bids</h5>

            {bids.map((item, i) => {
              const bidder =
                // item.bidder.substring(0, 8) +
                // "..." +
                // item.bidder.substring(item.bidder.length - 5);
                item.bidder.fullName;

              return (
                <div
                  className="bg-[#1C1E25] py-5 px-4 rounded-2xl mb-4 flex sm:flex-row flex-col justify-between"
                  key={i}
                >
                  <div className="flex gap-3">
                    <ImageComponent
                      figClassName="cursor-pointer"
                      src="/assets/images/profile.png"
                      width={42}
                      height={42}
                      objectFit="cover"
                      className="rounded-full"
                    />

                    <div className="">
                      <p className="text-base text-primary font-Montserrat-SemiBold">
                        Bid by{" "}
                        <span className="text-base font-Montserrat-Regular text-primary">
                          {bidder}
                        </span>
                      </p>
                      <span className="text-[#7F828B] text-base">
                        {moment(item.updatedAt).format("MMM DD, YYYY")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:ml-0 ml-[4.2rem]">
                    <p className="text-xl font-Montserrat-SemiBold text-primary">
                      {item.price} {"BNB"}
                    </p>
                    <i
                      className={`icon-copy-1 text-base text-[#9FA0A2] cursor-pointer`}
                      onClick={() => {
                        window.open(
                          "https://testnet.bscscan.com/tx/" +
                            item.transactionHash,
                          "_blank"
                        );
                        // navigator.clipboard.writeText('https://testnet.bscscan.com/tx/' + item.transactionHash);
                        // toast.success("copied");
                      }}
                    ></i>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <h3 className="mb-10 text-5xl">YOU MAY ALSO LIKE</h3>
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2">
        {buildings.map((building, index) => (
          <Card
            key={building._id}
            id={building._id}
            nft={building}
            index={index}
            user={user}
            removeItemFromCurrentList={() => {}}
            rate={
              currType === "BNB" ? bnbRate : currType === "ETH" ? ethRate : 1
            }
          />
        ))}
      </div>
    </div>
  );
};

export default MarketPlaceDetailModule;
