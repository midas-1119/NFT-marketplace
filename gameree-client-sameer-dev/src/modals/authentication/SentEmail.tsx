import NiceModal, { useModal } from "@ebay/nice-modal-react";
import React from "react";
import Button from "../../components/button/Button";
import ImageComponent from "../../components/imageComponent/ImageComponent";
import Modal from "../../components/modal/Modal";
import { RESET_PASSWORD } from "../../constants";
import { handleShowModal } from "../../utils/showModal";

const SentEmail = () => {
  const modal = useModal();

  const handleAuth = (modalName: string, modalProps: any = {}) => {
    handleShowModal(modalName, modalProps);
    modal.remove()
  };
  return (
    <Modal hide={()=>modal.remove()} show={modal.visible} afterClose={()=> modal.remove()}>
    <div className="sm:w-[44.125rem] lg:w-[51.151rem] w-full">
      <form>
      <div className="rounded-[34px] bg-black1 py-4 px-8  relative mb-8">
        <h3 className="text-5xl text-center">EMAIL SENT</h3>
      </div>
      <h4 className="text-purples lg:text-5xl">EMAIL HAS BEEN SENT!</h4>
      <h6 className="font-Montserrat-Medium text-black2">
        Check your inbox and enter the code to reset password.
      </h6>
      <ImageComponent
        src="/assets/images/modal/mail.svg"
        width={196}
        height={170}
        objectFit="cover"
        className="rounded-xl"
        figClassName="flex-shrink-0 table mx-auto"
      />
      <Button
        type="button"
        className="!px-13 mt-4 w-full shadows"
        onClick={()=>handleAuth(RESET_PASSWORD)}
      >
        CONTINUE
      </Button>
      </form>
    </div>
    </Modal>
  );
};

export default NiceModal.create(SentEmail);
