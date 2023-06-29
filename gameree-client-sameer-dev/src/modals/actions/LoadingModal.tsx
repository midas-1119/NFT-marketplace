import NiceModal, { useModal } from "@ebay/nice-modal-react";
import React from "react";
import ImageComponent from "../../components/imageComponent/ImageComponent";
import Modal from "../../components/modal/Modal";

const actionType = {
  mint: {
    heading: "Mint Now",
    description: "MINTING",
  },
  list: {
    heading: "LIST ON MARKETPLACE",
    description: "LISTING",
  },
  unlist: {
    heading: "UNLIST",
    description: "UNLISTING YOUR ITEM",
  },
};

interface IProps {
  type: any;
  address: string;
  name: string;
  src: string;
}
type ObjectKey = keyof typeof actionType;

const LoadingModal = ({ type, address, name, src }: IProps) => {
  const modal = useModal();
  const key = type as ObjectKey;
  return (
    <Modal
      hide={() => modal.remove()}
      show={modal.visible}
      afterClose={() => modal.remove()}
    >
      <div className="sm:w-[44.125rem] w-full">
        <div className="rounded-[3.5rem] bg-black1 py-4 px-8 w-full relative mb-8">
          <h3 className="text-5xl text-center">{actionType[key].heading}</h3>
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
        <div className="sm:px-[5.125rem] px-[2.125rem] mt-3">
          <p className="font-Montserrat-Bold text-black text-center text-[1.375rem] mb-8">
            <span className="font-Montserrat-Bold text-black">Address: </span>
            {name}
          </p>
        </div>
        <h3 className="text-center text-black mt-8">
          {actionType[key].description}
        </h3>

        <ImageComponent
          src="/assets/images/modal/verify.gif"
          width={200}
          height={200}
          objectFit="cover"
          className="rounded-xl"
          figClassName="flex-shrink-0 table mx-auto"
        />
      </div>
    </Modal>
  );
};

export default NiceModal.create(LoadingModal);
