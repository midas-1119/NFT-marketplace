import Link from "next/link";
import React, { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { NFT_TYPES } from "../../../constants/nftType.enum";
import { listNFT } from "../../../metamask/metamask";
import { sendOFFER } from "../../../metamask/metamask";
import { toast } from "react-toastify";
import ImageComponent from "../../../components/imageComponent/ImageComponent";
import Input from "../../../components/input/Input";
import InputError from "../../../components/input/InputError";
import Button from "../../../components/button/Button";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { handleShowModal } from "../../../utils/showModal";
import { SUCCESS } from "../../../constants";
import Modal from "../../../components/modal/Modal";
import { marketplaceService } from "../../../services/marketplace.service";
import { sendRecieveOffersService } from "../../../services/sendRecieveOffers.service";

const SendRecieveOfferNftModal = ({
  id,
  src,
  tokenId,
  listingId,
  buyer,
  seller,
  name,
  removeItemFromCurrentList,
}: any) => {
  const modal = useModal();
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePriceChange = (e: any) => {
    setPrice(e.target.value);
  };

  const sendOffer = async () => {
    console.log("Inside Send Offer");
    try {
      setLoading(true);

      let body = {
        from: buyer,
        to: seller,
        price,
        nft: id,
        listingId,
      };

      console.log("LOG: ", body);

      const res = await sendRecieveOffersService.sendOffer(body);

      modal.remove();
      removeItemFromCurrentList();
      handleShowModal(SUCCESS, {
        type: "sendOffer",
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const isError = () => {
    if (!price) return false;
    return price <= 0;
  };

  return (
    <Modal
      hide={() => modal.remove()}
      show={modal.visible}
      afterClose={() => modal.remove()}
    >
      <div className="sm:w-[44.125rem] w-full">
        <div className="rounded-[3.5rem] bg-black1 py-4 px-8  relative mb-8">
          <i
            className="icon-back text-white absolute text-2xl top-[50%] -translate-y-1/2 left-8 cursor-pointer "
            onClick={() => modal.remove()}
          ></i>
          <h3 className=" text-4xl sm:text-5xl text-center">Send Offer</h3>
        </div>

        <form>
          <div className=" ">
            <div className=" xs:block flex justify-between items-center mt-10">
              <div className="flex gap-4 items-center">
                <ImageComponent
                  figClassName="cursor-pointer leading-0 rounded-md overflow-hidden flex-shrink-0"
                  src={src ?? "/assets/images/NFT.png"}
                  width={72}
                  height={72}
                  objectFit="cover"
                  className="rounded-md"
                />
                <div>
                  <h4 className="text-black w-[11.063rem] leading-tight text-xl lg:text-[2rem] font-TTTrailers-Bold">
                    {name}
                  </h4>
                </div>
              </div>
            </div>
            <div className="mt-14 mb-5">
              <h4 className="text-black text-xl font-Montserrat-Bold ">
                List your price
              </h4>
              <div className="relative  flex ">
                <div className="relative w-full mt-4">
                  <Input
                    autoFocus
                    className="lg:placeholder:!text-[2rem] !text-2xl text-black placeholder:text-black !py-5 border-2 border-[#070E1E] rounded-r-none"
                    placeholder="0.00"
                    onChange={handlePriceChange}
                    value={price}
                    disabled={loading}
                    type="number"
                    error={isError() ? "Price should be greater than 0" : null}
                  />
                  <span className="absolute px-10 right-0 roliteis-radius flex items-center font-TTTrailers-Bold bg-black h-full top-1/2 -translate-y-1/2 text-white text-3xl">
                    BNB
                  </span>
                </div>
              </div>
            </div>

            <div className=" px-[7.875rem] xs:px-0">
              <Button
                className={`w-full rounded-[3.438rem] flex items-center mt-12 gap-6 `}
                type="submit"
                onClick={sendOffer}
                disabled={isError() || !price}
                isLoading={loading}
              >
                <i className="text-white icon-funds"></i>
                SEND OFFER
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};
export default NiceModal.create(SendRecieveOfferNftModal);
