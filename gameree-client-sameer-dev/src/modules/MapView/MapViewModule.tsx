import React, { useRef, useEffect, useState } from "react";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../store/auth/selector";
import { marketplaceService } from "../../services/marketplace.service";
import StreetView from "./StreetView";
import GoogleSearch from "./GoogleSearch";
import Modal from "../../components/modal/Modal";
import { handleShowModal } from "../../utils/showModal";
import { NFT_MAP_VIEW } from "../../constants";
import { useRouter } from "next/router";
import { IBuilding } from "../../interfaces";
import { getMarketplaceBuildingsAction } from "../../store/marketplace/async.func";
const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");

mapboxgl.accessToken =
  "pk.eyJ1IjoiZ2FtZXJlZSIsImEiOiJjbDVqaWk3aDUwMGdqM2NxcjZoMGhjanprIn0.vvzASm5oVT3sGtBNakNSQg";

const VIEWS = [
  { view: "Street View", pitch: 90 },
  { view: "Drone View", pitch: 60 },
  { view: "Top View", pitch: 0 },
];

const MapView = () => {
  let map: any;
  const [lng, setLng] = useState(-0.141099);
  const [lat, setLat] = useState(51.515419);
  const [zoom, setZoom] = useState(18);
  const [buildingData, setBuilding] = useState<any>();
  const [mapData, setMapData] = useState<any>();
  const mapContainer = useRef<any>();
  const [dimensionViews, setDimensionViews] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [MapNavigate, setMapNavigate] = useState<any>();
  const [position, setPosition] = useState({ lat: 0, lng: 0 });
  const [openStreetView, setStreetView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalIsOpenSearch, setIsOpenSearch] = useState(false);
  const [address, setAddress] = useState();
  let [markers, setMarkers] = useState([]);
  const [hoverData, SetHoverData] = useState<any>();
  const [mapboxData, SetMapBoxData] = useState<any>();

  const toggleStreetView = () => setStreetView((prevState) => !prevState);
  const user = useSelector(selectUser);
  const toggleModalSearch = () => setIsOpenSearch((prevState) => !prevState);
  const isFetchReady = useRef(true);

  const dispatch = useDispatch()
  const [buildingsArr, setBuildings] = useState<IBuilding[]>([]);



  const showSearchProps = {
    status: modalIsOpenSearch,
    toggleModalSearch,
  };
  const viewCounter = 2;

  const { view } = useRouter().query;
  useEffect(() => {
    if (view && view == "2d") setDimensionViews(false)
  }, [view])
  useEffect(() => {
    map = new mapboxgl.Map({
      container: mapContainer.current,
      // style: 'mapbox://styles/mapbox/light-v11',
      style: 'mapbox://styles/mapbox/streets-v12',
      // dimensionViews === true
      //   ? "mapbox://styles/gameree/clbrqat43000n15qoa6e1wd3u"
      //   // : "mapbox://styles/gameree/clclzcmmw002k15nvq08q3slb/draft",
      //   // : "mapbox://styles/gameree/clbrqat43000n15qoa6e1wd3u",
      //    : "mapbox://styles/gameree/cl8a2av7u002d14rty02ym895",

      // dimensionViews === true
      //     ? "mapbox://styles/gameree/cl8a2a47r008s14pls1cl9gw6"
      //     : "mapbox://styles/gameree/cl8a2av7u002d14rty02ym895",
      width: "100wh",
      attributionControl: false,
      // center: [-0.142, 51.5152],
      center: [lng, lat],
      doubleClickZoom: false,
      zoom: 18,
      pitch: VIEWS[viewCounter].pitch,
      bearing: 80,
      layers: [
        {
          id: "background",
          type: "background",
          layout: {},
          paint: {
            "background-color": ["white"],
          },
        },
        {},
      ],
    });
    // starting point

    /**
     *
     *  Change the Buildings to 2d/3d
     * */
    class TwoThreeDimensions {
      private _minpitchzoom: any;
      private _btn: any;
      private _map: any;
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
          <img src="https://img.freepik.com/free-vector/city-skyline-concept-illustration_114360-8923.jpg?w=2000"
            style="width: 40px; height: 40px;"
            alt="avatar"
            ></img>
          `;
        this._btn["aria-label"] = "Toggle Pitch";
        this._btn.onclick = function () {
          setDimensionViews(!dimensionViews);
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

    /**
     * Building Areas Offered
     *
     * */
    class BuildingsPlace {
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
        <img src="https://image.shutterstock.com/image-vector/area-icon-vector-illustration-260nw-1249102720.jpg"
        style="width: 40px; height: 40px;"
          alt="avatar"
          ></img>
        `;
        this._btn["aria-label"] = "Toggle Pitch";
        this._btn.onclick = function () {
          // handleShowModal(NFT_MAP_VIEW)
          //Show Modal here 

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
          setIsOpenSearch(true);
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


    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, "bottom-right");
    map.addControl(
      new TwoThreeDimensions({ minpitchzoom: 11 }),
      "bottom-right"
    );
    map.addControl(new SearchComponent({ minpitchzoom: 11 }), "bottom-right");
    // map.addControl(new BuildingsPlace({ minpitchzoom: 11 }), "bottom-right");

    map.on("load", async (e: any) => {

      /*************************************** */

      try {
        let query: any = {
          viewAll: true
          // range: price
        }
        const response = await dispatch(
          getMarketplaceBuildingsAction(query)
        );
        if (response.meta && response.meta.requestStatus === "fulfilled") {
          const { buildings, ...rest } = response.payload;
          // if (buildings.length === 0) setLoadMore(false);
          if (rest.current_page > 1)
            setBuildings([...buildingsArr, ...buildings]);
          else setBuildings(buildings);

          if (buildings && buildings.length > 0) {
            for (let b of buildings) {
              if (!b.geometry) {

              } else {
                console.log("bbbbbb:-=-=", b)
                map.addSource(`${b._id}_source`, {
                  type: 'geojson',
                  data: {
                    type: 'FeatureCollection',
                    features: [
                      {
                        type: 'Feature',
                        properties: { ...b },
                        geometry: {
                          type: 'Polygon',
                          coordinates: [
                            JSON.parse(b.geometry)
                          ]
                        }
                      },
                      // {
                      //   'type': 'Feature',
                      //   'geometry': {
                      //     'type': 'Point',
                      //     'coordinates': [-121.415061, 40.506229]
                      //   }
                      // },
                      // {
                      //   'type': 'Feature',
                      //   'geometry': {
                      //     'type': 'Point',
                      //     'coordinates': [-121.505184, 40.488084]
                      //   }
                      // },
                      // {
                      //   'type': 'Feature',
                      //   'geometry': {
                      //     'type': 'Point',
                      //     'coordinates': [-121.354465, 40.488737]
                      //   }
                      // }
                    ]
                  }
                });

                map.addLayer({
                  id: `${b._id}_fill`,
                  type: 'fill',
                  source: `${b._id}_source`,
                  paint: {
                    'fill-color': '#B80AB8',
                    'fill-opacity': 0.4
                  },
                  filter: ['==', '$type', 'Polygon']
                });

                map.addLayer({
                  id: `${b._id}_circle`,
                  type: 'circle',
                  source: `${b._id}_source`,
                  paint: {
                    'circle-radius': 6,
                    'circle-color': '#B42222'
                  },
                  filter: ['==', '$type', 'Point']
                });

                // map.addLayer({
                //   'id': `${b._id}_extrusion`,
                //   'type': 'fill-extrusion',
                //   'source': `${b._id}_source`,
                //   'paint': {
                //   // Get the `fill-extrusion-color` from the source `color` property.
                //   'fill-extrusion-color': '#B80AB8',

                //   // Get `fill-extrusion-height` from the source `height` property.
                //   'fill-extrusion-height': ['get', 'height'],

                //   // Get `fill-extrusion-base` from the source `base_height` property.
                //   'fill-extrusion-base': ['get', 'base_height'],

                //   // Make extrusions slightly opaque to see through indoor walls.
                //   'fill-extrusion-opacity': 0.5
                //   }
                //   });

                map.addLayer({
                  'id': `${b._id}_outline`,
                  'type': 'line',
                  'source': `${b._id}_source`,
                  'layout': {},
                  'paint': {
                    'line-color': '#000',
                    'line-width': 3
                  }
                });
                // if (dimensionViews) {
                //   map.addLayer(
                //     {
                //       'id': `${b._id}_3d`,
                //       'source': 'composite',
                //       'source-layer': 'building',
                //       'filter': ['==', 'extrude', 'true'],
                //       'type': 'fill-extrusion',
                //       'minzoom': 15,
                //       'paint': {
                //         'fill-extrusion-color': '#aaa',

                //         // Use an 'interpolate' expression to
                //         // add a smooth transition effect to
                //         // the buildings as the user zooms in.
                //         'fill-extrusion-height': [
                //           'interpolate',
                //           ['linear'],
                //           ['zoom'],
                //           15,
                //           0,
                //           15.05,
                //           ['get', 'height']
                //         ],
                //         'fill-extrusion-base': [
                //           'interpolate',
                //           ['linear'],
                //           ['zoom'],
                //           15,
                //           0,
                //           15.05,
                //           ['get', 'min_height']
                //         ],
                //         'fill-extrusion-opacity': 0.6
                //       }
                //     },
                //     `${b._id}_fill`
                //   );
                // }
              }
            }

          }
        }
      } catch (err: any) {
        console.log(err.request.statusCode);
      }





      /******************************************** */

      const layers = map.getStyle().layers;
      const labelLayerId = layers.find((layer: any) => layer.type === 'symbol' && layer.layout['text-field']
      ).id;

      // The 'building' layer in the Mapbox Streets
      // vector tileset contains building height data
      // from OpenStreetMap.

      //   map.addLayer(
      //   {
      //     'id': 'add-3d-buildings',
      //     'source': 'composite',
      //     'source-layer': 'building',
      //     'filter': ['==', 'extrude', 'true'],
      //     'type': 'fill-extrusion',
      //     'minzoom': 15,
      //     'paint': {
      //       'fill-extrusion-color': '#aaa',

      //       // Use an 'interpolate' expression to
      //       // add a smooth transition effect to
      //       // the buildings as the user zooms in.
      //       'fill-extrusion-height': [
      //         'interpolate',
      //         ['linear'],
      //         ['zoom'],
      //         15,
      //         0,
      //         15.05,
      //         ['get', 'height']
      //       ],
      //       'fill-extrusion-base': [
      //         'interpolate',
      //         ['linear'],
      //         ['zoom'],
      //         15,
      //         0,
      //         15.05,
      //         ['get', 'min_height']
      //       ],
      //       'fill-extrusion-opacity': 0.6
      //     }
      //   },
      //   labelLayerId
      // );



      /***************************************** */
      console.log(map.getStyle(), "map.getStyle");

      const layer = map.getStyle().layers.at(-1);
      console.log("maps layers:-=-=", map.getStyle().sources)
      const layerID = layer.id;
      console.log(layerID, "layerID");

      if (dimensionViews === false) {
        // map.setPaintProperty(layerID, 'fill-color', paint)
        const el = document.createElement("div");
        el.textContent = "SFK";
        new mapboxgl.Marker(el).setLngLat([-0.1484, 51.5148]).addTo(map);
      } else {
        const el = document.createElement("div");
        el.textContent = "SFK";
        new mapboxgl.Marker(el).setLngLat([-0.1484, 51.5148]).addTo(map);
      }
    });

    map.on("click", async (e: any) => {
      console.log("event:-=-=-=", e)

      setBuilding(null);
      const bbox = [
        [e.point.x - 10, e.point.y - 10],
        [e.point.x + 10, e.point.y + 10]
      ];
      // Find features intersecting the bounding box.
      const selectedFeatures = map.queryRenderedFeatures(bbox, {
        // layers: ['C100']
      });
      console.log(selectedFeatures, "selectedFeatures");

      const point = e.lngLat;
      // var features = map.queryRenderedFeatures(e.point, {
      //   layers: ['C100']
      // });
      // const _id = features[0]?.id;
      let buildingLayerId = selectedFeatures[0]?.layer?.id;

      // if (dimensionViews === false) buildingLayerId = features[0]?.layer?.id;
      // else buildingLayerId = features[1]?.layer?.id;

      console.log(buildingLayerId.split('_')[0], "buildingLayerId");

      // if (buildingLayerId === "C100") {
      const { lat, lng } = e.lngLat;
      const response = await marketplaceService.getMapBuilding(lat, lng);
      const responseData = response.data;
      // console.log("responseData:-=-=-=", responseData)
      SetMapBoxData(responseData);
      const id = responseData?.features[0]?.id;
      setPosition({ lat, lng });
      const nftResponse = await marketplaceService.getByLocationId(buildingLayerId.split('_')[0]);
      // console.log("nftResponse:-=-=-=", nftResponse)

      const resp = nftResponse.data.data;

      if (resp) {
        let data: any = {}
        console.log("respe:-=-=-=", resp)
        if (resp.name === "ListingPlaced")
          data = { ...responseData?.features[0], ...resp.nft, ...resp }
        else data = { ...responseData?.features[0], ...resp }
        setBuilding(data)
        handleShowModal(NFT_MAP_VIEW, {
          toggleStreetView: toggleStreetView,
          nft: data
        })
      }
      // }
    });

    map.on("move", (e: any) => {
      setLng(map.getCenter().lng);
      setLat(map.getCenter().lat);
      setZoom(map.getZoom().toFixed(4));
    });
    setMapNavigate(map);
    // return () => {
    //   if( map ) map.remove()
    // }

    // map.on("mousemove", (e: any) => {
    //   const point = e.lngLat;

    //   // `e.point` is the x, y coordinates of the `mousemove` event
    //   // relative to the top-left corner of the map.
    //   setLng(point.lng);
    //   setLat(point.lat);

    //   var features = map.queryRenderedFeatures(e.point);

    //   /**
    //    * checks the layer then fetches the building data on the hover on the building on the basis of lng,lat
    //    * */
    //   if (features[0]) {
    //     if (isFetchReady.current !== true) return;
    //     isFetchReady.current = false;
    //     fetch(
    //       `https://api.mapbox.com/geocoding/v5/mapbox.places/${point.lng},${point.lat}.json?limit=1&access_token=pk.eyJ1IjoiZ2FtZXJlZSIsImEiOiJjbDVqaWk3aDUwMGdqM2NxcjZoMGhjanprIn0.vvzASm5oVT3sGtBNakNSQg`
    //     )
    //       .then((data) => {
    //         isFetchReady.current = true;
    //         return data.json();
    //       })
    //       .then((json) => {
    //         SetHoverData(json);
    //       })
    //       .catch((e) => { });
    //   }
    // });
    return () => map.remove();
  }, []);

  return (
    <>
      <Head>
        <title>Map View</title>
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>
      <div className="  min-h-[calc(100vh-120px)] flex justify-center items-center relative">
        <Modal show={openStreetView} hide={toggleStreetView}>
          <StreetView address={buildingData?.address} lat={buildingData?.location?.lat} lng={buildingData?.location?.lng} />
        </Modal>
        <div ref={mapContainer} style={{ height: "100vh", width: "100vw" }}>
          {/* <div
            style={{ height: "100vh", position: "relative" }}
            ref={mapContainer}
            className="map-container"
          > */}
          <div className="sidebar_2" style={{}}>
            {" "}
            Longitude: {lng.toFixed(4)} | Latitude: {lat.toFixed(4)} | Zoom:{" "}
            {zoom} {/*| Pitch {pitch}*/}{" "}
          </div>

          {hoverData && (
            <div className="sidebar">{`${hoverData?.features[0]?.place_name}`}</div>
          )}
          {/* </div> */}
        </div>

        {modalIsOpenSearch && (
          <GoogleSearch
            address={address}
            setAddress={setAddress}
            markers={markers}
            setMarkers={setMarkers}
            MapNavigate={MapNavigate}
            {...showSearchProps}
          // setPopup={setPopup}
          />
        )}
        {/* <Button onClick={() => handleClose()}>mappppppp</Button> */}
      </div>
    </>
  );
};

export default MapView;
