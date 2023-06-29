import { MapLayerMouseEvent } from "mapbox-gl";
import React, { memo, useEffect, useRef, useState, useCallback } from "react";
import Mapbox, {
  Source,
  Layer,
  FullscreenControl,
  AttributionControl,
  NavigationControl,
  ScaleControl,
  GeolocateControl,
  useControl,
  Popup,
} from "react-map-gl";
import { useDispatch, useSelector } from "react-redux";
import { IBuilding } from "../../interfaces";
import { getMarketplaceBuildingsAction } from "../../store/marketplace/async.func";
import { marketplaceService } from "../../services/marketplace.service";
import GeocoderControl from "./Geocoder";
import { handleShowModal } from "../../utils/showModal";
import { MAP_SEARCH_MODAL, NFT_MAP_VIEW, PROFILE_MODAL } from "../../constants";
import Modal from "../../components/modal/Modal";
import StreetView from "./StreetView";
import Button from "../../components/button/Button";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { selectUser } from "../../store/auth/selector";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faSearch,
  faExpand,
  faEllipsisH,
  faCompress,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { log } from "console";

const colors = [
  "rgba(143, 40, 40, 0.4)",
  "rgba(40, 136, 143, 0.4)",
  "rgba(81, 54, 202, 0.4)",
  "rgba(202, 54, 195, 0.4)",
  "rgba(202, 54, 108, 0.4)",
  "rgba(182, 202, 54, 0.4)",
];

type Props = {
  buildings: IBuilding[];
  user: any;
};

const Source2d: React.FC<Props> = memo(({ buildings, user }) => {
  return (
    <>
      <Source
        id="buildings"
        type="geojson"
        data={{
          type: "FeatureCollection",
          features: buildings
            .filter((b) => b.geometry)
            .map((b: IBuilding, i: number) => ({
              type: "Feature",
              geometry: {
                type: "MultiPolygon",
                coordinates: [[JSON.parse(b.geometry)]],
              },
              properties: {
                id: b._id,
                data: b,
                fillColor: !b?.ownerId?.username
                  ? "rgba(107, 91, 149, 0.6)"
                  : b?.ownerId?.username === user?.username
                  ? "#FFE66D"
                  : b.status === "minted"
                  ? "rgba(255, 111, 97, 1)"
                  : "rgba(107, 91, 149, 0.6)",
              },
            })),
        }}
      >
        <Layer
          id="buildings-fill"
          type="fill"
          paint={{
            "fill-color": [
              "case",
              ["==", ["get", "id"], null],
              "#ff0000", // highlighted color
              ["get", "fillColor"],
            ],
            // "fill-opacity": 0.5,
          }}
        />
        <Layer
          id="buildings-outline"
          type="line"
          paint={{
            "line-color": "#000",
            "line-width": 3,
          }}
        />
      </Source>
    </>
  );
});

const Legend = () => {
  return (
    <div className="container relative h-500px">
      <div className="legend absolute bottom-10 right-10 flex flex-col items-end justify-end bg-white bg-opacity-90 rounded-lg shadow-md p-4">
        <div className="legend-item flex items-center mb-2">
          <span
            className="color inline-block w-4 h-4 rounded-full mr-2"
            style={{ backgroundColor: "rgba(255, 111, 97, 1)" }}
          ></span>
          <span className="label font-bold text-sm">Minted plots</span>
        </div>
        <div className="legend-item flex items-center mb-2">
          <span
            className="color inline-block w-4 h-4 rounded-full mr-2"
            style={{ backgroundColor: "rgba(107, 91, 149, 0.6)" }}
          ></span>
          <span className="label font-bold text-sm">Non-minted plots</span>
        </div>
        <div className="legend-item flex items-center">
          <span
            className="color inline-block w-4 h-4 rounded-full mr-2"
            style={{ backgroundColor: "rgba(255, 230, 109, 1)" }}
          ></span>
          <span className="label font-bold text-sm">Owned plots</span>
        </div>
      </div>
    </div>
  );
};

interface Props3 {
  buildings: Array<IBuilding>;
}

const colors2 = [
  "#B80AB8",
  "#1F78B4",
  "#33A02C",
  "#FB9A99",
  "#E31A1C",
  "#FF7F00",
];

const Source3d = memo(function Source3d({ buildings }: Props3) {
  return (
    <>
      {buildings.map((b: IBuilding, i: number) => {
        if (!b.geometry) {
          return null;
        }

        return (
          <Source
            key={i}
            id={`${b._id}_source`}
            type="geojson"
            data={{
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "MultiPolygon",
                    coordinates: [[JSON.parse(b.geometry)]],
                  },
                  properties: {
                    id: "asd",
                  },
                },
              ],
            }}
          >
            <Layer
              {...{
                id: `${b._id}_fill3d`,
                type: "fill-extrusion",
                source: `${b._id}_source`,
                paint: {
                  "fill-extrusion-color": colors2[i % colors.length],
                  "fill-extrusion-height": 30,
                },
              }}
            />
          </Source>
        );
      })}
    </>
  );
});

