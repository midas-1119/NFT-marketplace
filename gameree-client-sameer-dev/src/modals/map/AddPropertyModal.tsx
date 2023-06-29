import NiceModal, { useModal } from "@ebay/nice-modal-react";

import React, { useEffect, useReducer, useState } from "react";

import Modal from "../../components/modal/Modal";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { marketplaceService } from "../../services/marketplace.service";
import area from "@turf/area";

const MapboxAddProperty = ({ coordinates, polygons }: any) => {
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const modal = useModal();
  const reducer = (state: any, action: any) => {
    return { ...state, ...action };
  };
  const [inputState, inputDispatch] = useReducer(reducer, {
    location: null,
    price: 0,
  });
  const [submitState, submitDispatch] = useReducer(reducer, {
    error: null,
    data: null,
    loading: false,
  });
  const handlSubmit = async (e: any) => {
    e.preventDefault();
    try {
      submitDispatch({ loading: true });
      const payload = {
        ...inputState,
        price: +inputState.price,
        type: +inputState.type,
        location,
      };
      const { data } = await marketplaceService.addProperty(payload);
      submitDispatch({ data });
      modal.remove();
    } catch (error: any) {
      submitDispatch({ error: error.response });
    } finally {
      submitDispatch({ loading: false });
    }
  };

  useEffect(() => {
    let totalLat = 0;
    let totalLng = 0;
    coordinates?.forEach?.((item: any) => {
      totalLat = totalLat + item?.[0];
      totalLng = totalLng + item?.[1];
    });

    setLocation({
      lat: +(totalLat / coordinates?.length || 0).toFixed(2),
      lng: +(totalLng / coordinates?.length || 0).toFixed(2),
    });
    inputDispatch({ geometry: JSON.stringify(coordinates) });

    let polygonArea = 0;
    for (const polygon of polygons) {
      polygonArea += area(polygon);
    }

    for (const polygon of polygons) {
      console.log("Area:-=-=", area(polygon));
    }

    inputDispatch({ area: polygonArea });
  }, [coordinates]);

  return (
    <Modal
      hide={() => modal.remove()}
      show={modal.visible}
      afterClose={() => modal.remove()}
      className={"backdrop-blur-md"}
      hideBg={true}
    >
      <div className="sm:w-[38.125rem] w-full">
        <div className="bg-[#C164E2] rounded-[2.8rem] text-center mb-8">
          <div className="rounded-[2.8rem] bg-black1 py-4 px-8 relative ">
            <i
              className="icon-cross text-white absolute text-2xl top-[50%] -translate-y-1/2 right-8 cursor-pointer "
              onClick={() => modal.remove()}
            ></i>
            <h3 className="text-5xl">Add Property</h3>
          </div>
        </div>
        <form onSubmit={handlSubmit} className="mb-5">
          <p className="text-lg my-4 text-black">Location</p>
          <div className="flex gap-4">
            <p
              className={`input-text w-full  outline-none bg-transparent py-7 px-6 border-2 border-black1 !rounded-2xl  text-xl  placeholder:pt-3 placeholder:text-black text-black bg-white mb-4`}
            >
              Longitude: {location.lng}
            </p>
            <p
              className={`input-text w-full  outline-none bg-transparent py-7 px-6 border-2 border-black1 !rounded-2xl  text-xl  placeholder:pt-3 placeholder:text-black text-black bg-white mb-4`}
            >
              Latitude: {location.lat}
            </p>
          </div>
          <p className="text-lg my-4 text-black">Address</p>
          <Input
            name="address"
            className="placeholder:text-black text-black bg-white"
            placeholder="Enter your Address"
            onChange={(e: any) => inputDispatch({ address: e.target.value })}
            value={inputState.address}
            required
          />
          <p className="text-lg my-4 text-black">Image URL</p>
          <Input
            name="image"
            className="placeholder:text-black text-black bg-white"
            placeholder="Enter your image url"
            onChange={(e: any) => inputDispatch({ image: e.target.value })}
            value={inputState.image}
            required
          />
          <p className="text-lg my-4 text-black">Geometry</p>
          <Input
            name="geometry"
            className="placeholder:text-black text-black bg-white"
            placeholder="Enter your geometry"
            readOnly
            value={inputState.geometry}
            required
          />
          <p className="text-lg my-4 text-black">Area</p>
          <Input
            name="area"
            className="placeholder:text-black text-black bg-white"
            placeholder="Enter your area"
            readOnly
            value={inputState.area}
            required
          />
          <p className="text-lg my-4 text-black">Inc Address</p>
          <Input
            name="incAddress"
            className="placeholder:text-black text-black bg-white"
            placeholder="Enter your incAddress"
            onChange={(e: any) => inputDispatch({ incAddress: e.target.value })}
            value={inputState.incAddress}
            required
          />
          <p className="text-lg my-4 text-black">Type</p>
          <select
            value={inputState.type}
            required
            onChange={(e) => inputDispatch({ type: e.target.value })}
            className={`input-text w-full  outline-none bg-transparent py-7 px-6 border-2 border-black1 !rounded-2xl  text-xl  placeholder:pt-3 placeholder:text-black text-black bg-white mb-4`}
          >
            <option value={2}>2D</option>
            <option value={3}>3D</option>
            <option value={1}>Steet View</option>
          </select>
          <p className="text-lg my-4 text-black">Price (USD)</p>
          <Input
            name="price"
            type="number"
            className="placeholder:text-black text-black bg-white"
            placeholder="99"
            onChange={(e: any) => inputDispatch({ price: e.target.value })}
            value={inputState.price}
            required
          />
          <Button
            disabled={submitState.loading}
            type="submit"
            className="w-full mt-4"
          >
            Add Property
          </Button>
        </form>
      </div>
    </Modal>
  );
};
export default NiceModal.create(MapboxAddProperty);
