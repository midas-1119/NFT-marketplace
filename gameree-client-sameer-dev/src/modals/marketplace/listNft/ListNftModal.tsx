import Link from "next/link";
import React, { useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { NFT_TYPES } from "../../../constants/nftType.enum";
import { getBNBRate, getEthRate, listNFT } from "../../../metamask/metamask";
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

import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../store/auth/selector";

import { platformOwnerAddress } from "../../../environment/env";

// const platformOwnerAddress = "0xCeBF6573C0B1B239fF233C5debF502842FFC4cFe";

const ListNftModal = ({
  id,
  src,
  tokenId,
  owner,
  ownerAddress,
  creatorAddress,
  name,
  removeItemFromCurrentList,
  price: _price,
  index,
}: any) => {
  const modal = useModal();
  const [plan, setPlan] = useState("fixed");
  const [checked, setChecked] = useState(false);
  const [royalty, setRoyalty] = useState(null);
  const [price, setPrice] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<any>({
    hours: "",
    minutes: "",
    seconds: "",
  });
  const [error, setError] = useState<boolean>(false);
  const [currType, setCurrencyType] = useState<string>("USDG");
  const [bnbRate, setBnbRate] = useState(1);
  const [ethRate, setEthRate] = useState(1);

  const user = useSelector(selectUser);

  console.log("TOKEN: ", tokenId);
  console.log("OWNER: ", ownerAddress);

  useEffect(() => {
    if (modal.visible) {
      setPrice(_price);
    }
  }, [modal.visible]);

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

  useEffect(() => {
    const storedValue = localStorage.getItem("currType");
    if (storedValue !== null) {
      setCurrencyType(storedValue);
    }
  }, []); // empty dependency array, so this effect only runs once on mount

  const handleChange = (e: any) => {
    setRoyalty(e.target.value);
  };

  const handlePriceChange = (e: any) => {
    setPrice(e.target.value);
  };

  const handleAuctionTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setError(false);
    if (["minutes", "seconds"].includes(event.target.name)) {
      if (event.target.value.length > 2 || Number(event.target.value) > 59) {
        return;
      }
    }
    if (["hours"].includes(event.target.name)) {
      if (event.target.value.length > 3) {
        return;
      }
    }
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const list = async () => {
    try {
      if (
        plan === "auction" &&
        !values.hours &&
        !values.minutes &&
        !values.seconds
      ) {
        setError(true);
        return;
      } else if (
        (plan === "auction" && values.hours < 24) ||
        values.hours > 168
      ) {
        setError(true);
        return;
      }
      setLoading(true);
      let payload: any = {};
      if (plan === "auction") {
        const startTime = Math.floor(new Date().getTime() / 1000) + 60 * 2;
        const duration = calculateSeconds(
          values.hours,
          values.minutes,
          values.seconds
        );
        payload.startTime = startTime;
        payload.duration = duration;
        payload.type = NFT_TYPES.auction;
      }
      if (!payload.type) payload.type = NFT_TYPES.fixedPrice;
      payload = {
        ...payload,
        tokenId,
        receiver: ownerAddress,
      };
      if (checked && royalty) {
        if (royalty > 0) payload.royalty = royalty;
        else {
          toast.error("Royalty should be greater than 0");
          setLoading(false);
        }
      }
      payload.price = price;
      console.log("Payload: ", payload);

      let response: any = {};

      console.log("Owner Address: ", ownerAddress);
      console.log("Platform Owner Address: ", platformOwnerAddress);

      // if (ownerAddress !== platformOwnerAddress) {
      //   response = await listNFT(payload);
      // } else {
      //   response.success = true;
      //   response.listingId = "none";
      // }

      if (user.isMetamaskUser) {
        response = await listNFT(payload);
      } else {
        response.success = true;
        response.tokenId = payload.tokenId;
        // response.listingId = "none";
      }

      console.log("Response: ", response);

      const { success, ...rest } = response;

      if (success) {
        console.log("Rest: ", rest);

        if (checked && royalty) {
          rest.royalty = royalty;
        }

        rest.type = payload.type;

        if (payload.type === NFT_TYPES.auction) {
          rest.startTime = payload.startTime;
          rest.duration = payload.duration;
        }

        rest.listingPrice = price;
        rest.ownerAdderss = ownerAddress;

        const res = await marketplaceService.listNft(id, rest);

        modal.remove();
        removeItemFromCurrentList(index);
        handleShowModal(SUCCESS, {
          type: "list",
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const isError = () => {
    if (!price) return false;
    if (checked && (!royalty || royalty <= 0)) return true;
    return price <= 0;
  };

  const calculateSeconds = (
    hours: string,
    minutes: string,
    seconds: string
  ) => {
    const total = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
    return total;
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
          <h3 className=" text-4xl sm:text-5xl text-center">
            LIST ON MARKETPLACE
          </h3>
        </div>

        <form>
          <div className=" ">
            <RadioGroup
              value={plan}
              onChange={setPlan}
              className="grid sm:grid-cols-2 gap-x-4"
            >
              <RadioGroup.Option value="fixed" className="sm:mt-0 mt-6">
                {({ checked }) => (
                  <div
                    className={`${
                      checked ? " bg-purples  " : " border  border-[#9FA0A2;] "
                    } flex flex-col items-center justify-center rounded-[20px] py-2 h-[100px] border cursor-pointer`}
                  >
                    {checked ? (
                      <svg
                        width="50"
                        height="57"
                        viewBox="0 0 50 57"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22.1804 2.40022L3.14041 21.3082C2.3924 22.0484 1.79859 22.9296 1.39333 23.9008C0.988063 24.872 0.779397 25.9139 0.779397 26.9662C0.779397 28.0186 0.988063 29.0605 1.39333 30.0317C1.79859 31.0028 2.3924 31.884 3.14041 32.6242L16.3804 45.7762C19.5284 48.8962 24.6244 48.8962 27.7684 45.7762L46.5284 27.1442C48.021 25.6606 48.8689 23.6486 48.8884 21.5442L48.9844 8.05622C48.9881 6.99455 48.7813 5.94268 48.3757 4.96151C47.9702 3.98033 47.3741 3.08934 46.6219 2.34011C45.8696 1.59087 44.9763 0.998286 43.9935 0.596643C43.0107 0.195001 41.9581 -0.00771678 40.8964 0.000224608L27.8404 0.0562248C25.7198 0.0632498 23.6869 0.903695 22.1804 2.39622V2.40022ZM38.4124 14.6322C37.8326 15.2072 37.049 15.5299 36.2324 15.5299C35.4158 15.5299 34.6323 15.2072 34.0524 14.6322C33.7668 14.3489 33.54 14.0118 33.3853 13.6404C33.2306 13.2689 33.1509 12.8706 33.1509 12.4682C33.1509 12.0659 33.2306 11.6675 33.3853 11.2961C33.54 10.9247 33.7668 10.5876 34.0524 10.3042C34.6323 9.72922 35.4158 9.40659 36.2324 9.40659C37.049 9.40659 37.8326 9.72922 38.4124 10.3042C39.6124 11.5042 39.6124 13.4402 38.4124 14.6322ZM0.992412 35.0002C0.455066 36.4383 0.342826 38.0006 0.669086 39.5006C0.995346 41.0007 1.74633 42.3753 2.83241 43.4602L10.6884 51.3162C12.1742 52.8021 13.938 53.9807 15.8793 54.7848C17.8205 55.5889 19.9012 56.0028 22.0024 56.0028C24.1036 56.0028 26.1843 55.5889 28.1255 54.7848C30.0668 53.9807 31.8307 52.8021 33.3164 51.3162L47.2444 37.3882C48.37 36.2641 49.003 34.739 49.0044 33.1482V30.0282L33.3164 45.7162C33.0404 45.9922 32.7564 46.2562 32.4684 46.5042L30.4884 48.4882C29.3741 49.6027 28.0511 50.4868 26.5951 51.09C25.139 51.6932 23.5784 52.0037 22.0024 52.0037C20.4264 52.0037 18.8658 51.6932 17.4097 51.09C15.9537 50.4868 14.6307 49.6027 13.5164 48.4882L11.5204 46.4922C11.2341 46.2433 10.9566 45.9845 10.6884 45.7162L2.83241 37.8602C2.02051 37.0503 1.3929 36.0748 0.992412 35.0002Z"
                          fill="white"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="50"
                        height="57"
                        viewBox="0 0 50 57"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22.1804 2.40022L3.14041 21.3082C2.3924 22.0484 1.79859 22.9296 1.39333 23.9008C0.988063 24.872 0.779397 25.9139 0.779397 26.9662C0.779397 28.0186 0.988063 29.0605 1.39333 30.0317C1.79859 31.0028 2.3924 31.884 3.14041 32.6242L16.3804 45.7762C19.5284 48.8962 24.6244 48.8962 27.7684 45.7762L46.5284 27.1442C48.021 25.6606 48.8689 23.6486 48.8884 21.5442L48.9844 8.05622C48.9881 6.99455 48.7813 5.94268 48.3757 4.96151C47.9702 3.98033 47.3741 3.08934 46.6219 2.34011C45.8696 1.59087 44.9763 0.998286 43.9935 0.596643C43.0107 0.195001 41.9581 -0.00771678 40.8964 0.000224608L27.8404 0.0562248C25.7198 0.0632498 23.6869 0.903695 22.1804 2.39622V2.40022ZM38.4124 14.6322C37.8326 15.2072 37.049 15.5299 36.2324 15.5299C35.4158 15.5299 34.6323 15.2072 34.0524 14.6322C33.7668 14.3489 33.54 14.0118 33.3853 13.6404C33.2306 13.2689 33.1509 12.8706 33.1509 12.4682C33.1509 12.0659 33.2306 11.6675 33.3853 11.2961C33.54 10.9247 33.7668 10.5876 34.0524 10.3042C34.6323 9.72922 35.4158 9.40659 36.2324 9.40659C37.049 9.40659 37.8326 9.72922 38.4124 10.3042C39.6124 11.5042 39.6124 13.4402 38.4124 14.6322ZM0.992412 35.0002C0.455066 36.4383 0.342826 38.0006 0.669086 39.5006C0.995346 41.0007 1.74633 42.3753 2.83241 43.4602L10.6884 51.3162C12.1742 52.8021 13.938 53.9807 15.8793 54.7848C17.8205 55.5889 19.9012 56.0028 22.0024 56.0028C24.1036 56.0028 26.1843 55.5889 28.1255 54.7848C30.0668 53.9807 31.8307 52.8021 33.3164 51.3162L47.2444 37.3882C48.37 36.2641 49.003 34.739 49.0044 33.1482V30.0282L33.3164 45.7162C33.0404 45.9922 32.7564 46.2562 32.4684 46.5042L30.4884 48.4882C29.3741 49.6027 28.0511 50.4868 26.5951 51.09C25.139 51.6932 23.5784 52.0037 22.0024 52.0037C20.4264 52.0037 18.8658 51.6932 17.4097 51.09C15.9537 50.4868 14.6307 49.6027 13.5164 48.4882L11.5204 46.4922C11.2341 46.2433 10.9566 45.9845 10.6884 45.7162L2.83241 37.8602C2.02051 37.0503 1.3929 36.0748 0.992412 35.0002Z"
                          fill="#070E1E"
                        />
                      </svg>
                    )}

                    <p
                      className={`block font-TTTrailers-Bold  text-3xl mb-1 mt-3 ${
                        checked ? "text-white" : "text-black"
                      }`}
                    >
                      Fixed Price
                    </p>
                  </div>
                )}
              </RadioGroup.Option>
              <RadioGroup.Option className="sm:mt-0 mt-6" value="auction">
                {({ checked }) => (
                  <div
                    className={`${
                      checked ? "bg-purples" : " border border-[#9FA0A2] "
                    } flex flex-col items-center py-3 rounded-[20px] h-[100px] border cursor-pointer`}
                  >
                    {checked ? (
                      <svg
                        width="54"
                        height="54"
                        viewBox="0 0 54 54"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.0663 40.2668C19.3552 41.1557 20.7668 41.8339 22.301 42.3015C23.8335 42.7673 25.3997 43.0002 26.9997 43.0002C31.4441 43.0002 35.2219 41.4446 38.333 38.3335C41.4441 35.2224 42.9997 31.4446 42.9997 27.0002C42.9997 23.0891 41.7775 19.6775 39.333 16.7655C36.8886 13.8553 33.7997 12.0224 30.0663 11.2668C29.2663 11.0891 28.5552 11.3006 27.933 11.9015C27.3108 12.5006 26.9997 13.2446 26.9997 14.1335V27.0002L17.8663 36.1335C17.2441 36.7557 16.9446 37.4784 16.9677 38.3015C16.989 39.1228 17.3552 39.7779 18.0663 40.2668ZM26.9997 53.6668C23.3108 53.6668 19.8441 52.9664 16.5997 51.5655C13.3552 50.1664 10.533 48.2668 8.13301 45.8668C5.73301 43.4668 3.83345 40.6446 2.43434 37.4002C1.03345 34.1557 0.333008 30.6891 0.333008 27.0002C0.333008 23.3113 1.03345 19.8446 2.43434 16.6002C3.83345 13.3557 5.73301 10.5335 8.13301 8.1335C10.533 5.7335 13.3552 3.83305 16.5997 2.43216C19.8441 1.03305 23.3108 0.333496 26.9997 0.333496C30.6886 0.333496 34.1552 1.03305 37.3997 2.43216C40.6441 3.83305 43.4663 5.7335 45.8663 8.1335C48.2663 10.5335 50.1659 13.3557 51.565 16.6002C52.9659 19.8446 53.6663 23.3113 53.6663 27.0002C53.6663 30.6891 52.9659 34.1557 51.565 37.4002C50.1659 40.6446 48.2663 43.4668 45.8663 45.8668C43.4663 48.2668 40.6441 50.1664 37.3997 51.5655C34.1552 52.9664 30.6886 53.6668 26.9997 53.6668ZM26.9997 48.3335C32.9108 48.3335 37.9446 46.2562 42.101 42.1015C46.2557 37.945 48.333 32.9113 48.333 27.0002C48.333 21.0891 46.2557 16.0553 42.101 11.8988C37.9446 7.74416 32.9108 5.66683 26.9997 5.66683C21.0886 5.66683 16.0557 7.74416 11.901 11.8988C7.74456 16.0553 5.66634 21.0891 5.66634 27.0002C5.66634 32.9113 7.74456 37.945 11.901 42.1015C16.0557 46.2562 21.0886 48.3335 26.9997 48.3335Z"
                          fill="white"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="54"
                        height="54"
                        viewBox="0 0 54 54"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.0668 40.2668C19.3557 41.1557 20.7673 41.8339 22.3015 42.3015C23.8339 42.7673 25.4002 43.0002 27.0002 43.0002C31.4446 43.0002 35.2224 41.4446 38.3335 38.3335C41.4446 35.2224 43.0002 31.4446 43.0002 27.0002C43.0002 23.0891 41.7779 19.6775 39.3335 16.7655C36.889 13.8553 33.8002 12.0224 30.0668 11.2668C29.2668 11.0891 28.5557 11.3006 27.9335 11.9015C27.3113 12.5006 27.0002 13.2446 27.0002 14.1335V27.0002L17.8668 36.1335C17.2446 36.7557 16.9451 37.4784 16.9682 38.3015C16.9895 39.1228 17.3557 39.7779 18.0668 40.2668ZM27.0002 53.6668C23.3113 53.6668 19.8446 52.9664 16.6002 51.5655C13.3557 50.1664 10.5335 48.2668 8.1335 45.8668C5.7335 43.4668 3.83394 40.6446 2.43483 37.4002C1.03394 34.1557 0.333496 30.6891 0.333496 27.0002C0.333496 23.3113 1.03394 19.8446 2.43483 16.6002C3.83394 13.3557 5.7335 10.5335 8.1335 8.1335C10.5335 5.7335 13.3557 3.83305 16.6002 2.43216C19.8446 1.03305 23.3113 0.333496 27.0002 0.333496C30.6891 0.333496 34.1557 1.03305 37.4002 2.43216C40.6446 3.83305 43.4668 5.7335 45.8668 8.1335C48.2668 10.5335 50.1664 13.3557 51.5655 16.6002C52.9664 19.8446 53.6668 23.3113 53.6668 27.0002C53.6668 30.6891 52.9664 34.1557 51.5655 37.4002C50.1664 40.6446 48.2668 43.4668 45.8668 45.8668C43.4668 48.2668 40.6446 50.1664 37.4002 51.5655C34.1557 52.9664 30.6891 53.6668 27.0002 53.6668ZM27.0002 48.3335C32.9113 48.3335 37.945 46.2562 42.1015 42.1015C46.2562 37.945 48.3335 32.9113 48.3335 27.0002C48.3335 21.0891 46.2562 16.0553 42.1015 11.8988C37.945 7.74416 32.9113 5.66683 27.0002 5.66683C21.0891 5.66683 16.0562 7.74416 11.9015 11.8988C7.74505 16.0553 5.66683 21.0891 5.66683 27.0002C5.66683 32.9113 7.74505 37.945 11.9015 42.1015C16.0562 46.2562 21.0891 48.3335 27.0002 48.3335Z"
                          fill="#070E1E"
                        />
                      </svg>
                    )}

                    <p
                      className={`block text-3xl mt-3  font-TTTrailers-Bold ${
                        checked ? "text-white" : "text-black"
                      }`}
                    >
                      Timed Auction
                    </p>
                  </div>
                )}
              </RadioGroup.Option>
            </RadioGroup>
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
              {ownerAddress === creatorAddress ? (
                <div className="flex items-center justify-between xs:mt-8">
                  <div className="">
                    <div className="flex justify-between items-center ">
                      <div className="flex gap-1.5 items-center ">
                        <p className=" text-xl font-Montserrat-Bold text-[#070E1E] mr-2">
                          Royalities
                        </p>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 18.75C7.67936 18.75 5.45376 17.8281 3.81282 16.1872C2.17187 14.5462 1.25 12.3206 1.25 10C1.25 7.67936 2.17187 5.45376 3.81282 3.81282C5.45376 2.17187 7.67936 1.25 10 1.25C12.3206 1.25 14.5462 2.17187 16.1872 3.81282C17.8281 5.45376 18.75 7.67936 18.75 10C18.75 12.3206 17.8281 14.5462 16.1872 16.1872C14.5462 17.8281 12.3206 18.75 10 18.75ZM10 20C12.6522 20 15.1957 18.9464 17.0711 17.0711C18.9464 15.1957 20 12.6522 20 10C20 7.34784 18.9464 4.8043 17.0711 2.92893C15.1957 1.05357 12.6522 0 10 0C7.34784 0 4.8043 1.05357 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 12.6522 1.05357 15.1957 2.92893 17.0711C4.8043 18.9464 7.34784 20 10 20Z"
                            fill="#4F4F4F"
                          />
                          <path
                            d="M11.1624 8.235L8.29994 8.59375L8.19744 9.06875L8.75994 9.1725C9.12744 9.26 9.19994 9.3925 9.11994 9.75875L8.19744 14.0938C7.95494 15.215 8.32869 15.7425 9.20744 15.7425C9.88869 15.7425 10.6799 15.4275 11.0387 14.995L11.1487 14.475C10.8987 14.695 10.5337 14.7825 10.2912 14.7825C9.94744 14.7825 9.82244 14.5413 9.91119 14.1163L11.1624 8.235ZM11.2499 5.625C11.2499 5.95652 11.1182 6.27446 10.8838 6.50888C10.6494 6.7433 10.3315 6.875 9.99994 6.875C9.66842 6.875 9.35048 6.7433 9.11606 6.50888C8.88164 6.27446 8.74994 5.95652 8.74994 5.625C8.74994 5.29348 8.88164 4.97554 9.11606 4.74112C9.35048 4.5067 9.66842 4.375 9.99994 4.375C10.3315 4.375 10.6494 4.5067 10.8838 4.74112C11.1182 4.97554 11.2499 5.29348 11.2499 5.625Z"
                            fill="#4F4F4F"
                          />
                        </svg>
                      </div>
                      <div className="form-check form-switch Atroyalitycheck">
                        <input
                          type="checkbox"
                          name="royality"
                          id="Ataddroyality"
                          className="!text-black"
                          onChange={() => setChecked(!checked)}
                          checked={checked}
                        />
                        <label htmlFor="Ataddroyality"></label>
                      </div>
                    </div>
                    <div className="relative  b flex ">
                      <div className="relative w-full mt-4">
                        <Input
                          className="lg:placeholder:!text-[2rem] text-black1 !py-5 border-2 border-[#070E1E] rounded-r-none"
                          placeholder="0"
                          type="number"
                          onChange={handleChange}
                          error={
                            checked && (!royalty || royalty <= 0)
                              ? "Royalty should be greater than 0"
                              : null
                          }
                          disabled={!checked || loading}
                        />
                        <span className="absolute px-10 right-0 roliteis-radius flex items-center font-TTTrailers-Bold bg-black h-full top-1/2 -translate-y-1/2 text-white text-3xl">
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="mt-14 mb-5">
              <h4 className="text-black text-xl font-Montserrat-Bold ">
                List your price
              </h4>
              <div className="relative  flex ">
                <div className="relative w-full mt-4">
                  <Input
                    className="lg:placeholder:!text-[2rem] !text-2xl text-black placeholder:text-black !py-5 border-2 border-[#070E1E] rounded-r-none"
                    placeholder="0.00"
                    onChange={handlePriceChange}
                    value={price}
                    disabled={loading}
                    type="number"
                    error={isError() ? "Price should be greater than 0" : null}
                  />
                  <span className="absolute px-10 right-0 roliteis-radius flex items-center font-TTTrailers-Bold bg-black h-full top-1/2 -translate-y-1/2 text-white text-3xl">
                    {currType}
                  </span>
                </div>
              </div>
            </div>
            {plan === "auction" && (
              <>
                <h5 className="text-xl font-Montserrat-Bold text-black">
                  AUCTION DEADLINE{" "}
                  <span className="text-sm text-purples ml-1">
                    (Deadline should be between 24 to 168 hours)
                  </span>
                </h5>
                <div className={`mt-3`}>
                  <div className="grid grid-cols-3 gap-6 xs:grid-cols-1s ">
                    <div>
                      <Input
                        className=" text-center mt-2 !text-[2rem] text-black border border-[#9FA0A2] rounded-lg  h-[127px] md:placeholder:!text-[2.5rem]  "
                        placeholder="0"
                        name="hours"
                        type="number"
                        value={values.hours}
                        onChange={handleAuctionTimeChange}
                      />

                      <p className=" text-[#5A5A62] mt-3   text-xl font-Montserrat-SemiBold    md:w-[192px] text-center font-Circular-Medium">
                        Hours
                      </p>
                    </div>

                    <div>
                      <Input
                        className=" text-center mt-2 !text-[2rem] text-black border border-[#9FA0A2] rounded-lg  h-[127px] md:placeholder:!text-[2.5rem]  "
                        placeholder="0"
                        name="minutes"
                        type="number"
                        value={values.minutes}
                        onChange={handleAuctionTimeChange}
                      />

                      <p className=" text-[#5A5A62] mt-3   text-xl font-Montserrat-SemiBold  md:w-[192px] text-center font-Circular-Medium">
                        Minutes
                      </p>
                    </div>

                    <div>
                      <Input
                        className=" text-center mt-2 !text-[2rem] text-black border border-[#9FA0A2] rounded-lg  h-[127px] md:placeholder:!text-[2.5rem]  "
                        placeholder="0  "
                        name="seconds"
                        value={values.seconds}
                        type="number"
                        onChange={handleAuctionTimeChange}
                      />

                      <p className="text-[#777E90] mt-3 text-xl font-Montserrat-SemiBold md:w-[192px] text-center font-Circular-Medium">
                        Seconds
                      </p>
                    </div>
                    {error && (
                      <div className="relative">
                        <InputError
                          error={
                            values.hours < 24 || values.hours > 168
                              ? "Hours must be greater than 24 or less than 168"
                              : "Duration is required for Auction"
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className=" px-[7.875rem] xs:px-0">
              <Link href="#">
                <a>
                  <Button
                    className={`w-full rounded-[3.438rem] flex items-center mt-12 gap-6 `}
                    type="submit"
                    onClick={list}
                    disabled={isError() || !price}
                    isLoading={loading}
                  >
                    <i className="text-white icon-funds"></i>
                    LIST NOW
                  </Button>
                </a>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};
export default NiceModal.create(ListNftModal);
