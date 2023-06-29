import Geocode from 'react-geocode'
const ReactStreetview =  require('react-streetview')
// const GoogleStreetview =  require('react-google-streetview')

import { useEffect, useState } from 'react'

const StreetView = (props: any) => {
  console.log('props', props)

  const address = props.address
  const [loadStreet, setLoad] = useState(false)
  const googleMapsApiKey = 'AIzaSyASQy-lj_qEU3g4G3D-J1jW00jagKYq91M'
  // const googleMapsApiKey = 'AIzaSyDLMIYrIj_9g32DKSnb9Qr43RLXuT5YiCM'
  
  const [optionsState, setOptions] = useState({
    position: {
      lat: 51.5157332,
      lng: -0.1377451,
    },
    pov: { heading: 0, pitch: 0 },
    zoom: 0,
  })

  // useEffect(()=>{
  //   setOptions({
  //     position: {
  //       lat: props.lat,
  //       lng: props.lng
  //     },
  //     pov: { heading: 0, pitch: 0 },
  //     zoom: 0,
  //   })
  //   if( props.lat && props.lng ) setLoad(true)
  // },[props])
  useEffect(() => {
    Geocode.setApiKey(googleMapsApiKey)

    Geocode.setLanguage('en')
    Geocode.setRegion('uk')
    /**
     *  GeoCode to get the location from the google
     *
     * */

    Geocode.fromAddress(address).then(
      (response: any) => {
        // const { lat, lng } = response.results[0].geometry.location
        const myLatLng = response.results[0].geometry.location

        let newLng : any ;
        let newLat : any ;
        let newheading : any ;
        let LatLng : any ;

        // console.log("address from the Mapbox Rec", address);

        const google = window.google

        /**
         *  Using Direction service to get the Driver View from the point of location
         * */
        console.log("google:-=-=-=", google)
        if (!google) return
        const directionsService = new google.maps.DirectionsService()
        directionsService.route(
          {
            origin: address,
            destination: address,
            travelMode: google?.maps?.TravelMode?.DRIVING,
          },
          (result: any, status: any ) => {
            if (status === google.maps.DirectionsStatus.OK) {
              LatLng = result.routes[0].legs[0].start_location

              /***
               *  gets the results of the langitude and latitude from the start of the position as A driver and using it in
               *
               * but fails on Holland & Barrett on arch branch
               * **/

              // const ultra_lat = LatLng.lat()
              // const ultra_lng = LatLng.lng()

              /**
               *  Use of Street View Service to get the panaroma shot
               * */

              var sv = new google.maps.StreetViewService()
              const radius = 100
              sv.getPanorama(
                {
                  location: LatLng,
                  preference: google.maps.StreetViewPreference.NEAREST,
                  radius: radius,
                  source: google.maps.StreetViewSource.OUTDOOR,
                },
                function (g: any, t: any) {
                  if (t == google.maps.StreetViewStatus.OK) {
                    newLng = g.location.latLng.lng()
                    newLat = g.location.latLng.lat()
                  }
                  /**
                   *  Computing the heading as the rotation for the streetView
                   * */

                  newheading = google.maps.geometry.spherical.computeHeading(g.location.latLng, myLatLng)

                  setOptions({
                    ...optionsState,
                    pov: { heading: newheading, pitch: 0 },
                    position: {
                      lat: newLat,
                      lng: newLng,
                      // lat: ultra_lat,
                      // lng: ultra_lng,
                      // lat: lat,
                      // lng: lng,
                    },
                  })

                  setLoad(true)
                }
              )
            } else {
              console.error('error fetching directions', result, status)
            }
          }
        )
      },

      (error: any) => {
        console.error(error)
      }
    )
    console.log("props:-=-=-", props)
  }, [props])

  return (
    <div className="sm:w-[44.125rem] w-full">
    <div className="row">
      <div className="text-center">
        <div
          className=""
          style={{
            width: '100%',
            height: '450px',
            backgroundColor: '#eeeeee',
          }}
        >
          {loadStreet == true ? (
            <ReactStreetview apiKey={googleMapsApiKey} streetViewPanoramaOptions={optionsState}></ReactStreetview>
          ) : (
            <div>Loading ...</div>
          )}
        </div>
      </div>
    </div>
    </div>
  )
}
export default StreetView
