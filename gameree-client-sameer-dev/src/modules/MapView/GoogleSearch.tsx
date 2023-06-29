import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-google-places-autocomplete";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import Modal from "../../components/modal/Modal";

mapboxgl.accessToken = `pk.eyJ1IjoiaGFzZWViYWJiYXNpMDAiLCJhIjoiY2wyejVqcWVsMDkzcjNjbDdocWI4dzA0cSJ9.mB8mVHePsaB0wmqbIE9f1Q`;

const GoogleSearch = (props: any) => {
  const {
    MapNavigate,
    address,
    status,
    toggleModalSearch,
    setAddress,
    markers,
    setMarkers,
    setPopup,
  } = props;

  return (
    <>
      <div>
        <Modal
          show={status}
          hide={toggleModalSearch}
          className="Modalbackgrond !pb-10"
        >
          <div className="sm:w-[35.125rem] !pb-10 w-full">
            <div className="rounded-[2.8rem] bg-black1 py-4 px-8 relative ">
              <i
                className="icon-cross text-white absolute text-2xl top-[50%] -translate-y-1/2 right-8 cursor-pointer "
                onClick={() => {
                  console.log("clicked here ");
                }}
              ></i>
              <h3 className="text-5xl">Search Area</h3>
            </div>
            <div className="bg-[#C164E2] rounded-[2.8rem] text-center mb-8">
              <div className="mt-8">
                <GooglePlacesAutocomplete
                  apiKey="AIzaSyBxZ5mUOwo3CUldbWrsKCZyeVJVffyP8AU"
                  minLengthAutocomplete={3}
                  //   onChange={() => {}}
                  selectProps={{
                    isClearable: true,
                    value: address,
                    onChange: (val: any) => {
                      setAddress(address);

                      const func = async () => {
                        const geocodeObj =
                          val &&
                          val.value &&
                          (await geocodeByPlaceId(val.value.place_id));
                        if (geocodeObj) {
                          markers?.forEach((marker: any) => marker.remove());

                          const place = geocodeObj[0];
                          /**
                           *  markers and flying to view searched building
                           * */
                          const popUp = new mapboxgl.Popup({ offset: 25 }) // add popups
                            .setHTML(
                              `<h3>${place.types[0]}</h3><p>${place.formatted_address}</p>`
                            );
                          const el = document.createElement("div");
                          el.className = "marker";
                          const marker = new mapboxgl.Marker(el)
                            .setLngLat([
                              place.geometry.location.lng(),
                              place.geometry.location.lat(),
                            ])
                            .setPopup(popUp)
                            .addTo(MapNavigate);

                          setMarkers([...markers, marker]);

                          MapNavigate.flyTo({
                            pitch: 0,
                            zoom: 18,
                            center: [
                              place.geometry.location.lng(),
                              place.geometry.location.lat(),
                            ],
                          });
                          setAddress("");
                          /**
                           *  markers and flying to view searched building
                           * */
                        }
                      };

                      func();
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};
export default GoogleSearch;
