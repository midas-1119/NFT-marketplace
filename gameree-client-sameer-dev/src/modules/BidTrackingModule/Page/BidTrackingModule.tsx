import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Input from "../../../components/input/Input";
import Loader from "../../../components/loader/Loader";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
// import { Box } from "@mui/material";

import { marketplaceService } from "../../../services/marketplace.service";
import { selectUser } from "../../../store/auth/selector";

import { useRouter } from "next/router";

import { Box, Button as MUIButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { ButtonBase } from "@mui/material";

import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const BidTrackingModule = () => {
  const user = useSelector(selectUser);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const fetchBids = async () => {
    setLoading(true);
    try {
      const response = await marketplaceService.getSentBids({
        bidder: user._id,
      });

      console.log("Response: ", response);

      const rows = response.data.data.map((bid: any) => {
        const auctionStatus = bid.isActive === false ? "Expired" : "Ongoing";
        let winStatus;

        if (
          !bid.isActive &&
          bid.bidder === bid.listing.highestBiddingId.bidder
        ) {
          winStatus = "Won";
        } else if (
          !bid.isActive &&
          bid.bidder !== bid.listing.highestBiddingId.bidder
        ) {
          winStatus = "Lost";
        } else if (
          bid.isActive &&
          bid.bidder === bid.listing.highestBiddingId.bidder &&
          bid._id === bid.listing.highestBiddingId._id
        ) {
          winStatus = "Winning";
        } else if (
          bid.isActive &&
          bid.bidder === bid.listing.highestBiddingId.bidder &&
          bid._id !== bid.listing.highestBiddingId._id
        ) {
          winStatus = "Outbid";
        } else if (
          bid.isActive &&
          bid.bidder !== bid.listing.highestBiddingId.bidder
        ) {
          winStatus = "Outbid";
        }

        return {
          id: bid._id,
          address: bid.listing.nft.address,
          bid: bid,
          bidder: bid.bidder,
          biddingId: bid.biddingId,
          transactionHash: bid.transactionHash,
          nftId: bid.listing.nft._id,
          listingId: bid.listingId,
          listingPrice: bid.listing.price,
          price: bid.price,
          isActive: bid.isActive,
          auctionStatus: auctionStatus,
          winStatus: winStatus,
          isWin: bid.isWin,
          isClaimed: bid.isClaimed,
          createdAt: bid.createdAt,
          updatedAt: bid.updatedAt,
          deletedAt: bid.deletedAt,
        };
      });

      setBids(rows);
    } catch (err) {
      console.log("Error: ", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBids();
  }, []);

  const actionButtonHandler = (params: any) => {
    console.log("Params: ", params);
    const bid = params.row.bid;
    const isClaimed =
      !bid.isActive &&
      bid.bidder === bid.listing.highestBiddingId.bidder &&
      !bid.isClaimed
        ? false
        : true;

    return (
      <Box>
        <div>
          <Tooltip title="Claim Via Card">
            <ButtonBase
              component={MUIButton}
              onClick={(event: any) => {
                event.stopPropagation();
                if (!isClaimed) {
                  event.ignore = true;
                  console.log("Claim Via Card: ", params.row);
                  // createCheckout(params.row);
                }
              }}
              disabled={isClaimed}
            >
              <AttachMoneyIcon
                style={{ color: !isClaimed ? "white" : "grey" }}
              />
            </ButtonBase>
          </Tooltip>
          <Tooltip title="Claim Via Crypto">
            <ButtonBase
              component={MUIButton}
              onClick={(event: any) => {
                event.stopPropagation();
                if (!isClaimed) {
                  event.ignore = true;
                  console.log("Claim Via Crypto: ", params.row);
                  // completePurchaseOffer(params.row);
                }
              }}
              disabled={isClaimed}
            >
              <CurrencyBitcoinIcon
                style={{ color: !isClaimed ? "white" : "grey" }}
              />
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
      width: 280,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "bidder",
      headerName: "Bidder",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "listingPrice",
      headerName: "Listing Price",
      width: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "price",
      headerName: "Bid Price",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "auctionStatus",
      headerName: "Auction Status",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "isActive",
    //   headerName: "Active",
    //   width: 150,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "winStatus",
      headerName: "Win Status",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "isWin",
    //   headerName: "Winner",
    //   width: 150,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "actions",
      headerName: "Claim Actions",
      width: 170,
      align: "center",
      headerAlign: "center",
      renderCell: actionButtonHandler,
    },
    // {
    //   field: "isClaimed",
    //   headerName: "Claimed",
    //   width: 150,
    //   align: "center",
    //   headerAlign: "center",
    // },
  ];

  return (
    <div className="container">
      <div className="flex flex-wrap items-center justify-between gap-12 mt-12">
        <h1 className="font-TTTrailers-Regular">Bid Tracking</h1>
      </div>

      <div className="flex justify-between mb-[2.5rem]">
        {bids?.length > 0 && (
          <span className="pt3 mt-[4.5rem] w-60">
            <Input
              disabled
              placeholder={`${bids.length}`}
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
                rows={bids}
                onRowClick={(rowData) => {
                  console.log("Row Data: ", rowData);
                  router.push(`/marketplace/${rowData.row.nftId}`);
                }}
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

export default BidTrackingModule;
