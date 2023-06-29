import NiceModal, { useModal } from "@ebay/nice-modal-react";
import React from "react";
import Modal from "../../components/modal/Modal";
import { BUY_NFT ,MINT_NFT} from "../../constants";
import StreetView from "../../modules/MapView/StreetView";
import { handleModalHide } from "../../utils/showModal";

const StreetViewModal = ({
    address,
    lat,
    lng
}: any) => {
  const modal = useModal();
  const closeModal = () => {
    modal.remove();
    handleModalHide(BUY_NFT);
    handleModalHide(MINT_NFT);
  }
  return (
    <Modal
      hide={closeModal}
      show={modal.visible}
      afterClose={closeModal}
    >
        <StreetView address={address} lat={lat} lng={lng}/>
    </Modal>
  );
};
export default NiceModal.create(StreetViewModal);
