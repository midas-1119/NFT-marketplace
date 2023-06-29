import NiceModal, { useModal } from "@ebay/nice-modal-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Button from "../../../components/button/Button";
import Modal from "../../../components/modal/Modal";
import { BUY_NFT, BUY_NFT_SUCCESS, STREET_VIEW } from "../../../constants";
import { buyNFT, getBNBRate } from "../../../metamask/metamask";
import { handleModalHide, handleShowModal } from "../../../utils/showModal";
import { marketplaceService } from "../../../services/marketplace.service";
import { paymentService } from "../../../services/payment.service";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import { selectUser } from "../../../store/auth/selector";
import { useDispatch, useSelector } from "react-redux";
const stripePromise = loadStripe(
  "pk_test_51IgkmYHK2XLArNZBO6AwYH5atBnqtzRZfIYI7jz0qXJddhrBCI3qyB2C1SGrBq8FVX66IB7piKXZVzk3K7hWw31Z00yAONUvSq"
);
const platformOwnerAddress = "0xCeBF6573C0B1B239fF233C5debF502842FFC4cFe";

const BuyNFTModal = ({
  id: id,
  ownerAddress,
  from,
  price,
  refetch,
  listingId,
  tokenId,
  to,
  src,
  address,
  lat,
  lng,
}: any) => {
  const user = useSelector(selectUser);
  const router = useRouter();
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

  const showStreetView = () => {
    // handleModalHide(BUY_NFT) ;
    handleShowModal(STREET_VIEW, {
      address: address,
      lat: lat,
      lng: lng,
    });
  };
  const toAddress = to
    ? to.substring(0, 8) + "..." + to.substring(to.length - 5)
    : "";
  const fromAddress = from
    ? from.substring(0, 8) + "..." + from.substring(from.length - 5)
    : "";

  const fee = parseFloat((0.03 * Number(price)).toFixed(4));

  const priceInDollars = parseFloat((rate * price).toFixed(2));
  const feeInDollars = parseFloat((0.03 * Number(priceInDollars)).toFixed(2));

  const buyNow = async () => {
    try {
      setLoading(true);

      let response: any = {};

      console.log("Owner Address: ", ownerAddress);
      // console.log("Platform Owner Address: ", platformOwnerAddress);

      response = await buyNFT(price, listingId);

      console.log("Response: ", response);

      const { success, ...rest } = response;

      if (success) {
        console.log("Rest: ", rest);

        rest.tokenId = tokenId;

        const res = await marketplaceService.buyNft(id, rest);

        modal.remove();
        handleShowModal(BUY_NFT_SUCCESS, {
          src: src,
          address: address,
          from: from,
          hash: response.hash,
        });
      } else {
        modal.remove();
      }

      // if (ownerAddress !== platformOwnerAddress) {
      //   //contract -> crypto
      //   //Owner is User
      //   response = await buyNFT(price, listingId);

      //   console.log("Response: ", response);

      //   const { success, ...rest } = response;

      //   if (success) {
      //     console.log("Rest: ", rest);

      //     rest.tokenId = tokenId;

      //     const res = await marketplaceService.buyNft(id, rest);

      //     modal.remove();
      //     handleShowModal(BUY_NFT_SUCCESS, {
      //       src: src,
      //       address: address,
      //       from: from,
      //       hash: response.hash,
      //     });
      //   } else {
      //     modal.remove();
      //   }
      // } else {
      //   //Owner is Admin

      //   const data = { ownerAddress: to, tokenId: tokenId };

      //   const res = await marketplaceService.buyNftInternal(id, data);

      //   modal.remove();
      //   handleShowModal(BUY_NFT_SUCCESS, {
      //     src: src,
      //     address: address,
      //     from: from,
      //     hash: response.hash,
      //   });
      // }

      setLoading(false);
      refetch && refetch();
      router.push("/dashboard");
    } catch (error) {
      setLoading(false);
      modal.remove();
    }
  };

  const createCheckout = async () => {
    try {
      const stripe: any = await stripePromise;
      const response = await paymentService.createCheckoutSession({
        nftId: id,
        action: "buy",
        actionData: { listingId: listingId, ownerAddress: user.metamaskId },
      });

      if (response.data.id.url) {
        window.location.replace(response.data.id.url);
      }
    } catch (error) {
      console.log(error, "ERROR");
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
          <h3 className="text-5xl text-center">CHECKOUT</h3>
        </div>
        <div className="px-11">
          <p className="text-[1.375rem]  text-[#9FA0A2] mb-10 leading-tight">
            You are about to purchase a{" "}
            <span className="text-black font-Montserrat-Bold">{address}</span>{" "}
            from{" "}
            <span className="text-black font-Montserrat-Bold">
              {fromAddress}
            </span>
          </p>

          <div className="border border-[#E4E4E4] py-[1.375rem] px-6 rounded-[1.313rem] flex sm:flex-row flex-col justify-between items-center pt-3 pb-2 mb-12">
            <div className="flex justify-center items-center gap-4">
              <div
                className="bg-[#F3BA2F] w-[4rem] h-[4rem] flex justify-center items-center shrink-0 rounded-full"
                style={{ width: "4rem", height: "4rem", background: "#F3BA2F" }}
              >
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 44 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M30.2994 25.4028L35.1264 30.216L22.0046 43.3239L8.89667 30.216L13.7237 25.4028L22.0046 33.6837L30.2994 25.4028ZM22.0046 17.1081L26.901 22.0045L22.0046 26.9009L17.1221 22.0183V22.0045L17.9821 21.1445L18.3982 20.7284L22.0046 17.1081ZM5.49831 17.1774L10.3254 22.0045L5.49831 26.8177L0.671265 21.9906L5.49831 17.1774ZM38.5109 17.1774L43.3379 22.0045L38.5109 26.8177L33.6838 21.9906L38.5109 17.1774ZM22.0046 0.671143L35.1125 13.7791L30.2855 18.6061L22.0046 10.3114L13.7237 18.5923L8.89667 13.7791L22.0046 0.671143Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div className="">
                <h4 className="text-black text-2xl font-Montserrat-Bold mb-1">
                  {toAddress}
                </h4>
                <p className="text-base sm:mb-0 mb-6">Binance smart chain</p>
              </div>
            </div>
            {/* <Button className="py-2 px-6 !text-base text-[#27AE60] bg-[#EEF7EC] rounded-lg font-Montserrat-Medium max-w-[8.438rem]"> */}
            <Button className="!py-2 !bg-red-500 !text-base w-full sm:w-auto">
              {" "}
              Connected
            </Button>
          </div>

          <div>
            <div className="flex sm:flex-row flex-col justify-between mb-6">
              <p className="text-[1.375rem] sm:mb-0 mb-5">Price</p>
              <p className="text-[1.375rem] text-black font-Montserrat-Bold">
                {`$${priceInDollars} (${price} BNB)`}
              </p>
            </div>
            <div className="flex sm:flex-row flex-col justify-between mb-6">
              <p className="text-[1.375rem] sm:mb-0 mb-5">Service fee 3%</p>
              <p className="text-[1.375rem] text-black font-Montserrat-Bold">
                {`$${feeInDollars} (${fee} BNB)`}
              </p>
            </div>
            <div className="flex sm:flex-row flex-col justify-between mb-6">
              <p className="text-[1.375rem] sm:mb-0 mb-5">You will Pay</p>
              <p className="text-[1.375rem] text-black font-Montserrat-Bold">
                {`$${(feeInDollars + priceInDollars).toFixed(2)} (${(
                  price + fee
                ).toFixed(2)} BNB)`}
              </p>
            </div>
          </div>
          {/* <div className="flex justify-center mt-5">
            <Link href="/marketplace">
              <Button
                onClick={buyNow}
                className="text-gxl shadows w-[70%] "
                isLoading={loading}
              >
                <i className="icon-funds mr-5"></i>
                BUY NOW
              </Button>
            </Link>
            <Button
              className="shadows bg-white text-4xl md:text-[2.8rem] !text-black1 w-[70%] hover:!text-white"
              onClick={showStreetView}
              disabled={loading}
            >
              <i className="icon-street text-4xl mr-5"></i>
              STREET VIEW
            </Button>
          </div> */}
          <div className="grid grid-cols-2 gap-8">
            <Button onClick={createCheckout}>Buy With Card</Button>
            <Button onClick={buyNow} disabled={true}>
              Buy With Crypto
            </Button>
          </div>
          <div className="flex w-full justify-center">
            {" "}
            <Button
              className="shadows bg-white text-4xl md:text-[2.8rem] !text-black1 hover:!text-white mt-5 w-full"
              onClick={showStreetView}
              disabled={loading}
            >
              <i className="icon-street text-4xl mr-5"></i>
              STREET VIEW
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default NiceModal.create(BuyNFTModal);
