import NiceModal from "@ebay/nice-modal-react";

export const handleShowModal = (modalName: string, modalProps : any = {}) => {
    NiceModal.show(modalName, modalProps);
};

export const handleModalHide = (modalName: string ) => {
    NiceModal.remove(modalName);
};