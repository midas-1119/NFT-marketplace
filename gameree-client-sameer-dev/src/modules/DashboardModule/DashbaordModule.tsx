import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ImageComponent from "../../components/imageComponent/ImageComponent";
import { IBuilding } from "../../interfaces/marketplace.interface";
import {
  getBNBRate,
  getEthRate,
  isMetaMaskConnected,
} from "../../metamask/metamask";
import { marketplaceService } from "../../services/marketplace.service";
import { userService } from "../../services/user.service";
import { selectUser } from "../../store/auth/selector";
import { getUserBuildings } from "../../store/marketplace/async.func";
import { selectLoading } from "../../store/marketplace/selector";
import DashboardTabComponent from "./component/DashboardTabComponent";
import Head from "next/head";

export const tabs = [
  // { name: "MINTED", type: "minted" },
  // { name: "OWNED", type: "owned" },
  { name: "ASSETS", type: "minted" },
  { name: "SOLD", type: "sold" },
  { name: "LISTED", type: "listed" },
  { name: "FAVOURITES ", type: "favourites" },
];

const DashbaordModule = () => {
  const [selectedTabIdx, setSelectedTabIdx] = useState(0);
  const user = useSelector(selectUser);
  const [account, setAccount] = useState({
    balance: 0,
    connected: false,
    account: "0x0000000000000000000",
  });
  const [buildingsArr, setBuildings] = useState<IBuilding[]>([]);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [userNfts, setUserNfts] = useState<any[]>([]);
  const [newlyMinted, setNewlyMinted] = useState<IBuilding[]>([]);

  const [rate, setRate] = useState(0);
  const [rateETH, setETHRate] = useState(0);
  const [currType, setCurrencyType] = useState<string>("USDG");

  useEffect(() => {
    const storedValue = localStorage.getItem("currType");
    if (storedValue !== null) {
      setCurrencyType(storedValue);
    }
  }, []); // empty dependency array, so this effect only runs once on mount
  const [tabState, setTabState] = useState({
    current_page: 1,
    pages: 1,
    total_buildings: 0,
    per_page: 1,
  });
  const [stats, setStats] = useState({
    ownedPlots: 0,
    tokens: 0,
    totalValue: {
      _id: null,
      count: 0,
      total: 0,
    },
  });
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();

  const fetchBuildings = async (page: number = 1, type: string = "minted") => {
    try {
      const response = await dispatch(
        getUserBuildings({
          page: page,
          type: type,
        })
      );
      if (response.meta && response.meta.requestStatus === "fulfilled") {
        const { buildings, ...rest } = response.payload;
        if (rest.current_page > 1)
          setBuildings([...buildingsArr, ...buildings]);
        else setBuildings(buildings);
        setTabState(rest);
      }
    } catch (err: any) {
      console.log(err.request.statusCode);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await marketplaceService.getUserStatistics();

      if (response?.data?.data) {
        setStats(response.data.data);
      }
    } catch (err: any) {
      console.log(err);
    }
  };
  const getTradedBalance = async () => {
    try {
      const { data } = await userService.nftsvalue();
      setTotalBalance(data.data.price);
      const { data: nfts } = await userService.userDashboard();
      setUserNfts(nfts?.data || []);
    } catch (error) {}
  };
  useEffect(() => {
    if (user) {
      getTradedBalance();
    }
  }, [user]);

  const fetchNewlyMinted = async () => {
    try {
      const response = await marketplaceService.getNewlyMinted();
      if (response?.data?.data) {
        setNewlyMinted(response.data.data);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleLoadMore = () => {
    fetchBuildings(tabState.current_page + 1, tabs[selectedTabIdx].type);
  };

  const getWalletDetails = async () => {
    const response = await isMetaMaskConnected();
    if (response.connected) {
      setAccount(response);
    }
  };
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

  useEffect(() => {
    if (user && user.metamaskId) {
      getWalletDetails();
      fetchUserStats();
      fetchNewlyMinted();
    }
  }, [user]);
  useEffect(() => {
    if (user) {
      fetchBuildings();
    }
  }, [user]);

  const getFavoriteNFTs = async () => {
    try {
      const res = localStorage.getItem("favoriteNFTs") || "[]";
      const favoriteNFTs = JSON.parse(res);
      setBuildings(
        favoriteNFTs.map((item: any) => ({ ...item, _isAssets: true }))
      );
    } catch (error) {}
  };

  const handleTabChange = (index: number) => {
    setSelectedTabIdx(index);
    if (tabs[index].type === "favourites") {
      getFavoriteNFTs();
    } else {
      fetchBuildings(1, tabs[index].type);
    }
  };

  const removeItemFromCurrentList = async (index: number) => {
    const newArr = [...buildingsArr];
    newArr.splice(index, 1);
    setBuildings(newArr);
  };

  const DataGradient = [
    {
      name: "TOTAL TRADED VALUE",
      value: `${parseFloat(
        (totalBalance
          ? Number(totalBalance) /
            (currType === "BNB" ? rate : currType === "ETH" ? rateETH : 1)
          : 0
        ).toFixed(3)
      )} ${currType}`,
      // value: (+totalBalance).toFixed(2) + "BNB",
    },
    {
      name: "FLOOR PRICE",
      value: "$ 1900",
    },
    {
      name: "TOTAL OWNED PLOTS",
      value: userNfts?.length,
    },
    // {
    //   name: "TOTAL COLLECTION",
    //   value: stats.tokens,
    // },
  ];

  const isSocialConnected = localStorage.getItem("Social");
  return (
    <>
      <Head>
        <title>Dashboard - Gameree</title>
      </Head>
      <div className="container mt-12">
        <h2 className="font-TTTrailers-Regular text-7xl md:text-[5.9rem]">
          Dashboard
        </h2>
        <div className="grid grid-cols-2 mt-12 lg:grid-cols-3 md:grid-cols-3 xs1:grid-cols-1 gap-7 ">
          {DataGradient.map((item, i) => (
            <div className="AtGradient1 rounded-[1.25rem]" key={i}>
              <div className="AtBoxInner rounded-[1.25rem] h-full ">
                <div className="py-5 px-7">
                  <h6 className="text-[1.375rem]  font-Montserrat-Medium text-[#8B98A7]">
                    {item.name}
                  </h6>
                  <h3 className="mt-5">{item.value}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 lg:flex-row flex-col flex gap-8">
          <div className="border-2 border-primary lg:w-[55rem] p-10 bg-black1 rounded-2xl">
            <div className="flex items-center justify-between xs:block">
              <div className="flex items-center gap-8 ">
                <ImageComponent
                  src="/assets/images/wallet.png"
                  width={76}
                  height={66}
                  objectFit="cover"
                  figClassName="flex-shrink-0"
                />

                <h5 className="font-Montserrat-Bold">MY BALANCE</h5>
              </div>
              {isSocialConnected === "google" ? null : (
                <>
                  <div className="xs:mt-4 xs:text-center">
                    {!user.username && (
                      <h6 className="font-Montserrat-Medium text-[#B3B8CD]">
                        {account.account.substring(0, 8)}...
                        {account.account.substring(
                          account.account.length - 5
                        )}{" "}
                        <i
                          className="ml-1 text-base cursor-pointer icon-copy text-primary"
                          onClick={() => {
                            navigator.clipboard.writeText(account.account);
                            toast.success("copied");
                          }}
                        ></i>
                      </h6>
                    )}
                  </div>
                </>
              )}
            </div>
            <h2 className="md:text-[5.625rem] mt-8">
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
              <span className="md:text-[3rem] text-4xl">
                (${account.connected ? account.balance : Number(totalBalance)})
              </span>
            </h2>
            {/* <Button
              className="mt-10 gap-5 !px-11 !pt-5 !py-4 "
            >
              <i className="mr-3 text-4xl text-white icon-funds"></i> ADD FUNDS
            </Button>
            <Button
              className="mt-10 gap-5 !px-11 !pt-5 !py-4 ml-[1.313rem] bg-transparent border-purples"
            >
              <Image src="/assets/images/withdraw.svg" height={39} width={39} />{" "}
              WITHDRAW
            </Button> */}
          </div>
          <div className="border-2 border-primary rounded-2xl lg:w-[38.75rem] lg:mt-0 mt-1 p-10 min-h-[24.125rem] bg-black1  max-h-64 overflow-auto">
            <h5 className="font-Montserrat-Bold ">MY NEWLY MINTED</h5>
            {userNfts.slice(0, 4).map((nft) => (
              <div className="flex items-center gap-3 mt-6">
                <ImageComponent
                  src={nft.image ?? "/assets/images/NFT.png"}
                  width={87}
                  height={87}
                  objectFit="cover"
                  className="rounded-xl"
                  figClassName="flex-shrink-0"
                />
                <div className="">
                  <h5 className=" font-TTTrailers-Bold">{nft.address}</h5>
                  <h6 className="mt-1 text-lg text-secondary font-Montserrat-Medium">
                    {nft.address}
                  </h6>
                  <h6 className="text-lg text-secondary font-Montserrat-Medium">
                    Size: {nft.area} SQFT
                  </h6>
                </div>

                <div></div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <DashboardTabComponent
            buildings={buildingsArr}
            selectedTabIdx={selectedTabIdx}
            setSelectedTabIdx={handleTabChange}
            handleLoadMore={handleLoadMore}
            hasMore={tabState.current_page < tabState.pages}
            loading={loading}
            removeItemFromCurrentList={removeItemFromCurrentList}
            currType={currType}
            rate={currType === "BNB" ? rate : currType === "ETH" ? rateETH : 1}
          />
        </div>
      </div>
    </>
  );
};

export default DashbaordModule;
