import React, { useEffect, useState } from "react";
import Button from "../button/Button";
import ImageComponent from "../imageComponent/ImageComponent";
import { AiOutlineHeart } from "react-icons/ai";
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

interface IProps {
  id: string;
  bg?: string;
  offer: any;
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

const SentOfferCard = ({
  id,
  offer,
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

  const router = useRouter();
  const dispatch = useDispatch();

  const viewOffer = () => {
    console.log("Inside View Offer");
    // if (isOwner) return;
    if (!user) {
      handleShowModal(CONSTANTS.LOGIN);
      return;
    }
    handleShowModal(CONSTANTS.VIEW_SENT_OFFER, {
      id: offer._id,
      nftId: offer.nft._id,
      from: offer.from,
      price: offer.price,
      src: offer.nft.image,
      //   refetch: refetch,
      to: offer.to,
      address: offer.nft.address,
      offerId: offer.offerId,
      tokenId: offer.nft.tokenId,
      listingId: offer.nft.listingId,
      listingPrice: offer.nft.price,
      status: offer.status,
      //   lat: offer.nft?.location?.lat,
      //   lng: offer.nft?.location?.lng,
    });

    // handleShowModal(CONSTANTS.MINT_NFT, {
    //   src: offer.nft.image,
    //   name: offer.nft.address,
    //   id: id,
    //   mint: offer.mint,
    //   lat: offer.nft.location.lat,
    //   lng: offer.nft.location.lng,
    // });
  };

  //   console.log("Log: ", isDashboard);

  //   const mint = async () => {
  //     console.log("Inside Mint");
  //     try {
  //       handleModalHide(CONSTANTS.MINT_NFT);
  //       handleShowModal(CONSTANTS.LOADING, {
  //         type: "mint",
  //       });
  //       setLoading(true);
  //       const response: any = await mintNFT({
  //         price: nft.price,
  //         image: nft.image,
  //         area: nft.area,
  //         address: nft.address,
  //         location: nft.location,
  //         geometry: nft.geometry,
  //         incAddress: nft.incAddress,
  //       });
  //       const { success, ...rest } = response;
  //       if (success) {
  //         // const response: any = await getTokenId();
  //         // const { successs, tokenId } = response;

  //         // rest.tokenId = tokenId;

  //         console.log("Rest: ", rest);

  //         const res = await marketplaceService.buyNft(id, rest);
  //         handleModalHide(CONSTANTS.LOADING);
  //         handleShowModal(CONSTANTS.SUCCESS, { type: "mint" });
  //         removeItemFromCurrentList(index);

  //         //Default Listing
  //         let payload: any = {};

  //         payload.type = NFT_TYPES.fixedPrice;
  //         payload.tokenId = rest.tokenId;
  //         payload.reciever = rest.ownerAddress;

  //         //Default 1% of total price

  //         const defaultPrice = (1 / 100) * nft.price;

  //         console.log("Default Price: ", defaultPrice);

  //         payload.price = defaultPrice;

  //         console.log("Payload: ", payload);

  //         const response = await listNFT(payload);
  //         console.log("Response from listing: ", response);

  //         const { success: result, ...restt } = response;

  //         if (result) {
  //           console.log("Rest from listing: ", restt);

  //           restt.listingPrice = defaultPrice;

  //           const res = await marketplaceService.listNft(id, restt);

  //           handleShowModal(SUCCESS, {
  //             type: "list",
  //           });
  //         }
  //       } else {
  //         handleModalHide(CONSTANTS.LOADING);
  //       }
  //       setLoading(false);
  //     } catch (error) {
  //       handleModalHide(CONSTANTS.LOADING);
  //       setLoading(false);
  //     }
  //   };

  //   const refetch = () => {
  //     if (type !== "bid") removeItemFromCurrentList(index);
  //     else dispatch(marketplaceActions.setRefetch());
  //   };

  //   const buy = () => {
  //     if (isOwner) return;
  //     if (!user) {
  //       handleShowModal(CONSTANTS.LOGIN);
  //       return;
  //     }
  //     if (nft.status === "PLACED") {
  //       handleShowModal(CONSTANTS.BUY_NFT, {
  //         from: nft?.from,
  //         price: nft?.price,
  //         src: nft.image,
  //         refetch: refetch,
  //         to: user?.metamaskId,
  //         address: nft.address,
  //         listingId: nft.listingId,
  //         lat: nft?.location?.lat,
  //         lng: nft?.location?.lng,
  //       });
  //     } else {
  //       handleShowModal(CONSTANTS.MINT_NFT, {
  //         src: nft.image,
  //         name: nft.address,
  //         id: id,
  //         mint: mint,
  //         lat: nft.location.lat,
  //         lng: nft.location.lng,
  //       });
  //     }
  //   };

  //   const placeABid = () => {
  //     handleShowModal(CONSTANTS.MAKE_AN_OFFER, {
  //       src: nft.image,
  //       name: nft.address,
  //       listingId: nft.listingId,
  //       loading: loading,
  //       tokenId: nft?.tokenId,
  //       from: nft?.from,
  //     });
  //   };

  console.log(rate, currType, "rate");

  //   const getButtonState = () => {
  //     if (nft.status === "minted") {
  //       return selectedTabIdx === 0 ? "LIST ON MARKETPLACE" : "RESALE";
  //     }
  //     if (nft.status === "listed") return "UNLIST FROM MARKETPLACE";
  //   };

  return (
    <>
      <div className={styles.card}>
        <div
          className={`group relative overflow-hidden ${"AtCardGradient"}  hover:p-[2px] `}
        >
          <div className={` p-[20px] ${"AtBoxInner"} hover:p-[18px]  relative`}>
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

                <div></div>
                <p className="text-sm text-white truncate font-Montserrat-SemiBold">
                  Cameron Williamson
                </p>
              </div>
            </div>

            <div className="relative ">
              {/* <Link href={`/marketplace/${id}`}> */}
              {/* <a href=""> */}
              {/* <div className="absolute w-full h-full -top-1/2 invisible cursor-pointer group-hover:visible left-0  bg-gradient-to-b z-10 from-[black] to-transparent "></div> */}
              <>
                <div>
                  <ImageComponent
                    figClassName="cursor-pointer mx-auto flex justify-center vimeo-video-container"
                    src={offer.nft.image ?? "/assets/images/detail-page.png"}
                    layout="fill"
                    className="rounded-2xl vimeo-video transition-all duration-700 hover:scale-150 img"
                    priority
                  />
                </div>
              </>
              {/* </a> */}
              {/* </Link> */}
              <Button
                disabledClass="opacity-70 hover:bg-transparent disabled:text-white"
                disabled={loading || isOwner}
                className="!absolute w-[184px] bottom-2  hover:!text-white !text-3xl block hover:!bg-purples  left-1/2 -translate-x-1/2 border-purples border-2 !text-purples !bg-white !pt-2 !pb-1"
                onClick={viewOffer}
              >
                OFFER DETAILS
              </Button>
            </div>

            <div>
              <div className="mt-5 ">
                <h4 className="mt-4  text-primary line-clamp-2 sm:h-[85px]">
                  {offer.nft.address}
                </h4>
                <div className="flex items-center gap-2 mt-2">
                  <div className="border border-[#2B2C2D] bg-[#14151B] text-center rounded-xl px-6 py-2 w-1/2 truncate">
                    <p>OFFER</p>
                    <h5 className="truncate whitespace-nowrap">
                      {`${(Number(offer.price) / rate).toFixed(2)} ${
                        currType || "$"
                      }`}
                    </h5>
                  </div>
                  <div className="border border-[#2B2C2D] bg-[#14151B] text-center rounded-xl px-6 py-2 w-1/2">
                    <p>STATUS</p>
                    <h5 className="truncate">{offer.status}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SentOfferCard;
