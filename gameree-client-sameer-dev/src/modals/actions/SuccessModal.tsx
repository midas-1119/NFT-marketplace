import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import Button from "../../components/button/Button";
import ImageComponent from "../../components/imageComponent/ImageComponent";
import { selectType } from "../../store/auth/selector";
import Modal from "../../components/modal/Modal";
import NiceModal, { useModal } from "@ebay/nice-modal-react";

const actionType = {
  mint: {
    heading: "MINTED",
    description: "MINTING SUCCESSFULLY",
    spanText: "Your NFT is minted and placed in minted section",
    button: false,
  },
  list: {
    heading: "LIST ON MARKETPLACE",
    description: "SUCCESSFULLY LISTED",
    button: true,
    spanText: "",
  },
  sendOffer: {
    heading: "SEND OFFER",
    description: "SUCCESSFULLY OFFER SENT",
    button: true,
    spanText: "",
  },
  placeBid: {
    heading: "PLACE A BID",
    description: "SUCCESSFULLY BID PLACED",
    button: false,
    spanText: "",
  },
  acceptOffer: {
    heading: "ACCEPT OFFER",
    description: "SUCCESSFULLY OFFER ACCEPTED",
    button: true,
    spanText: "",
  },
  rejectOffer: {
    heading: "REJECT OFFER",
    description: "SUCCESSFULLY OFFER REJECTED",
    button: true,
    spanText: "",
  },
  completePurchaseOffer: {
    heading: "COMPLETE OFFER",
    description: "SUCCESSFULLY BOUGHT NFT",
    button: true,
    spanText: "",
  },
  unlist: {
    heading: "UNLIST",
    description: "UNLISTED FROM MARKETPLACE",
    spanText: "Your NFT is unlisted and placed in owned section",
    button: true,
  },
  reset: {
    heading: "SUCCESS",
    description: "CONGRATULATION!",
    spanText: "Password Successfully Reset.",
    button: false,
  },
  bid: {
    heading: "SUCCESS",
    description: "CONGRATULATION!",
    spanText: "Bid Placed Successfully.",
    button: false,
  },
  edit: {
    heading: "SUCCESS",
    description: "PROFILE UPDATED",
    spanText: "Profile Updated Successfully.",
    button: false,
  },
  editPassword: {
    heading: "SUCCESS",
    description: "PASSWORD UPDATED",
    spanText: "Password Updated Successfully.",
    button: false,
  },
};

interface IProps {
  type: string;
}
type ObjectKey = keyof typeof actionType;

