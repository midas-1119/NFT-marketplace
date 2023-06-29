
import { MapLayerMouseEvent } from 'mapbox-gl'
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import turf from '@turf/turf'
import Geocode from 'react-geocode'
import MapboxDraw from "@mapbox/mapbox-gl-draw";

const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");


mapboxgl.accessToken =
    "pk.eyJ1IjoiZ2FtZXJlZSIsImEiOiJjbDVqaWk3aDUwMGdqM2NxcjZoMGhjanprIn0.vvzASm5oVT3sGtBNakNSQg";

Geocode.setApiKey('AIzaSyASQy-lj_qEU3g4G3D-J1jW00jagKYq91M')
const colors = [
    '#ff1e4f',
    '#fafaa0',
    '#e9823a',
    '#99c17b',
    '#f9127a',
    '#afe854',
]

const VIEWS = [
    { view: "Street View", pitch: 90 },
    { view: "Drone View", pitch: 60 },
    { view: "Top View", pitch: 0 },
];
const AddPrpertyModule = () => {
    let map: any;
    const viewCounter = 2;

    const [lng, setLng] = useState(-0.141099);
    const [lat, setLat] = useState(51.515419);

    const mapContainer = useRef<any>();

    const dispatch = useDispatch()

    const mapRef = useRef<any>(null)

    const onClickMap = async (evt: MapLayerMouseEvent) => {
        evt.preventDefault()
        // console.log("evt:-=-=", evt)

        const bbox = [
            [evt.point.x - 10, evt.point.y - 10],
            [evt.point.x + 10, evt.point.y + 10]
        ];
        // Find features intersecting the bounding box.
        const selectedFeatures = mapRef.current?.queryRenderedFeatures(bbox, {
            // layers: ['C100']
        });


    }

    const updateArea = (evt: any) => {
        console.log("draw event:-=-=", evt)
    }
    useEffect(() => {
        map = new mapboxgl.Map({
            container: mapContainer.current,

            style: 'mapbox://styles/mapbox/streets-v12',

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

        let Draw = new MapboxDraw();
        map.addControl(Draw, 'top-right')

        map.on('draw.create', updateArea);
        map.on('draw.delete', updateArea);
        map.on('draw.update', updateArea);

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
        
    }, [])



    return (
        <div className="  min-h-[calc(100vh-120px)] flex justify-center items-center relative">


            <div ref={mapContainer} style={{ height: "100vh", width: "100vw" }}>
                {/* <div
            style={{ height: "100vh", position: "relative" }}
            ref={mapContainer}
            className="map-container"
          > */}

                {/* </div> */}
            </div>

        </div>
    )
}

export default AddPrpertyModule