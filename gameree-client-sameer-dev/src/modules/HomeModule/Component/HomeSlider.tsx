import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import Card from "../../../components/card/Card";
import { IBuilding } from "../../../interfaces/marketplace.interface";
import { useSelector } from "react-redux";
import { selectUser } from "../../../store/auth/selector";
import { getBNBRate, getEthRate } from "../../../metamask/metamask";

interface IProps {
  buildings: IBuilding[];
  removeItemFromCurrentList: ( index: number ) => void;
}
const HomeSlider = ({ buildings,removeItemFromCurrentList }: IProps) => {
  const user = useSelector(selectUser)

  const [rate, setRate] = useState(0);
  const [rateETH, setETHRate] = useState(0);
  const [currType, setCurrencyType] = useState<string>("USDG");

  useEffect(() => {
    const storedValue = localStorage.getItem("currType");
    if (storedValue !== null) {
      setCurrencyType(storedValue);
    }
  }, []); // empty dependency array, so this effect only runs once on mount

  const getBnbRe = async () => {
    const response = await getBNBRate();
    if (response) {
      setRate(response);
    }
  };
  const getETHR = async () => {
    const response = await getEthRate();
    if (response) {
      setETHRate(response);
    }
  };

  useEffect(() => {
    getBnbRe();
    getETHR();
  }, []);
 
  return (
    <div className="container myslide relative sm:py-[10rem] py-[5rem]">
      <div className="flex justify-center items-center">
        <h2 className="Headings font-TTTrailers-SemiBold text-center mb-[3.188rem]   border-b-[11px] border-purples">
          FEATURED NFTS
        </h2>
      </div>
      <Swiper
      className=""
        style={{ position: "unset" }}
        modules={[Navigation, Pagination, Autoplay, Scrollbar]}
        navigation={true}
        spaceBetween={30}
        slidesPerView={4}
        // autoplay={true}
        onClick={()=>{
          
        }}
        autoplay= {{
          disableOnInteraction: true,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 40,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 50,
          },
          1020: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1380: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1536: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1736: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
        }}
      >
        {buildings.map((building,index: number) => (
          <SwiperSlide key={building._id} className="">
            <Card
              id={building._id}
              key={building._id}
              index={index}
              nft={building}
              user={user}
              removeItemFromCurrentList={removeItemFromCurrentList}
              currType={currType}
              rate={currType === "BNB" ? rate : currType === "ETH" ? rateETH : 1}

            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeSlider;