const SuccessModal = ({ type }: IProps) => {
  const modal = useModal();
  const successType: string = useSelector(selectType);
  const key = (type ?? successType) as ObjectKey;
  const action = actionType[key];

  return (
    <Modal
      hide={() => modal.remove()}
      show={modal.visible}
      afterClose={() => modal.remove()}
    >
      <div className="sm:w-[44.125rem] w-full">
        <div className="rounded-[3.5rem] bg-black1 py-4 px-8  relative mb-8">
          <h3 className="text-5xl text-center">{action.heading}</h3>
        </div>
        <ImageComponent
          src="/assets/images/modal/infin.svg"
          width={200}
          height={200}
          objectFit="cover"
          className="rounded-xl"
          figClassName="flex-shrink-0 table mx-auto"
        />
        <h3 className="text-black text-center mb-1">{action.description}</h3>
        <p className="text-2xl text-center">{action.spanText}</p>

        <div className="flex justify-center mt-5">
          {!action.button ? (
            <svg
              className="cursor-pointer"
              width="61"
              height="61"
              viewBox="0 0 61 61"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => modal.remove()}
            >
              <circle cx="30.9692" cy="30.9692" r="30.0308" fill="#070E1E" />
              <circle
                cx="29.5663"
                cy="29.5663"
                r="29.0663"
                fill="white"
                stroke="#070E1E"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M38.7757 16.2869C38.5973 16.3902 38.5081 16.5286 38.5059 16.7057C38.5044 16.8299 38.1631 17.2027 36.8891 18.4718C35.594 19.7618 32.4133 22.8339 31.6089 23.5715L31.4451 23.7218L31.0354 23.3644C29.4897 22.0155 28.5304 21.1112 28.4568 20.9334C28.4089 20.8178 28.1963 20.5913 27.9489 20.3921C27.7148 20.2038 27.1907 19.6592 26.7842 19.1819C26.3777 18.7047 25.7554 18.0254 25.4014 17.6726C24.9666 17.2392 24.7339 16.9582 24.6844 16.8068C24.5834 16.4981 24.3058 16.2743 24.024 16.2743C23.8546 16.2743 23.611 16.3861 23.0175 16.7366C20.3395 18.3179 18.9669 19.3117 18.1898 20.2319C18.0238 20.4285 17.8519 20.5912 17.8078 20.5935C17.6441 20.602 17.3748 20.9472 17.3748 21.1484C17.3748 21.3102 17.4594 21.4309 17.8729 21.859C18.4013 22.4062 19.5834 23.504 20.4838 24.2837C21.1455 24.8567 23.9554 27.1314 25.18 28.0853L26.0729 28.781L25.8441 29.0036C25.7182 29.1261 24.9089 29.8919 24.0456 30.7054C21.9508 32.6796 15.6754 39.0294 15.5448 39.3069C15.4888 39.4259 15.443 39.5904 15.443 39.6725C15.443 39.8813 15.6802 40.2183 15.9037 40.3269C16.007 40.3771 16.1834 40.5594 16.2955 40.7321C17.0249 41.8547 18.3136 43.023 20.2591 44.3254C21.1821 44.9432 21.8525 45.2813 22.4706 45.4406C23.047 45.5892 23.2407 45.593 23.764 45.4662C24.409 45.31 24.4365 45.2865 24.7922 44.5871C26.3082 41.6064 28.2396 38.4264 30.6439 34.9526L31.6453 33.5059L31.8298 33.6797C31.9313 33.7753 32.9378 34.6729 34.0665 35.6745C35.1952 36.676 36.5399 37.9026 37.0548 38.4004C39.1914 40.466 40.6579 41.5231 41.4823 41.5921C41.7576 41.6151 41.8246 41.5976 41.9868 41.4599C42.092 41.3706 42.2492 41.3009 42.3461 41.3006C42.654 41.2995 43.1061 41.0337 43.4643 40.6431C43.8185 40.2569 44.5939 39.1958 45.1415 38.3479C45.4549 37.8628 45.4572 37.8607 45.7211 37.8578C46.2404 37.8522 46.4777 37.4001 46.2313 36.8865C45.8597 36.1123 44.8792 34.962 43.6467 33.8544C42.3793 32.7156 39.8519 30.5808 37.9427 29.0365C36.8425 28.1467 36.1555 27.551 36.1738 27.5029C36.1902 27.4597 37.0552 26.3336 38.0959 25.0004C39.1367 23.6674 40.5235 21.8871 41.1778 21.0442C42.0696 19.8954 42.4237 19.4838 42.5922 19.4001C42.8978 19.2483 43.0306 18.9937 43.0431 18.5354C43.0523 18.1989 43.0357 18.1424 42.8799 17.9784C42.7108 17.8003 42.3405 17.6469 42.2364 17.7118C42.2078 17.7296 41.5014 17.3998 40.6667 16.9788C39.8319 16.5578 39.0922 16.2142 39.0227 16.2152C38.9532 16.2162 38.8421 16.2485 38.7757 16.2869ZM23.1938 24.4604C23.5197 24.6591 24.1164 25.1122 24.5197 25.4671C24.923 25.822 25.683 26.4746 26.2086 26.9173C26.7341 27.3599 27.1457 27.7221 27.123 27.7221C27.1004 27.7221 26.3716 27.1522 25.5034 26.4555C24.6352 25.7589 23.6124 24.9459 23.2306 24.649C22.8488 24.3521 22.5092 24.0826 22.476 24.0502C22.4028 23.9788 22.4235 23.9907 23.1938 24.4604ZM18.9004 38.2109C18.8824 38.2863 18.8074 38.4164 18.7338 38.5001C18.6601 38.5838 18.5832 38.7003 18.5627 38.7589C18.5423 38.8175 18.4826 38.8655 18.4302 38.8655C18.3777 38.8655 18.2546 38.9073 18.1566 38.9584C17.855 39.1157 17.9573 38.9558 18.4464 38.5052C18.7037 38.2682 18.9184 38.0742 18.9236 38.0741C18.9288 38.074 18.9184 38.1355 18.9004 38.2109ZM23.792 43.8282C23.691 44.0418 23.6068 44.074 23.3815 43.9852C23.2769 43.9439 23.3011 43.9164 23.5626 43.7792C23.7287 43.6921 23.8708 43.6195 23.8786 43.618C23.8863 43.6164 23.8474 43.711 23.792 43.8282Z"
                fill="#070E1E"
              />
            </svg>
          ) : (
            <Link href="/marketplace">
              <Button
                onClick={() => {
                  modal.remove();
                }}
                className="text-gxl shadows w-[70%] "
              >
                GO TO MARKETPLACE
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Modal>
  );
};
export default NiceModal.create(SuccessModal);
