import NiceModal, { useModal } from "@ebay/nice-modal-react";
import React from "react";
import ImageComponent from "../../components/imageComponent/ImageComponent";
import Modal from "../../components/modal/Modal";

interface IProps {
  src: string;
  address: string;
  from: string;
  hash: string;
  status: string;
  price: string;
  rate: number;
  currType: string;
  owner: string;
}
const BuyNFTSuccessModal = ({
  src,
  address,
  from,
  hash,
  status,
  price,
  rate,
  currType,
  owner,
}: IProps) => {
  const modal = useModal();
  const fromAddress = from
    ? from.substring(0, 8) + "..." + from.substring(from.length - 5)
    : "";
  return (
    <Modal
      hide={() => modal.remove()}
      show={modal.visible}
      afterClose={() => modal.remove()}
    >
      <div className="sm:w-[44.125rem] w-full  ">
        <h3 className="text-5xl text-center text-black font-TTTrailers-Bold mb-7 mt-6">
          CONGRATULATIONS
        </h3>

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
        <div className="sm:px-[5.125rem] px-[2.125rem] mt-8">
          <p className="text-center text-[#9FA0A2] text-[1.375rem] mb-2">
            You successfully purchased
          </p>
          <p className="text-center text-[#9FA0A2] text-[1.375rem]">
            <span className="font-Montserrat-Bold text-black"> {address} </span>{" "}
            {/* from{" "}
            <span className="font-Montserrat-Bold text-black">
              {fromAddress}
            </span> */}
          </p>
          <h3 className="text-black text-center mt-4 mb-8">
            Amount paid: {(+price / rate).toFixed(2)} {currType}
          </h3>
          <div className="border border-[#F2F2F2] rounded-2xl py-[1.625rem] flex sm:flex-row flex-col sm:gap-[4.313rem] gap-[1.313rem] sm:px-[6.438rem] px-8">
            <div className="w-full">
              <p className="text-base text-[#9FA0A2] mb-2 flex gap-2">
                Status:{" "}
                <strong
                  style={{ textTransform: "capitalize" }}
                  className="text-black"
                >
                  {status?.trim()}
                </strong>
              </p>

              {!!hash && (
                <div className="flex">
                  <p className="text-base text-[#9FA0A2] mb-2">
                    Transaction Hash
                  </p>
                  <p className="text-black text-base font-Montserrat-Bold">
                    <a href={`https://testnet.bscscan.com/tx/' + ${hash}`}>
                      {hash}
                    </a>
                  </p>
                </div>
              )}
            </div>
            <div className="w-full">
              <p className="text-[#27AE60] text-base font-Montserrat-Bold ">
                Owner: <strong className="text-black">{owner?.trim()}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default NiceModal.create(BuyNFTSuccessModal);
