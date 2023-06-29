import NiceModal, { useModal } from "@ebay/nice-modal-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBNBRate,
  getEthRate,
  mintNFT,
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
// import MagnifyImage from "../../components/MagnifyImage/MagnifyImage";
import dynamic from "next/dynamic";
import { userService } from "../../services/user.service";
import Image from "next/image";
const MagnifyImage = dynamic(
  () => import("../../components/MagnifyImage/MagnifyImage"),
  { ssr: false }
);

const tabs = [
  { name: "DETAIL", type: "minted" },
  { name: "ASSETS", type: "owned" },
];

const ProfileModal = ({ toggleStreetView, zoomIn, map }: any) => {
  const [selectedTabIdx, setSelectedTabIdx] = useState(0);

  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState([]);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const user: any = useSelector(selectUser);
  const dispatch = useDispatch();

  const getAssets = async () => {
    try {
      if (user) {
        const response = await dispatch(
          getUserBuildings({
            type: "minted",
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
  const [rateETH, setETHRate] = useState(0);
  const [currType, setCurrencyType] = useState<string>("USDG");

  useEffect(() => {
    const storedValue = localStorage.getItem("currType");
    if (storedValue !== null) {
      setCurrencyType(storedValue);
    }
  }, []); // empty dependency array, so this effect only runs once on mount

  const getBnbRe = async () => {
    const response = await getBNBRate();
    if (response) {
      setRate(response);
    }
  };
  const getETHR = async () => {
    const response = await getEthRate();
    if (response) {
      setETHRate(response);
    }
  };

  useEffect(() => {
    getBnbRe();
    getETHR();
  }, []);

  const getTradedBalance = async () => {
    try {
      const { data } = await userService.nftsvalue();
      setTotalBalance(data.data.price);
    } catch (error) {}
  };
  useEffect(() => {
    if (user) {
      getTradedBalance();
    }
  }, [user]);

  const modal = useModal();
  const handleViewasset = (data: any) => {
    handleShowModal(NFT_MAP_VIEW, {
      toggleStreetView: toggleStreetView,
      nft: data,
      zoomIn: zoomIn,
    });
    setSelectedTabIdx(0);
  };

  const userName = user?.fullName || user?.username || "Username";
  return (
    <Modal
      hide={() => modal.remove()}
      show={modal.visible}
      afterClose={() => modal.remove()}
      className={"backdrop-blur-md"}
      hideBg={false}
      style={{ width: "540px" }}
    >
      <div className=" w-full">
        <div className="bg-[#C164E2] rounded-[2.8rem] text-center mb-8">
          <div className="rounded-[2.8rem] bg-black1 py-4 px-8 relative ">
            <i
              className="icon-cross text-white absolute text-2xl top-[50%] -translate-y-1/2 right-8 cursor-pointer "
              onClick={() => modal.remove()}
            ></i>
            <h3 className="text-5xl">Profile</h3>
          </div>
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
        {selectedTabIdx === 0 && (
          <div
            style={{
              borderTop: "2px solid black",
              borderBottom: "2px solid black",
            }}
            className=" text-center py-3 mt-6"
          >
            <p className="text-sm text-black text-center font-bold">
              USER DETAILS
            </p>
          </div>
        )}

        {selectedTabIdx === 0 && (
          <div className="flex w-full justify-center mb-5 gap-4 py-4">
            <Image
              src={"/assets/images/profile.png"}
              layout="fixed"
              className="rounded-xl"
              height={140}
              width={140}
            />
            <div className="flex flex-col justify-center gap-4 w-1/2">
              <h4 title={userName} className="text-black">
                {userName.slice(0, 12) === userName
                  ? userName
                  : `${userName.slice(0, 12)}...`}
              </h4>
              <div style={{ height: "3px" }} className="bg-black"></div>
              <h4 className="text-purples">Gameree</h4>
            </div>
          </div>
        )}
        {selectedTabIdx === 0 && (
          <div
            style={{
              background: "#34eb7a",
              borderTop: "2px solid black",
              borderBottom: "2px solid black",
            }}
            className="text-center py-3 mt-6"
          >
            <p className="text-sm text-black text-center font-bold">
              NET WORTH
            </p>
          </div>
        )}
        {selectedTabIdx === 0 ? (
          <div className="">
            <div className="bg-[rgba(0,0,0,.4)] text-center pt-3 mt-6 ">
              <p className="text-sm text-lightgray">TOTAL TRADED EARNINGS</p>
              <h4 className="mt-3 break-all">
                {parseFloat(
                  (totalBalance
                    ? Number(totalBalance) /
                      (currType === "BNB"
                        ? rate
                        : currType === "ETH"
                        ? rateETH
                        : 1)
                    : 0
                  ).toFixed(3)
                )}{" "}
                {currType}
              </h4>
              <div className="grid grid-cols-2 border-t border-[#070E1E2B] mt-4">
                <div className="border-r border-[#070E1E2B] py-4 pl-5">
                  <p className="text-sm text-lightgray text-center">
                    USER BALANCE
                  </p>
                  <h4 className="mt-3">
                    {parseFloat(
                      (totalBalance
                        ? Number(totalBalance) /
                          (currType === "BNB"
                            ? rate
                            : currType === "ETH"
                            ? rateETH
                            : 1)
                        : 0
                      ).toFixed(3)
                    )}{" "}
                    {currType}
                  </h4>
                </div>
                <div className="border-r border-[#070E1E2B] py-4 pl-5">
                  <p className="text-sm text-lightgray text-center">
                    PROPERTIES
                  </p>
                  <h4 className="mt-3">{assets?.length}</h4>
                </div>
              </div>
            </div>
          </div>
        ) : selectedTabIdx === 1 ? (
          <div className="bg-white shadows w-[80%] mx-auto rounded-[1.438rem]  mt-12 overflow-auto">
            <h4 className="text-black1 text-center py-4">PROPERTIES</h4>
            <div style={{ height: "329px", overflow: "auto" }} className="px-4">
              {!!assets.length &&
                assets.map((asset: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => {
                      console.log(asset, "asset");

                      modal.remove();
                      map?.flyTo({
                        center: [asset.location.lng, asset.location.lat],
                        zoom: 18,
                      });
                      setTimeout(() => {
                        handleViewasset(asset);
                      }, 1000);
                    }}
                    className="flex items-center gap-3 mt-6 cursor-pointer"
                  >
                    <ImageComponent
                      src={asset.image ?? "/assets/images/NFT.png"}
                      width={87}
                      height={87}
                      objectFit="cover"
                      className="rounded-xl"
                      figClassName="flex-shrink-0"
                    />
                    <div className="">
                      <h5 className=" font-TTTrailers-Bold text-black">
                        {asset.address}
                      </h5>
                      <h6 className="mt-1 text-lg text-secondary font-Montserrat-Medium">
                        {asset.address}
                      </h6>
                      <h6 className="text-lg text-secondary font-Montserrat-Medium">
                        Size: {asset.area} SQFT
                      </h6>
                    </div>

                    <div></div>
                  </div>
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
export default NiceModal.create(ProfileModal);
