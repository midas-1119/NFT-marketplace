import NiceModal, { useModal } from "@ebay/nice-modal-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Button from "../../../components/button/Button";
import Modal from "../../../components/modal/Modal";
import {
  BUY_NFT,
  BUY_NFT_SUCCESS,
  STREET_VIEW,
  SUCCESS,
} from "../../../constants";
import { approve, buyNFT, getBNBRate } from "../../../metamask/metamask";
import { handleModalHide, handleShowModal } from "../../../utils/showModal";
import { acceptOFFER } from "../../../metamask/metamask";
import { sendRecieveOffersService } from "../../../services/sendRecieveOffers.service";
import { marketplaceService } from "../../../services/marketplace.service";

const platformOwnerAddress = "0xCeBF6573C0B1B239fF233C5debF502842FFC4cFe";

const ViewOfferNftModal = ({
  id,
  nftId,
  from,
  price,
  refetch,
  offerId,
  listingId,
  listingPrice,
  tokenId,
  to,
  status,
  src,
  address,
}: any) => {
  const [loading, setLoading] = useState(false);
  const modal = useModal();
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

  const toAddress = to
    ? to.substring(0, 8) + "..." + to.substring(to.length - 5)
    : "";
  const fromAddress = from
    ? from.substring(0, 8) + "..." + from.substring(from.length - 5)
    : "";

  const fee = parseFloat((0.03 * Number(price)).toFixed(4));

  const priceInDollars = parseFloat((rate * price).toFixed(2));
  const feeInDollars = parseFloat((0.03 * Number(priceInDollars)).toFixed(2));

  const acceptOffer = async () => {
    console.log("Inside Accept Offer");
    try {
      setLoading(true);

      let body: any = { nftId, listingId };

      const res = await sendRecieveOffersService.acceptOffer(id, body);

      let payload: any = {};

      payload = {
        tokenId: tokenId,
        sellerAddress: platformOwnerAddress,
      };

      console.log("Payload: ", payload);

      const response = await approve(payload);

      console.log("Response: ", response);

      const { success, ...rest } = response;

      if (success) {
        console.log("Rest: ", rest);

        modal.remove();
        // removeItemFromCurrentList();
        handleShowModal(SUCCESS, {
          type: "acceptOffer",
        });
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const rejectOffer = async () => {
    console.log("Inside Reject Offer");
    try {
      setLoading(true);

      let body: any = {};

      const res = await sendRecieveOffersService.rejectOffer(id, body);

      modal.remove();
      // removeItemFromCurrentList();
      handleShowModal(SUCCESS, {
        type: "rejectOffer",
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Modal
      hide={() => modal.remove()}
      show={modal.visible}
      afterClose={() => modal.remove()}
    >
      <div className="sm:w-[44.125rem] w-full  ">
        <div className="rounded-[3.5rem] bg-black1 py-4  relative mb-10">
          <h3 className="text-5xl text-center">OFFER DETAILS</h3>
        </div>
        <div className="px-11">
          <p className="text-[1.375rem]  text-[#9FA0A2] mb-10 leading-tight">
            You got an offer for{" "}
            <span className="text-black font-Montserrat-Bold">{address}</span>{" "}
            from{" "}
            <span className="text-black font-Montserrat-Bold">
              {fromAddress}
            </span>
          </p>

          <div>
            <div className="flex sm:flex-row flex-col justify-between mb-6">
              <p className="text-[1.375rem] sm:mb-0 mb-5">From</p>
              <p className="text-[1.375rem] text-black font-Montserrat-Bold">
                {fromAddress}
              </p>
            </div>
            <div className="flex sm:flex-row flex-col justify-between mb-6">
              <p className="text-[1.375rem] sm:mb-0 mb-5">Offered Price</p>
              <p className="text-[1.375rem] text-black font-Montserrat-Bold">
                {`$${priceInDollars} (${price} BNB)`}
              </p>
            </div>
            <div className="flex sm:flex-row flex-col justify-between mb-6">
              <p className="text-[1.375rem] sm:mb-0 mb-5">Listing Price</p>
              <p className="text-[1.375rem] text-black font-Montserrat-Bold">
                {`$${feeInDollars} (${listingPrice} BNB)`}
              </p>
            </div>
          </div>
          {status === "pending" ? (
            <div className="grid grid-cols-2 gap-8">
              <Button
                className={`w-full rounded-[3.438rem] flex items-center mt-12 gap-6 `}
                type="submit"
                onClick={acceptOffer}
                disabled={loading}
                isLoading={loading}
              >
                <i className="text-white icon-funds"></i>
                ACCEPT OFFER
              </Button>
              <Button
                className={`w-full rounded-[3.438rem] flex items-center mt-12 gap-6 `}
                type="submit"
                onClick={rejectOffer}
                disabled={loading}
                isLoading={loading}
              >
                <i className="text-white icon-funds"></i>
                REJECT OFFER
              </Button>
            </div>
          ) : status === "rejected" ? (
            <div className=" px-[7.875rem] xs:px-0">
              {/* <Link href="#"> */}
              <a>
                <Button
                  className={`w-full rounded-[3.438rem] flex items-center mt-12 gap-6 `}
                  // type="submit"
                  // onClick={acceptOffer}
                  disabled={true}
                  // isLoading={loading}
                >
                  <i className="text-white icon-funds"></i>
                  OFFER REJECTED
                </Button>
              </a>
              {/* </Link> */}
            </div>
          ) : (
            <div className=" px-[7.875rem] xs:px-0">
              {/* <Link href="#"> */}
              <a>
                <Button
                  className={`w-full rounded-[3.438rem] flex items-center mt-12 gap-6 `}
                  // type="submit"
                  // onClick={acceptOffer}
                  disabled={true}
                  // isLoading={loading}
                >
                  <i className="text-white icon-funds"></i>
                  WAITING FOR BUYER TO BUY NFT
                </Button>
              </a>
              {/* </Link> */}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
export default NiceModal.create(ViewOfferNftModal);
