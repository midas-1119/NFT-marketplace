import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../../components/button/Button";
import RecieveOfferCard from "../../../components/card/RecieveOfferCard";
import Input from "../../../components/input/Input";
import Loader from "../../../components/loader/Loader";
import Search from "../../../components/search/Search";
import { USDG } from "../../../constants/price.constant";
// import { IBuilding } from "../../../interfaces/marketplace.interface";
import { ISendRecieveOffers } from "../../../interfaces/sendRecieveOffers.interface";
import { getBNBRate, getEthRate, approve } from "../../../metamask/metamask";
import { selectUser } from "../../../store/auth/selector";
import { getMarketplaceBuildingsAction } from "../../../store/marketplace/async.func";
import {
  selectLoading,
  selectRefetch,
} from "../../../store/marketplace/selector";
import MArketPlaceFilters from "../Components/MArketPlaceFilters";

import { sendRecieveOffersService } from "../../../services/sendRecieveOffers.service";

import { DataGrid, GridColumns } from "@mui/x-data-grid";

import { Box, Button as MUIButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { ButtonBase } from "@mui/material";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

import { SUCCESS } from "../../../constants";
import { useModal } from "@ebay/nice-modal-react";
import { handleModalHide, handleShowModal } from "../../../utils/showModal";

const platformOwnerAddress = "0xCeBF6573C0B1B239fF233C5debF502842FFC4cFe";

const RecieveOffersModule = () => {
  // const modal = useModal();

  const [show, setShow] = useState(false);

  const [areaApply, setAreaApply] = useState(false);
  const [priceIn, setPriceIn] = useState(USDG);
  const [priceApply, setPriceApply] = useState(false);
  const [loadMore, setLoadMore] = useState(true);
  const [viewAll, setViewAll] = useState<boolean>(false);
  const [next, setNext] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currType, setCurrencyType] = useState<string>("USDG");
  const [range, setRange] = useState({
    min: 0,
    max: 0,
  });
  const [area, setArea] = useState({
    min: 0,
    max: 0,
  });
  const user = useSelector(selectUser);
  const shouldRefetch = useSelector(selectRefetch);
  // const price = useSelector(selectPriceRange);
  const dispatch = useDispatch();
  const [offers, setOffers] = useState<ISendRecieveOffers[]>([]);
  const [bnbRate, setBnbRate] = useState(1);
  const [ethRate, setEthRate] = useState(1);
  const [state, setState] = useState({
    current_page: 1,
    pages: 1,
    total_buildings: 0,
    per_page: 1,
  });

  // const loading = useSelector(selectLoading);
  const [loading, setLoading] = useState(false);

  const acceptOffer = async (offer: any) => {
    console.log("Inside Accept Offer: ", offer);
    try {
      setLoading(true);

      let body: any = { nftId: offer.nftId, listingId: offer.listingId };

      const res = await sendRecieveOffersService.acceptOffer(offer.id, body);

      handleShowModal(SUCCESS, {
        type: "acceptOffer",
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const rejectOffer = async (offer: any) => {
    console.log("Inside Reject Offer");
    try {
      setLoading(true);

      let body: any = {};

      const res = await sendRecieveOffersService.rejectOffer(offer.id, body);

      // modal.remove();
      // removeItemFromCurrentList();
      handleShowModal(SUCCESS, {
        type: "rejectOffer",
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchBuildings = async () => {
    setLoading(true);
    try {
      let query: any = {};

      console.log("LOG: ", user);

      query.user = user._id;

      const response = await sendRecieveOffersService.getOffers(query);

      console.log("Response: ", response.data.data.offers);

      const rows = response.data.data.offers.map((offer: any) => {
        return {
          id: offer._id,
          nftId: offer.nft._id,
          from: offer.from.fullName,
          price: offer.price,
          src: offer.nft.image,
          to: offer.to,
          address: offer.nft.address,
          offerId: offer.offerId,
          tokenId: offer.nft.tokenId,
          listingId: offer.nft.listingId,
          listingPrice: offer.nft.price,
          status: offer.status,
        };
      });

      setOffers(rows);
    } catch (err: any) {
      console.log(err.request.statusCode);
    }
    setLoading(false);
  };

  const actionButtonHandler = (params: any) => {
    console.log("Params: ", params);
    const isPending = params.row.status === "pending";

    return (
      <Box>
        <div>
          <Tooltip title="Accept Offer">
            <ButtonBase
              component={MUIButton}
              onClick={(event: any) => {
                if (isPending) {
                  event.ignore = true;
                  console.log("Accept: ", params.row);
                  acceptOffer(params.row);
                }
              }}
              disabled={!isPending}
            >
              <DoneIcon style={{ color: isPending ? "white" : "grey" }} />
            </ButtonBase>
          </Tooltip>
          <Tooltip title="Reject Offer">
            <ButtonBase
              component={MUIButton}
              onClick={(event: any) => {
                if (isPending) {
                  event.ignore = true;
                  console.log("Reject: ", params.row);
                  rejectOffer(params.row);
                }
              }}
              disabled={!isPending}
            >
              <CloseIcon style={{ color: isPending ? "white" : "grey" }} />
            </ButtonBase>
          </Tooltip>
        </div>
      </Box>
    );
  };

  const columns: GridColumns = [
    {
      field: "address",
      headerName: "Asset Name",
      width: 330,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "from",
      headerName: "From",
      width: 330,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "listingPrice",
      headerName: "Listing Price",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "price",
      headerName: "Offered Price",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 170,
      align: "center",
      headerAlign: "center",
      renderCell: actionButtonHandler,
    },
  ];

  useEffect(() => {
    fetchBuildings();
  }, []);

  useEffect(() => {
    const inputOnChange = setTimeout(() => {
      fetchBuildings();
    }, 1500);

    return () => clearTimeout(inputOnChange);
  }, [searchTerm]);

  const removeItemFromCurrentList = async (index: number) => {
    const newArr = [...offers];
    newArr.splice(index, 1);
    setOffers(newArr);
  };
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
      setEthRate(response);
    }
  };

  console.log(bnbRate, "bnbRate");

  return (
    <div className="container">
      <div className="flex flex-wrap items-center justify-between gap-12 mt-12 ">
        {show ? (
          <div className="flex items-center gap-4">
            <i
              className="text-2xl cursor-pointer icon-filter text-primary"
              onClick={() => setShow(!show)}
            ></i>
            <h1 className="font-TTTrailers-Regular">Recieved Offers</h1>
          </div>
        ) : (
          <h1 className="font-TTTrailers-Regular">Recieved Offers</h1>
        )}
      </div>
      <div className="flex justify-between mb-[2.5rem]">
        {offers?.length > 0 && (
          <span className="pt3 mt-[4.5rem] w-60">
            <Input
              disabled
              placeholder={`${offers.length}`}
              className="w-full border border-[#384E69] text-center !py-4 bg-transparent !rounded-xl text-sm font-Montserrat-Medium placeholder-[#557C9A]"
            />
            {}
          </span>
        )}
      </div>
      {!loading ? (
        <>
          <div>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                sx={{
                  color: "white",
                  border: `2px solid white`,
                  // "& .MuiDataGrid-overlay": {
                  //   backgroundColor: "white",
                  // },
                  "& .MuiDataGrid-columnHeaders": {
                    fontFamily: "TTTrailers-Regular, sans-serif",
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    color: "white",
                    borderBottom: "1.5px solid white !important",
                    borderTop: "2px solid white !important", // Add the thick border to the top
                  },
                  "& .MuiIconButton-root": {
                    color: "white",
                  },
                  "& .MuiDataGrid-cell": {
                    // borderBottom: "1.5px solid white !important",
                    fontSize: "1rem", // Increase the font size
                    // fontWeight: "bold", // Make the font bold
                    borderWidth: "0.5px !important",
                    borderStyle: "solid !important",
                    borderColor: "white !important",
                    color: "white",
                  },
                  "& .MuiDataGrid-row": {
                    // borderBottomWidth: "1.5px !important",
                    borderBottomStyle: "solid !important",
                    borderBottomColor: "white !important",
                  },
                  "& .MuiDataGrid-footer": {
                    borderTop: "1.5px solid white !important",
                    borderBottom: "3px solid white !important", // Add the thick border to the bottom
                    color: "white",
                  },
                  "& .MuiDataGrid-rowCount": {
                    color: "white",
                  },
                  "& .MuiSelect-icon": {
                    color: "white",
                  },
                  "& .MuiMenuItem-root": {
                    color: "white",
                  },
                }}
                rows={offers}
                columns={columns}
                rowsPerPageOptions={[5, 10, 25]}
                pageSize={5}
                pagination
              />
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-[40vh] flex items-center justify-center">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default RecieveOffersModule;
