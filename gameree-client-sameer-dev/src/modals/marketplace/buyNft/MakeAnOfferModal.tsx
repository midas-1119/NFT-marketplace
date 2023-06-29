import NiceModal, { useModal } from "@ebay/nice-modal-react";
import React, { useState } from "react";
import Button from "../../../components/button/Button";
import ImageComponent from "../../../components/imageComponent/ImageComponent";
import Input from "../../../components/input/Input";
import Modal from "../../../components/modal/Modal";
import { SUCCESS } from "../../../constants";
import { placeBid } from "../../../metamask/metamask";
import { handleShowModal } from "../../../utils/showModal";
import { marketplaceService } from "../../../services/marketplace.service";

import { useRouter } from "next/router";

import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../store/auth/selector";

const MakeAnOfferModal = ({
  src,
  name,
  listingId,
  nftId,
  bidder,
  highestBiddingPrice,
  refetch,
}: any) => {
  const modal = useModal();
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const user = useSelector(selectUser);

  const handleChange = (e: any) => {
    setPrice(e.target.value);
  };

  const makeAnOffer = async (price: number) => {
    try {
      setLoading(true);

      console.log("USER: ", user);

      let response: any = {};

      if (user.isMetamaskUser) {
        response = await placeBid(price, listingId);
      } else {
        response.success = true;
      }

      console.log("Response: ", response);

      const { success, ...rest } = response;

      if (success) {
        // rest.listingId = listingId;
        rest.bidder = bidder;
        rest.price = price;

        console.log("Rest: ", rest);

        const res = await marketplaceService.placeBid(nftId, rest);

        modal.remove();
        handleShowModal(SUCCESS, {
          type: "placeBid",
        });

        router.push("/bidTracking");
      }
      setLoading(false);

      // refetch && refetch();
    } catch (error) {
      setLoading(false);
      modal.remove();
    }
  };

  return (
    <Modal
      hide={() => modal.remove()}
      show={modal.visible}
      afterClose={() => modal.remove()}
    >
      <div className="sm:w-[38rem] md:w-[44.125rem] w-full">
        <div className="rounded-[3.5rem] bg-black1 py-4 px-8  relative mb-10">
          <i
            className="icon-back text-white absolute text-2xl top-[50%] -translate-y-1/2 left-8 cursor-pointer "
            onClick={() => {
              modal.remove();
            }}
          ></i>
          <h3 className="text-5xl text-center">SEND A BID</h3>
        </div>
        <div className="flex gap-3">
          <ImageComponent
            src={src ?? "/assets/images/modal/offer.png"}
            width={62}
            height={63}
            objectFit="cover"
            className="rounded-xl"
            figClassName="flex-shrink-0 table"
          />
          <div className="mb-8">
            <h5 className="text-3xl text-black font-TTTrailers-Bold mb-1">
              ASSET
            </h5>
            <p>{name}</p>
          </div>
        </div>

        <h5 className="text-3xl text-black font-TTTrailers-Bold mb-1">
          HIGHEST BIDDING PRICE
        </h5>
        <p>{highestBiddingPrice}</p>

        <span className="text-lg font-Montserrat-Bold mb-2">
          Select your bidding price
        </span>
        <div className="relative mb-12">
          <Input
            placeholder="0.00"
            className="bg-transparent !py-5  border-2 border-black1 !rounded-2xl font-TTTrailers-Bold !text-[2rem] placeholder:text-grays text-black"
            value={price}
            onChange={handleChange}
          />
          <Button className="top-0 right-0 !absolute rounded-none bg-black1 rounded-r-2xl text-3xl font-TTTrailers-Regular h-full">
            USDG
          </Button>
        </div>
        <div className="flex justify-center ">
          <Button
            className="text-gxl shadows w-[70%] pt-4 pb-2 flex gap-4 mb-6"
            onClick={() => makeAnOffer(price)}
            isLoading={loading}
            disabled={loading || price <= highestBiddingPrice}
          >
            <i className="icon-funds"></i>
            SEND BID
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NiceModal.create(MakeAnOfferModal);
