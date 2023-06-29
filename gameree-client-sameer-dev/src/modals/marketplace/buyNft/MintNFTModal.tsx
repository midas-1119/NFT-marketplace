import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import Button from "../../../components/button/Button";
import ImageComponent from "../../../components/imageComponent/ImageComponent";
import Modal from "../../../components/modal/Modal";
import { STREET_VIEW } from "../../../constants";
import { paymentService } from "../../../services/payment.service";
import { handleShowModal } from "../../../utils/showModal";
import { selectUser } from "../../../store/auth/selector";
import { useDispatch, useSelector } from "react-redux";

const stripePromise = loadStripe(
  "pk_test_51IgkmYHK2XLArNZBO6AwYH5atBnqtzRZfIYI7jz0qXJddhrBCI3qyB2C1SGrBq8FVX66IB7piKXZVzk3K7hWw31Z00yAONUvSq"
);

interface IProps {
  src: string;
  name: string;
  id: string;
  createCheckout: any;
  mint: any;
  lat: number;
  lng: number;
}
const MintNFTModal = ({ src, name, mint, id, lat, lng }: IProps) => {
  const user = useSelector(selectUser);

  const modal = useModal();
  const showStreetView = () => {
    handleShowModal(STREET_VIEW, {
      address: name,
      lat: lat,
      lng: lng,
    });
  };
  const createCheckout = async () => {
    try {
      console.log("User: ", user);
      const stripe: any = await stripePromise;
      const response = await paymentService.createCheckoutSession({
        nftId: id,
        action: "mint",
        actionData: { ownerAddress: user.metamaskId },
      });

      console.log("Response URL: ", response.data.id.url);

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
        <div className="rounded-[3.5rem] bg-black1 py-4 px-8  relative mb-8">
          <i
            className="icon-back text-white absolute text-2xl top-[50%] -translate-y-1/2 left-8 cursor-pointer "
            onClick={() => modal.remove()}
          ></i>
          <h3 className="text-5xl text-center">MINT NFT</h3>
        </div>

        <div className="px-11 mb-9">
          <ImageComponent
            src={src ?? "/assets/images/modal/NFT1.png"}
            width={251}
            height={259}
            objectFit="cover"
            className="rounded-xl"
            figClassName="flex-shrink-0 table mx-auto"
          />
        </div>
        <div className="sm:px-[5.125rem] px-[2.125rem]">
          <p className="font-Montserrat-Bold text-black text-center text-[1.375rem] mb-8">
            <span className="font-Montserrat-Bold text-black">Address: </span>
            {name}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <Button onClick={createCheckout}>Mint With Card</Button>
          <Button onClick={mint} disabled={true}>
            Mint With Crypto
          </Button>
        </div>
        <div className="flex w-full justify-center">
          {" "}
          <Button
            className="shadows bg-white text-4xl md:text-[2.8rem] !text-black1 hover:!text-white mt-5 w-full"
            onClick={showStreetView}
            // disabled={loading}
          >
            <i className="icon-street text-4xl mr-5"></i>
            STREET VIEW
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NiceModal.create(MintNFTModal);
