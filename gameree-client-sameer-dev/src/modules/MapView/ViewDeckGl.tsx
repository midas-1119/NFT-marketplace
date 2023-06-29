
import { MapLayerMouseEvent } from 'mapbox-gl'
import { useEffect, useRef, useState, memo } from 'react';
import Mapbox, { Source, Layer, FullscreenControl, AttributionControl, NavigationControl, ScaleControl, GeolocateControl, useControl } from 'react-map-gl'
import { useDispatch } from 'react-redux';
import { IBuilding } from '../../interfaces';
import { getMarketplaceBuildingsAction } from '../../store/marketplace/async.func';
import { marketplaceService } from '../../services/marketplace.service';
import GeocoderControl from './Geocoder';
import { handleShowModal } from '../../utils/showModal';
import { NFT_MAP_VIEW } from '../../constants';
import Modal from '../../components/modal/Modal';
import StreetView from './StreetView';
import Button from '../../components/button/Button';
import turf from '@turf/turf'
import Geocode from 'react-geocode'

Geocode.setApiKey('AIzaSyASQy-lj_qEU3g4G3D-J1jW00jagKYq91M')
const colors = [
    '#ff1e4f',
    '#fafaa0',
    '#e9823a',
    '#99c17b',
    '#f9127a',
    '#afe854',
]
const MapboxDeckView = () => {

    const dispatch = useDispatch()
    const [viewType, setViewType] = useState<string>("2d")
    const [buildingsArr, setBuildings] = useState<Array<IBuilding>>([]);
    const [openStreetView, setStreetView] = useState(false);
    const toggleStreetView = () => setStreetView((prevState) => !prevState);
    const [buildingData, setBuilding] = useState<any>();

    const mapRef = useRef<any>(undefined)

    useEffect(() => {
        fetch()
    }, [])

    useEffect(() => {
        if (mapRef.current) {
            console.log("mapref:-=-=", mapRef.current)

            let source = mapRef.current.getSource('own_source')
            if (source) {
                let feat = source._data.features
                console.log("features:-=-=-= useEfec:-=-=", feat)
                // for (let f of feat){
                //     mapRef.current.setPaintProperty("building-extrusion", "fill-extrusion-color", ['set', '#ff1e4f'])
                // }
            }
        }
    }, [mapRef?.current])

    const fetch = async () => {
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

                // for (let b of buildings) {
                //     if (b.location && b.location.lat && b.location.lng) {
                //         Geocode.fromLatLng(b.location.lat, b.location.lng).then(
                //             (response) => {

                //                 const address = response.results[0].formatted_address;
                //                 console.log("Geocode aress:-=-==", address, "building address:-=-=", b.address, "response.results[0]:-=-=", response.results[0]);
                //             },
                //             (error) => {
                //                 console.error(error);
                //             }
                //         );
                //     }
                // }

                if (rest.current_page > 1)
                    setBuildings([...buildingsArr, ...buildings]);
                else setBuildings(buildings);
            }
        }
        catch (error) {
            return {
                "type": "FeatureCollection",
                "features": []
            }
        }
    }

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

        try {
            const { lat, lng } = evt.lngLat

            console.log("selec:-=-=", selectedFeatures)

            const response = await marketplaceService.getMapBuilding(lat, lng);
            const responseData = response.data;
            let buildingLayerId = selectedFeatures[0]?.layer?.id;
            const nftResponse = await marketplaceService.getByLocationId(buildingLayerId.split('_')[0]);

            const resp = nftResponse.data.data;

            if (resp) {
                let data: any = {}
                if (resp.name === "ListingPlaced")
                    data = { ...responseData?.features[0], ...resp.nft, ...resp }
                else data = { ...responseData?.features[0], ...resp }
                setBuilding(data)
                handleShowModal(NFT_MAP_VIEW, {
                    toggleStreetView: toggleStreetView,
                    onClose: () => { setBuilding(undefined) },
                    nft: data
                })
            }
        } catch (error) {
            console.log(error)
        }
    }





    return (
        <div className="  min-h-[calc(100vh-120px)] flex justify-center items-center relative">

            <Modal show={openStreetView} hide={toggleStreetView}>
                <StreetView address={buildingData?.address} lat={buildingData?.location?.lat} lng={buildingData?.location?.lng} />
            </Modal>
            {buildingsArr && buildingsArr.length > 0 ?
                (<Mapbox
                    ref={mapRef}
                    initialViewState={{
                        longitude: -0.141099,
                        latitude: 51.515419,
                        zoom: 18,
                        // width: `100vh`
                    }}
                    style={{ width: "100vw", height: "100vh" }}
                    // mapStyle="mapbox://styles/mapbox/streets-v12"
                    // interactiveLayerIds={ids()}
                    mapStyle={viewType === '3d' ? "mapbox://styles/gameree/cldtzuw4x000c01l8hzcqil9m" : "mapbox://styles/mapbox/streets-v12"}
                    mapboxAccessToken='pk.eyJ1IjoiZ2FtZXJlZSIsImEiOiJjbDVqaWk3aDUwMGdqM2NxcjZoMGhjanprIn0.vvzASm5oVT3sGtBNakNSQg'
                    onClick={onClickMap}
                >
                    <Button onClick={() => setViewType(viewType === '3d' ? "2d" : "3d")}>Click here for {viewType === '3d' ? "2d" : "3d"}</Button>
                    {viewType === "3d" ? <Source3d buildings={buildingsArr} /> : <Source2d buildings={buildingsArr} />}


                    <FullscreenControl />
                    <NavigationControl />
                    <ScaleControl position='top-left' />
                    <GeolocateControl />
                    {/* <GeocoderControl mapboxAccessToken={'pk.eyJ1IjoiZ2FtZXJlZSIsImEiOiJjbDVqaWk3aDUwMGdqM2NxcjZoMGhjanprIn0.vvzASm5oVT3sGtBNakNSQg'} position="top-left" /> */}
                    {/* <AttributionControl compact={true} /> */}
                </Mapbox>
                )
                :
                null}
        </div>
    )
}


