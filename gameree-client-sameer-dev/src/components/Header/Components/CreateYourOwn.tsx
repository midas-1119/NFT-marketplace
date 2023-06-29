import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
// import { CreateYourOwnData } from "../../../data/UploadOptionData";
import Button from "../../button/Button";
import Modal from "../../modal/Modal";
import CreateYourOwnSelect from "./CreateYourOwnSelect";

const CreateYourOwn = ({ state, handleShow }: any) => {
  const [success, setSuccess] = useState(false);
  const [selected, setSelected] = useState<any>();
  const router = useRouter();
  const productId = "6324783d42c81c865d4bc3da";


  // main return
  return (
    <Modal show={state} hide={handleShow}>
      {success ? (
        <div className="text-center ">
          <h2>Choose a Template</h2>
          <p className="sm:w-[28rem] text-xl mx-auto mt-3 mb-11">
            Choose a pre-made template from the dropdown menu to upload your
            design.
          </p>
          <CreateYourOwnSelect
            // Data={templates}
            Data={[]}
            selected={selected}
            setSelected={setSelected}
          />
          <div className="flex flex-col gap-10 mt-10 md:flex-row">
            <Button
              // onClick={openEditor}
              disabled={!selected}
              className=" w-full !py-7 "
            >
              Open in Editor
            </Button>
            <Button
              // onClick={onImageDownload}
              disabled={!selected}
              className="w-full !py-7 "
            >
              Download Template
              <i className="ml-3 icon-download"></i>
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h2>Do you need to download a design template?</h2>
          <h5 className="mt-3 text-lightgrey ">Click below to proceed</h5>
          <div className="xs:flex-col flex gap-11 mt-[4.3rem] justify-center">
            <div className="relative">
              <Button
                onClick={() => setSuccess(true)}
                className="AtBtnStyle !py-5 !px-20 xs:w-full"
              >
                Yes
              </Button>
              <div className="absolute h-[21px] group cursor-pointer w-[21px] bg-primary text-white rounded-full -top-7 2xl:-top-6 xs:right-2 -right-4 flex justify-center items-center">
                i
                <div
                  id="yes"
                  className="bg-secondary bottom-10 absolute xs:-right-4 w-[20rem] sm:w-[23.8rem] p-8 AtToolTip shadow-xl hidden group-hover:block"
                >
                  <h5 className="text-left">
                    Download one of our safety guideline templates ranging from
                    assorted shapes and size requirements.
                  </h5>
                  <div className="absolute -translate-x-1/2 triangle-down -bottom-4 xs:left-72 left-1/2"></div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Button
                onClick={() => {
                  handleShow(false);
                }}
                className="AtBtnStyle !py-5 !px-20 xs:w-full"
              >
                No
              </Button>
              <div className="absolute h-[21px] group cursor-pointer w-[21px] bg-primary text-white rounded-full -top-7 2xl:-top-6 xs:right-2 -right-4 flex justify-center items-center">
                i
                <div className="bg-secondary bottom-10 -right-4 md:-right-16 absolute  w-[20rem] md:w-[35rem] p-8 AtToolTip shadow-xl hidden group-hover:block">
                  <h5 className="text-left">
                    If you already have your design file prepared with the
                    appropriate guidelines, choose ‘No’ to proceed to our Editor
                    to upload and verify the design.
                  </h5>
                  <div className="absolute triangle-down -bottom-4 right-4 md:right-16"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CreateYourOwn;