const MapboxView = () => {
  const dispatch = useDispatch();
  const [viewType, setViewType] = useState<string>("2d");
  const [buildingsArr, setBuildings] = useState<Array<IBuilding>>([]);
  const [openStreetView, setStreetView] = useState(false);
  const toggleStreetView = () => setStreetView((prevState) => !prevState);
  const [buildingData, setBuilding] = useState<any>();
  const [hoverInfo, setHoverInfo] = useState<any>(null);

  const onHover = useCallback((event: MapLayerMouseEvent) => {
    const {
      point: { x, y },
    } = event;
    const bbox = [
      [event.point.x - 10, event.point.y - 10],
      [event.point.x + 10, event.point.y + 10],
    ];
    // Find features intersecting the bounding box.
    const hoveredFeature = mapRef.current?.queryRenderedFeatures(bbox, {
      // layers: ['C100']
    });

    let buildingLayerId = hoveredFeature?.[0]?.properties?.id;

    // prettier-ignore
    setHoverInfo(buildingLayerId ? {data: JSON.parse(hoveredFeature?.[0]?.properties?.data), x, y} : null);
  }, []);

  const user = useSelector(selectUser);

  const router = useRouter();

  const mapRef = useRef<any>(null);

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  const zoomOut = () => {
    const map = mapRef.current;
    if (map?.getZoom() < 16) return;
    //
    map?.flyTo({
      zoom: map?.getZoom() - 1,
      //   center: evt.lngLat,
      speed: 1,
      curve: 1,
      easing: function (t: any) {
        return t * (2 - t);
      },
    });
  };

  const zoomIn = () => {
    const map = mapRef.current;
    map?.flyTo({
      zoom: map?.getZoom() + 1,
      //   center: evt.lngLat,
      speed: 1,
      curve: 1,
      easing: function (t: any) {
        return t * (2 - t);
      },
    });
  };

  const center = mapRef?.current?.getCenter();
  const _zoom = mapRef?.current?.getZoom();

  const { lng, lat, zoom } = router.query;

  useEffect(() => {
    if (mapRef.current && lat && lng && zoom) {
      mapRef?.current?.flyTo({ center: [lng, lat], zoom: zoom });
    }
  }, [lat, lat, mapRef.current]);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    try {
      let query: any = {
        viewAll: true,
        // range: price
      };
      const response = await dispatch(getMarketplaceBuildingsAction(query));
      if (response.meta && response.meta.requestStatus === "fulfilled") {
        const { buildings, ...rest } = response.payload;
        // if (buildings.length === 0) setLoadMore(false);

        if (rest.current_page > 1)
          setBuildings([...buildingsArr, ...buildings]);
        else setBuildings(buildings);
      }
    } catch (error) {
      return {
        type: "FeatureCollection",
        features: [],
      };
    }
  };

  const onClickMap = async (evt: MapLayerMouseEvent) => {
    evt.preventDefault();
    const bbox = [
      [evt.point.x - 10, evt.point.y - 10],
      [evt.point.x + 10, evt.point.y + 10],
    ];
    // Find features intersecting the bounding box.
    const selectedFeatures = mapRef.current?.queryRenderedFeatures(bbox, {
      // layers: ['C100']
    });

    try {
      const { lat, lng } = evt.lngLat;

      let buildingLayerId = selectedFeatures[0]?.properties?.id;

      if (!buildingLayerId) return;
      const resp = buildingLayerId
        ? JSON.parse(selectedFeatures?.[0]?.properties?.data)
        : null;
      zoomOut();
      handleToggle();
      const response = await marketplaceService.getMapBuilding(lat, lng);
      const responseData = response.data;
      handleClose();
      if (resp) {
        let data: any = {};
        if (resp.name === "ListingPlaced")
          data = { ...responseData?.features[0], ...resp.nft, ...resp };
        else data = { ...responseData?.features[0], ...resp };
        setBuilding(data);
        handleShowModal(NFT_MAP_VIEW, {
          toggleStreetView: toggleStreetView,
          nft: data,
          zoomIn: zoomIn,
        });
      } else {
      }
    } catch (error) {
      zoomIn();
    }

    handleClose();
  };

  let colorIndex = 0;

  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    const element = document.documentElement;
    if (!isFullScreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
        setIsFullScreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  const [currType, setCurrencyType] = useState<string>("USDG");

  useEffect(() => {
    const storedValue = localStorage.getItem("currType");
    if (storedValue !== null) {
      setCurrencyType(storedValue);
    }
  }, []); // empty dependency array, so this effect only runs once on mount

  return (
    <div className="  min-h-[calc(100vh-120px)] flex justify-center items-center relative">
      <Head>
        <title>2D Metaverse - Gameree</title>
      </Head>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme: any) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <CircularProgress size={60} color="inherit" />
          <h4 className="mt-3 text-lightgray text-center">
            LOADING CERTIFICATE
          </h4>
        </div>
      </Backdrop>

      <Modal show={openStreetView} hide={toggleStreetView}>
        <StreetView
          address={buildingData?.address}
          lat={buildingData?.location?.lat}
          lng={buildingData?.location?.lng}
        />
      </Modal>
      {/* {buildingsArr && buildingsArr.length > 0 ? ( */}
      <Mapbox
        ref={mapRef}
        onMouseMove={onHover}
        initialViewState={{
          longitude: -0.141099,
          latitude: 51.515419,
          zoom: 18,
          // width: `100vh`
        }}
        style={{ width: "100vw", height: "100vh" }}
        // mapStyle="mapbox://styles/mapbox/streets-v12"
        // interactiveLayerIds={ids()}
        mapStyle={
          viewType === "3d"
            ? "mapbox://styles/gameree/cldtzuw4x000c01l8hzcqil9m"
            : "mapbox://styles/mapbox/streets-v12"
        }
        mapboxAccessToken="pk.eyJ1IjoiZ2FtZXJlZSIsImEiOiJjbDVqaWk3aDUwMGdqM2NxcjZoMGhjanprIn0.vvzASm5oVT3sGtBNakNSQg"
        onClick={onClickMap}
      >
        <div className="w-screen h-screen p-3">
          <div className="flex h-full w-full">
            <div className="w-1/2 gap-[10px] flex flex-col">
              <div
                onClick={() => router.push("/")}
                className=" text-black  shadows bg-white relative rounded-full w-16 h-16 flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
              >
                <FontAwesomeIcon className="" height={24} icon={faHouse} />
              </div>
              <div
                onClick={() =>
                  router.push(
                    `/mapview/view3d?lng=${center?.lng}&lat=${center?.lat}&zoom=${_zoom}`
                  )
                }
                className=" text-black  shadows bg-white relative rounded-full w-16 h-16 flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
              >
                <div className="text-[38px] font-TTTrailers-Bold mt-2">3d</div>
              </div>
              {user && (
                <div
                  onClick={() =>
                    handleShowModal(PROFILE_MODAL, {
                      zoomIn,
                      map: mapRef.current,
                    })
                  }
                  className=" text-black  shadows bg-white relative rounded-full w-16 h-16 flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  <FontAwesomeIcon className="" height={24} icon={faUser} />
                </div>
              )}
              <div
                onClick={() =>
                  handleShowModal(MAP_SEARCH_MODAL, { map: mapRef.current })
                }
                className=" text-black  shadows bg-white relative rounded-full w-16 h-16 flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
              >
                <FontAwesomeIcon className="" height={24} icon={faSearch} />
              </div>
              <div
                onClick={toggleFullScreen}
                className=" text-black  shadows bg-white relative rounded-full w-16 h-16 flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out"
              >
                <FontAwesomeIcon
                  className=""
                  height={24}
                  icon={isFullScreen ? faCompress : faExpand}
                />
              </div>
            </div>
            <div className="w-1/2 gap-8 flex flex-col items-end"></div>
          </div>
        </div>
        {hoverInfo && (
          <div
            className="tooltip-mapbox"
            style={{ left: hoverInfo.x, top: hoverInfo.y }}
          >
            <div>Address: {hoverInfo.data?.address}</div>
            <div>
              Price: {hoverInfo.data?.price} {currType}
            </div>
            <div>Area: {hoverInfo.data?.area} ft² </div>
            <div>
              Status:{" "}
              {hoverInfo.data?.status !== "minted"
                ? "NOT MINTED"
                : hoverInfo?.data?.status?.toUpperCase?.()}
            </div>
          </div>
        )}
        {viewType === "3d" ? (
          <Source3d buildings={buildingsArr} />
        ) : (
          <Source2d buildings={buildingsArr} user={user} />
        )}
        {/* <FullscreenControl /> */}
        <NavigationControl />
        <GeolocateControl />
        <AttributionControl compact={true} />
        {/* <GeocoderControl
          mapboxAccessToken={
            "pk.eyJ1IjoiZ2FtZXJlZSIsImEiOiJjbDVqaWk3aDUwMGdqM2NxcjZoMGhjanprIn0.vvzASm5oVT3sGtBNakNSQg"
          }
          position="bottom-left"
        /> */}
        <Legend />
      </Mapbox>
    </div>
  );
};

export default MapboxView;
