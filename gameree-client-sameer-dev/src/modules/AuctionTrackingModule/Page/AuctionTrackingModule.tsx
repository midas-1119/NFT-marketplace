import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Input from "../../../components/input/Input";
import Loader from "../../../components/loader/Loader";
import { DataGrid, GridColumns } from "@mui/x-data-grid";

import { marketplaceService } from "../../../services/marketplace.service";
import { selectUser } from "../../../store/auth/selector";

import { useRouter } from "next/router";

const AuctionTrackingModule = () => {
  const user = useSelector(selectUser);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const fetchAuctions = async () => {
    setLoading(true);
    try {
      const response = await marketplaceService.getUserAuctions({
        ownerId: user._id,
      });

      console.log("Response: ", response);

      const rows = response.data.data.map((listing: any) => {
        const auctionStatus = listing?.endTime ? "Expired" : "Ongoing";
        const highestBiddingPrice = listing.highestBiddingId
          ? listing.highestBiddingId.price
          : "No Bid";

        return {
          id: listing._id,
          nftId: listing.nft._id,
          nftName: listing.nft.address,
          transactionHash: listing.transactionHash,
          listingId: listing.listingId,
          highestBiddingId: listing.highestBiddingId,
          highestBiddingPrice: highestBiddingPrice,
          sellMode: listing.sellMode,
          price: listing.price,
          startTime: listing.startTime,
          duration: listing.duration,
          soldTo: listing.soldTo,
          isActive: listing.isActive,
          endTime: listing.endTime,
          auctionStatus: auctionStatus,
          createdAt: listing.createdAt,
          updatedAt: listing.updatedAt,
          deletedAt: listing.deletedAt,
        };
      });

      setAuctions(rows);
    } catch (err) {
      console.log("Error: ", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const columns: GridColumns = [
    {
      field: "nftName",
      headerName: "Asset Name",
      width: 280,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "transactionHash",
    //   headerName: "Transaction Hash",
    //   width: 200,
    //   align: "center",
    //   headerAlign: "center",
    // },
    // {
    //   field: "listingId",
    //   headerName: "Listing ID",
    //   width: 200,
    //   align: "center",
    //   headerAlign: "center",
    // },
    // {
    //   field: "sellMode",
    //   headerName: "Sell Mode",
    //   width: 150,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "price",
      headerName: "Listing Price",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "highestBiddingPrice",
      headerName: "Highest Bidding Price",
      width: 180,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "startTime",
    //   headerName: "Start Time",
    //   width: 200,
    //   align: "center",
    //   headerAlign: "center",
    // },
    // {
    //   field: "duration",
    //   headerName: "Duration",
    //   width: 150,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "auctionStatus",
      headerName: "Auction Status",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "endTime",
    //   headerName: "End Time",
    //   width: 200,
    //   align: "center",
    //   headerAlign: "center",
    // },
  ];

  return (
    <div className="container">
      <div className="flex flex-wrap items-center justify-between gap-12 mt-12">
        <h1 className="font-TTTrailers-Regular">Auction Tracking</h1>
      </div>
      <div className="flex justify-between mb-[2.5rem]">
        {auctions?.length > 0 && (
          <span className="pt3 mt-[4.5rem] w-60">
            <Input
              disabled
              placeholder={`${auctions.length}`}
              className="w-full border border-[#384E69] text-center !py-4 bg-transparent !rounded-xl text-sm font-Montserrat-Medium placeholder-[#557C9A]"
            />
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
                  "& .MuiDataGrid-columnHeaders": {
                    fontFamily: "TTTrailers-Regular, sans-serif",
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    color: "white",
                    borderBottom: "1.5px solid white !important",
                    borderTop: "2px solid white !important",
                  },
                  "& .MuiIconButton-root": {
                    color: "white",
                  },
                  "& .MuiDataGrid-cell": {
                    fontSize: "1rem",
                    borderWidth: "0.5px !important",
                    borderStyle: "solid !important",
                    borderColor: "white !important",
                    color: "white",
                  },
                  "& .MuiDataGrid-row": {
                    borderBottomStyle: "solid !important",
                    borderBottomColor: "white !important",
                  },
                  "& .MuiDataGrid-footer": {
                    borderTop: "1.5px solid white !important",
                    borderBottom: "3px solid white !important",
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
                rows={auctions}
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

export default AuctionTrackingModule;
