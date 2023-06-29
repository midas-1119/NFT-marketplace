import { MapLayerMouseEvent } from "mapbox-gl";
import { useCallback, useEffect, useRef, useState } from "react";
import Mapbox, { useControl } from "react-map-gl";
import { useDispatch } from "react-redux";
import turf from "@turf/turf";
import Geocode from "react-geocode";
import { faSearch, faAdd } from "@fortawesome/free-solid-svg-icons";

import GeocoderControl from "../MapView/Geocoder";
import DrawControl from "./DrawControll";
import ControlPanel from "./ControlPanel";
import { handleShowModal } from "../../utils/showModal";
import { MAP_SEARCH_MODAL, PROPERTY_ADD_MODAL } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

Geocode.setApiKey("AIzaSyASQy-lj_qEU3g4G3D-J1jW00jagKYq91M");
const colors = [
  "#ff1e4f",
  "#fafaa0",
  "#e9823a",
  "#99c17b",
  "#f9127a",
  "#afe854",
];
const AddPrpertyModule = () => {
  const mapRef = useRef<any>(null);

  // const [features, setFeatures] = useState({});
  const [features, setFeatures] = useState({});

  const onUpdate = useCallback((e: any) => {
    console.log("e:-=-=-=", e);
    setFeatures((currFeatures) => {
      const newFeatures: any = { ...currFeatures };
      for (const f of e.features) {
        newFeatures[f.id] = f;
      }
      return newFeatures;
    });
  }, []);

  const onDelete = useCallback((e: any) => {
    setFeatures((currFeatures) => {
      const newFeatures: any = { ...currFeatures };
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
      return newFeatures;
    });
  }, []);

  useEffect(() => {
    if (Object.keys(features).length > 0) {
      let array = (features as any)[Object.keys(features)[0]].geometry
        .coordinates[0];

      console.log(JSON.stringify(array));
    }
  }, [features]);

  return (
    <div className="  min-h-[calc(100vh-120px)] flex justify-center items-center relative">
      <Mapbox
        ref={mapRef}
        initialViewState={{
          longitude: -0.141099,
          latitude: 51.515419,
          zoom: 18,
          // width: `100vh`
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken="pk.eyJ1IjoiZ2FtZXJlZSIsImEiOiJjbDVqaWk3aDUwMGdqM2NxcjZoMGhjanprIn0.vvzASm5oVT3sGtBNakNSQg"
      >
        <div className="w-screen h-screen p-3">
          <div className="flex h-full w-full">
            <div className="w-1/2 gap-[10px] flex flex-col">
              <div
                onClick={() =>
                  handleShowModal(MAP_SEARCH_MODAL, { map: mapRef.current })
                }
                className=" text-black  shadows bg-white relative rounded-full w-16 h-16 flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
              >
                <FontAwesomeIcon className="" height={24} icon={faSearch} />
              </div>
              <div
                onClick={() => {
                  if (
                    (Object.values?.(features)[0] as any)?.geometry
                      ?.coordinates?.[0].length
                  ) {
                    handleShowModal(PROPERTY_ADD_MODAL, {
                      coordinates: (Object.values?.(features)[0] as any)
                        ?.geometry?.coordinates?.[0],
                      polygons: Object.values(features),
                    });
                  }
                }}
                className=" text-black  shadows bg-white relative rounded-full w-16 h-16 flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
              >
                <FontAwesomeIcon className="" height={24} icon={faAdd} />
              </div>
            </div>
            <div className="w-1/2 gap-8 flex flex-col items-end"></div>
          </div>
        </div>
        <DrawControl
          position="top-right"
          displayControlsDefault={false}
          controls={{
            polygon: true,
            trash: true,
          }}
          defaultMode="draw_polygon"
          onCreate={onUpdate}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
        <ControlPanel polygons={Object.values(features)} />
      </Mapbox>
    </div>
  );
};

class SearchComponent {
  private _minpitchzoom: any;
  private _map: any;
  private _btn: any;
  private _container: any;
  constructor({ minpitchzoom = null }: any) {
    this._minpitchzoom = minpitchzoom;
  }

  onAdd(map: any) {
    this._map = map;
    // let _this = this

    this._btn = document.createElement("button");
    this._btn.className = "mapboxgl-ctrl-icon mapboxgl-ctrl-profile";
    this._btn.type = "button";
    this._btn.innerHTML = `
      <img src="https://img.icons8.com/dotty/2x/search.png"
      style="width: 40px; height: 40px;"

        alt="avatar"
        ></img>
      `;
    this._btn["aria-label"] = "Toggle Pitch";
    this._btn.onclick = function () {
      // setIsOpenSearch(true);
    };

    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
    this._container.appendChild(this._btn);

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

export default AddPrpertyModule;
