import NiceModal, { useModal } from "@ebay/nice-modal-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBNBRate,
  getEthRate,
  mintNFT,
  placeBid,
  unlistNft,
} from "../../metamask/metamask";
import { marketplaceService } from "../../services/marketplace.service";
import { selectUser } from "../../store/auth/selector";
import Modal from "../../components/modal/Modal";
import Button from "../../components/button/Button";
import ImageComponent from "../../components/imageComponent/ImageComponent";
import { handleModalHide, handleShowModal } from "../../utils/showModal";
import * as CONSTANTS from "../../constants";
import { getUserBuildings } from "../../store/marketplace/async.func";
import { NFT_MAP_VIEW } from "../../constants";
import { NFT_TYPES } from "../../constants/nftType.enum";
import { listNFT } from "../../metamask/metamask";
import { SUCCESS } from "../../constants";
import { useRouter } from "next/router";
// import MagnifyImage from "../../components/MagnifyImage/MagnifyImage";
import dynamic from "next/dynamic";
const MagnifyImage = dynamic(
  () => import("../../components/MagnifyImage/MagnifyImage"),
  { ssr: false }
);

const tabs = [{ name: "DETAIL", type: "minted" }];

const MapViewModal = ({ toggleStreetView, onClose, nft, zoomIn }: any) => {
  const router = useRouter();
  const [selectedTabIdx, setSelectedTabIdx] = useState(0);

  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState([]);
  const user: any = useSelector(selectUser);
  const dispatch = useDispatch();

  console.log("User: ", user);
  console.log("Map NFT: ", nft);

  const getAssets = async () => {
    try {
      if (user) {
        const response = await dispatch(
          getUserBuildings({
            type: "assets",
          })
        );
        setAssets(response?.payload?.buildings || []);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getAssets();
  }, []);

  const [rate, setRate] = useState(0);
  const getBnbRate = async () => {
    const response = await getBNBRate();
    if (response) {
      setRate(response);
    }
  };

  useEffect(() => {
    getBnbRate();
  }, []);

  const mint = async () => {
    console.log("Inside Mint");
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

        const res = await marketplaceService.mintNft(nft._id, rest);
        handleModalHide(CONSTANTS.LOADING);
        handleShowModal(CONSTANTS.SUCCESS, { type: "mint" });

        // //Default Listing
        // let payload: any = {};

        // payload.type = NFT_TYPES.fixedPrice;
        // payload.tokenId = rest.tokenId;
        // payload.reciever = rest.ownerAddress;

        // //Default 1% of total price

        // const defaultPrice = (1 / 100) * nft.price;

        // console.log("Default Price: ", defaultPrice);

        // payload.price = defaultPrice;

        // console.log("Payload: ", payload);

        // const response = await listNFT(payload);
        // console.log("Response from listing: ", response);

        // const { success: result, ...restt } = response;

        // if (result) {
        //   console.log("Rest from listing: ", restt);

        //   restt.listingPrice = defaultPrice;

        //   const res = await marketplaceService.listNft(nft._id, restt);

        //   handleShowModal(SUCCESS, {
        //     type: "list",
        //   });
        // }
      } else {
        handleModalHide(CONSTANTS.LOADING);
      }
      setLoading(false);
      handleModalHide(CONSTANTS.NFT_MAP_VIEW);
      router.push("/dashboard");
    } catch (error) {
      handleModalHide(CONSTANTS.LOADING);
      setLoading(false);
    }
  };

  const buyNft = () => {
    // if (isOwner) return;
    if (!user) {
      handleShowModal(CONSTANTS.LOGIN);
      return;
    }

    handleModalHide(CONSTANTS.NFT_MAP_VIEW);

    handleShowModal(CONSTANTS.BUY_NFT, {
      id: nft._id,
      tokenId: nft.tokenId,
      ownerAddress: nft.ownerAddress,
      from: nft?.from,
      price: nft?.price,
      src: nft.image,
      // refetch: refetch,
      to: user?.metamaskId,
      address: nft.address,
      listingId: nft.listingId,
      lat: nft?.location?.lat,
      lng: nft?.location?.lng,
    });
  };

  // const performAction = async (actionType: string) => {
  //   setLoading(true);
  //   if (actionType === "list") {
  //     handleShowModal(CONSTANTS.LIST_NFT, {
  //       src: nft.image,
  //       tokenId: nft.tokenId,
  //       owner: nft.owner,
  //       name: nft.address,
  //       index: 0,
  //       removeItemFromCurrentList: () => {},
  //     });
  //   } else if (actionType === "unlist") {
  //     handleShowModal(CONSTANTS.LOADING, {
  //       type: "unlist",
  //       address: nft.address,
  //       name: nft.address,
  //       src: nft.image,
  //     });
  //     const response = await unlistNft(nft.listingId, nft.to);
  //     if (response) {
  //       handleModalHide(CONSTANTS.LOADING);
  //       handleShowModal(CONSTANTS.SUCCESS, { type: "unlist" });
  //     } else {
  //       handleModalHide(CONSTANTS.LOADING);
  //     }
  //   }
  //   setLoading(false);
  // };

  const performAction = async () => {
    console.log("Action", nft);

    handleModalHide(CONSTANTS.NFT_MAP_VIEW);

    if (nft.status === "minted") {
      handleShowModal(CONSTANTS.LIST_NFT, {
        id: nft._id,
        src: nft.image,
        tokenId: nft.tokenId,
        owner: nft.owner,
        ownerAddress: nft.ownerAddress,
        creatorAddress: nft.creatorAddress,
        name: nft.address,
        index: 0,
        price: (Number(nft?.price) / rate).toFixed(3),
        removeItemFromCurrentList: () => {},
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

      if (user.isMetamaskUser) {
        response = await unlistNft(nft.listingId, nft.to);
      } else {
        response.success = true;
      }

      console.log("Response: ", response);

      const { success, ...rest } = response;

      if (success) {
        console.log("Rest: ", rest);

        rest.listingId = nft.listingId;

        const res = await marketplaceService.unlistNft(nft._id, rest);

        handleModalHide(CONSTANTS.LOADING);
        handleShowModal(CONSTANTS.SUCCESS, { type: "unlist" });
      } else {
        handleModalHide(CONSTANTS.LOADING);
      }
    }
  };

  // const buy = () => {
  //   if (!user || !user.metamaskId) {
  //     handleShowModal(CONSTANTS.LOGIN);
  //     return;
  //   }
  //   if (nft.status === "PLACED") {
  //     handleShowModal(CONSTANTS.BUY_NFT, {
  //       from: nft?.from,
  //       price: nft?.price,
  //       src: nft.image,
  //       refetch: () => {},
  //       to: user?.metamaskId,
  //       address: nft.address,
  //       listingId: nft.listingId,
  //       lat: nft.location.lat,
  //       lng: nft.location.lng,
  //     });
  //   } else {
  //     mint();
  //   }
  // };
  const buy = () => {
    if (!user) {
      handleShowModal(CONSTANTS.LOGIN);
      return;
    }
    modal.remove();
    if (nft.status === "PLACED") {
      handleShowModal(CONSTANTS.BUY_NFT, {
        from: nft?.from,
        price: nft?.price,
        src: nft.image,
        refetch: () => {},
        to: user?.metamaskId,
        address: nft.address,
        listingId: nft.listingId,
        lat: nft.location.lat,
        lng: nft.location.lng,
      });
    } else {
      handleShowModal(CONSTANTS.MINT_NFT, {
        src: nft.image,
        name: nft.address,
        id: nft._id,
        mint: mint,
        lat: nft.location.lat,
        lng: nft.location.lng,
      });
    }
  };

  const mintNft = () => {
    // if (isOwner) return;
    if (!user) {
      handleShowModal(CONSTANTS.LOGIN);
      return;
    }

    handleShowModal(CONSTANTS.MINT_NFT, {
      src: nft.image,
      name: nft.address,
      id: nft._id,
      mint: mint,
      lat: nft.location.lat,
      lng: nft.location.lng,
    });
  };

  const placeABid = () => {
    handleModalHide(CONSTANTS.NFT_MAP_VIEW);
    handleShowModal(CONSTANTS.MAKE_AN_OFFER, {
      src: nft.image,
      name: nft.address,
      listingId: nft.listingId,
      loading: loading,
      nftId: nft?._id,
      bidder: user._id,
      highestBiddingPrice: nft.listing.highestBiddingId
        ? nft.listing.highestBiddingId.price
        : nft.listing.price,
    });
  };

  const sendOffer = () => {
    console.log("Inside send offer");
    if (!user) {
      handleShowModal(CONSTANTS.LOGIN);
      return;
    }
    handleModalHide(CONSTANTS.NFT_MAP_VIEW);
    handleShowModal(CONSTANTS.SEND_OFFER, {
      id: nft._id,
      src: nft.image,
      tokenId: nft.tokenId,
      listingId: nft.listingId,
      buyer: user._id,
      seller: nft.ownerId._id,
      name: nft.address,
      removeItemFromCurrentList: () => router.push("/recieveOffers"),
    });
  };

  // const getCase = () => {
  //   if (user?._id !== nft?.ownerId?._id && nft.status === "listed") {
  //     return (
  //       <>
  //         <Button
  //           className="shadows text-4xl md:text-[2.8rem] w-full mb-4"
  //           disabled={loading}
  //           onClick={buyNft}
  //         >
  //           BUY NOW
  //         </Button>
  //         <Button
  //           className="shadows text-4xl md:text-[2.8rem] w-full"
  //           disabled={loading}
  //           onClick={placeABid}
  //         >
  //           SEND OFFER
  //         </Button>
  //       </>
  //     );
  //   } else if (!nft.status && !nft.tokenId) {
  //     return (
  //       <Button
  //         className="shadows text-4xl md:text-[2.8rem] w-full"
  //         disabled={loading}
  //         onClick={mintNft}
  //       >
  //         MINT
  //       </Button>
  //     );
  //   }
  // };

  // useEffect(() => {
  //   return () => {
  //     onClose()
  //   }
  // }, [])

  const [bnbRate, setBnbRate] = useState(1);
  const [ethRate, setEthRate] = useState(1);
  const [currType, setCurrencyType] = useState<string>("USDG");

  const rateCurr =
    currType === "BNB" ? bnbRate : currType === "ETH" ? ethRate : 1;

  useEffect(() => {
    const storedValue = localStorage.getItem("currType");
    if (storedValue !== null) {
      setCurrencyType(storedValue);
    }
  }, []); // empty dependency array, so this effect only runs once on mount

  useEffect(() => {
    getRates();
  }, []);

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

  const modal = useModal();
  // console.log("modal:-=-=-=-=", modal)
  const handleViewasset = (data: any) => {
    handleShowModal(NFT_MAP_VIEW, {
      toggleStreetView: toggleStreetView,
      nft: data,
      zoomIn: zoomIn,
    });
    setSelectedTabIdx(0);
  };
  return (
    <Modal
      hide={() => {
        modal.remove();
        zoomIn();
      }}
      show={modal.visible}
      afterClose={() => modal.remove()}
      className={modal.id === "nft_map_view" ? "backdrop-blur-md" : ""}
      hideBg={modal.id === "nft_map_view"}
    >
      <div className="sm:w-[38.125rem] w-full">
        <div className="bg-[#C164E2] rounded-[2.8rem] text-center mb-8">
          <div className="rounded-[2.8rem] bg-black1 py-4 px-8 relative ">
            <i
              className="icon-cross text-white absolute text-2xl top-[50%] -translate-y-1/2 right-8 cursor-pointer "
              onClick={() => {
                modal.remove();
                zoomIn();
              }}
            ></i>
            <h3 className="text-5xl">{nft.text}</h3>
            <p className="text-white">{nft.address}</p>
          </div>
          {nft.owner && (
            <p className="text-white text-xl py-2 uppercase">
              This Property is OWNED
            </p>
          )}
        </div>
        <div className=" mb-5">
          <nav
            className=" w-[20rem] rounded-xl text-center mx-auto bg-white justify-cente  py-2"
            aria-label="Tabs"
          >
            <span className="text-4xl md:text-[2.8rem] font-TTTrailers-Bold !text-purples">
              DETAIL
            </span>
          </nav>
        </div>
        {selectedTabIdx === 0 ? (
          <div className="">
            <ImageComponent
              src={nft.image ?? "/assets/images/modal/map.png"}
              layout="fill"
              objectFit="contain"
              className="rounded-xl"
              figClassName="h-[20rem] w-full"
            />
            {/* <div className=" flex items-center justify-center">

            <MagnifyImage className='rounded-none' figClassName="h-[20rem] w-[30rem]" src={nft.image ?? "/assets/images/modal/map.png"} />
            </div> */}
            <div className="bg-[rgba(0,0,0,.4)] text-center pt-3 mt-6">
              <p className="text-sm text-lightgray">OWNER OF THE PROPERTY</p>
              <h4 className="mt-3 break-all">
                {nft?.ownerId?.username || "GAMEREE"}
              </h4>
              <div className="grid grid-cols-2 border-t border-[#070E1E2B] mt-4">
                <div className="border-r border-[#070E1E2B] py-4 pl-5">
                  <p className="text-sm text-lightgray text-left">PRICE</p>
                  <h4 className="mt-3">
                    {`${(Number(nft?.price) / rateCurr).toFixed(3)} ${
                      currType || "$"
                    }`}
                  </h4>
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
              {user?._id !== nft?.ownerId?._id &&
              nft.status === "listed" &&
              nft.listing.sellMode === "FIXED" ? (
                <div>
                  <Button
                    className="shadows text-4xl md:text-[2.8rem] w-full"
                    disabled={loading}
                    onClick={buyNft}
                  >
                    BUY NOW
                  </Button>
                </div>
              ) : user?._id !== nft?.ownerId?._id &&
                nft.status === "listed" &&
                nft.listing.sellMode === "AUCTION" ? (
                <div>
                  <Button
                    className="shadows text-4xl md:text-[2.8rem] w-full"
                    disabled={loading}
                    onClick={placeABid}
                  >
                    PLACE BID
                  </Button>
                </div>
              ) : !nft.status && !nft.tokenId ? (
                <Button
                  className="shadows text-4xl md:text-[2.8rem] w-full"
                  disabled={loading}
                  onClick={mintNft}
                >
                  MINT
                </Button>
              ) : user?._id === nft?.ownerId?._id && nft.status === "minted" ? (
                <Button
                  className="shadows text-4xl md:text-[2.8rem] w-full"
                  disabled={loading}
                  onClick={performAction}
                >
                  LIST
                </Button>
              ) : user?._id === nft?.ownerId?._id &&
                nft.status === "listed" &&
                nft.listing.sellMode === "FIXED" ? (
                <Button
                  className="shadows text-4xl md:text-[2.8rem] w-full"
                  disabled={loading}
                  onClick={performAction}
                >
                  UNLIST
                </Button>
              ) : user?._id === nft?.ownerId?._id &&
                nft.status === "listed" &&
                nft.listing.sellMode === "AUCTION" ? (
                <Button
                  className="shadows text-4xl md:text-[2.8rem] w-full"
                  disabled={true}
                  // onClick={performAction}
                >
                  AUCTIONED
                </Button>
              ) : null}
              {/* {getCase()} */}
            </div>
            {user?._id !== nft?.ownerId?._id &&
            nft.status === "listed" &&
            nft.listing.sellMode === "FIXED" ? (
              <div className="grid grid-cols-1 mt-4 gap-6 px-4 xs:grid-cols-1">
                <Button
                  className="shadows text-4xl md:text-[2.8rem] w-full"
                  disabled={loading}
                  onClick={sendOffer}
                >
                  SEND OFFER
                </Button>
              </div>
            ) : null}
          </div>
        ) : selectedTabIdx === 1 ? (
          <div className="bg-white shadows w-[80%] mx-auto rounded-[1.438rem]  mt-12 overflow-auto">
            <h4 className="text-black1 text-center py-4">PROPERTIES</h4>
            <div style={{ height: "420px", overflow: "auto" }}>
              {!!assets.length &&
                assets.map((asset: any) => (
                  <>
                    <div
                      className="flex justify-between border-l-[5px] border-blue1 pl-3 cursor-pointer"
                      onClick={() => handleViewasset(asset)}
                    >
                      <div className="py-2">
                        <h5 className="text-black">{asset?.address}</h5>
                        <p className="text-black2 text-lg">{asset?.address}</p>
                      </div>
                      <div className="bg-black px-8 text-center py-2">
                        <h5>{(Number(asset?.price) / rateCurr).toFixed(3)}</h5>
                        <p className="text-gray2 text-lg">{currType || "$"}</p>
                      </div>
                    </div>
                    <hr />
                  </>
                ))}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </Modal>
  );
};
export default NiceModal.create(MapViewModal);