const Source2d = memo(function Source2d({ buildings }: { buildings: Array<IBuilding> }) {
    let colorIndex = 0
    console.log("2 d =-====")
    return <>
        {buildings.map((b: IBuilding, i: number) => {

            let col = colors[colorIndex]
            colorIndex++
            if (colorIndex === 6) colorIndex = 0
            return (
                b.geometry ? <Source key={i} id={`${b._id}_source`} type="geojson" data={{
                    type: "FeatureCollection",
                    features: [
                        {
                            type: "Feature",
                            geometry: {
                                type: "MultiPolygon",
                                coordinates: [[JSON.parse(b.geometry)]]
                            },
                            properties: {
                                id: "asd"
                            }
                        }
                    ]
                }}>
                    {/* <>
                        <Layer
                            {...{
                                id: `${b._id}_fill`,
                                type: "fill",
                                source: `${b._id}_source`,
                                paint: {
                                    "fill-color": col,
                                    'fill-opacity': 0.4
                                },
                                filter: ['==', '$type', 'Polygon']
                            }}
                        />
                        <Layer

                            id={`${b._id}_outline`}
                            type='line'
                            source={`${b._id}_source`}
                            // layout: { }
                            paint={{
                                'line-color': '#000',
                                'line-width': 3
                            }}

                        />
                    </> */}

                </Source> : null
            )

        })
        }
    </>
})

const Source3d = memo(function Source3d({ buildings }: { buildings: Array<IBuilding> }) {
    let colorIndex = 0

    let feat: Array<any> = []
    for (let i = 0; i < buildings.length; i++) {
        let b = buildings[i]
        if (b.geometry) {
            let obj = {
                type: "Feature",
                id: b._id,
                geometry: {
                    type: "MultiPolygon",
                    coordinates: [[JSON.parse(b.geometry)]]
                },
                properties: {
                    id: "asd"
                }
            }
            feat.push(obj)
        }

    }
    console.log("feature:-=-=-=", feat)
    // console.log("3 d =-====")
    return <>
        <Source id={`own_source`} type="geojson" data={{
            type: "FeatureCollection",
            features: feat as any
        }}></Source>
        {/* {buildings.map((b: IBuilding, i: number) => {
          
            let col = colors[colorIndex]
            colorIndex++
            if (colorIndex === 6) colorIndex = 0
            return (
                b.geometry ? */}


        {/* <Layer
                        {
                        ...{
                            id: `${b._id}_fill3d`,
                            type: "fill-extrusion",
                            source: `${b._id}_source`,
                            // "source-layer": `building-extrusion`,
                            paint: {
                                // 'fill-extrusion-color': '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'),
                                'fill-extrusion-color': col,
                                'fill-extrusion-height': 30
                            },

                            // paint: {
                            //     'fill-extrusion-color': '#B80AB8',

                            //     // use an 'interpolate' expression to add a smooth transition effect to the
                            //     // buildings as the user zooms in
                            //     // 'fill-extrusion-height': [
                            //     //     'interpolate',
                            //     //     ['linear'],
                            //     //     ['zoom'],
                            //     //     90,
                            //     //     20,
                            //     //     25.05,
                            //     //     15
                            //     // ],
                            //     // 'fill-extrusion-base': [
                            //     //     'interpolate',
                            //     //     ['linear'],
                            //     //     ['zoom'],
                            //     //     90,
                            //     //     20,
                            //     //     25.05,
                            //     //     15
                            //     // ],
                            //     // 'fill-extrusion-opacity': 0.6
                            // },
                            // // filter: ['==', '$type', 'Polygon'],
                            // filter: ['==', 'extrude', 'true'],
                        }
                        }
                    />

                </Source> : null
            )

        })
        } */}
    </>
})

export default MapboxDeckView