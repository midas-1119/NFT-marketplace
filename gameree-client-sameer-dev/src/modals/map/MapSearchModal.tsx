import NiceModal, { useModal } from "@ebay/nice-modal-react";
import debouce from "lodash.debounce";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { selectUser } from "../../store/auth/selector";
import Modal from "../../components/modal/Modal";
import Input from "../../components/input/Input";
import axios from "axios";
import { Loader } from "@googlemaps/js-api-loader";

const MapboxSearch = ({ map }: any) => {
  const user: any = useSelector(selectUser);
  const [results, setResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  console.log(results, "results");

  const handleChange = (e: any) => {
    setSearchTerm(e.target.value);
    debounceFn(e.target.value);
  };

  const handleLocationResults = async (payload: string) => {
    if (payload === "") return;

    const loader = new Loader({
      apiKey: "AIzaSyAr4fyZxIKYYwLuuPTFexhehL-sgufSUI8",
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(() => {
      const service = new google.maps.places.PlacesService(
        document.createElement("div")
      );
      const request = {
        query: payload,
        fields: ["name", "place_id", "geometry", "formatted_address"],
      };
      service.textSearch(request, (results: any, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setResults(
            results?.map((result: any) => ({
              id: result.place_id,
              name: result.name,
              address: result.formatted_address,
              location: {
                latitude: result.geometry.location.lat(),
                longitude: result.geometry.location.lng(),
              },
            }))
          );
        }
      });
    });
  };

  const debounceFn = useCallback(debouce(handleLocationResults, 1000), []);

  const modal = useModal();
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
            <h3 className="text-5xl">Search</h3>
            <p>Enter your location</p>
          </div>
        </div>
        <div className="mb-5">
          <Input
            className="placeholder:text-black text-black bg-white"
            placeholder="Enter your location"
            onChange={handleChange}
            value={searchTerm}
          />
          <div
            style={{ height: "368px" }}
            className="flex flex-col mt-4 gap-1 overflow-y-auto"
          >
            {results.map((location: any) => {
              return (
                <div
                  onClick={() => {
                    modal.remove();
                    map?.flyTo({
                      center: [
                        location.location.longitude,
                        location.location.latitude,
                      ],
                      zoom: 18,
                    });
                  }}
                  className="rounded-2xl bg-black1 py-3 px-8 cursor-pointer"
                >
                  <h3 className="text-4xl">{location.name}</h3>
                  <p>{location.address}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default NiceModal.create(MapboxSearch);
