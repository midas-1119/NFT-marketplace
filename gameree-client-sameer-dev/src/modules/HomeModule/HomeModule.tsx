import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Faqs from "../../components/Faqs/Faqs";
import { IBuilding } from "../../interfaces/marketplace.interface";
import {
  getMarketplaceFeaturedBuildingsAction,
  getMostFeaturedBuildingAction,
} from "../../store/marketplace/async.func";
import { selectRefetch } from "../../store/marketplace/selector";
import AwaitSection from "./Component/AwaitSection";
import Banner from "./Component/Banner";
import Benefits from "./Component/Benefits";
import CommingSoon from "./Component/CommingSoon";
import Community from "./Component/Community";
import GamreeAcademy from "./Component/GamreeAcademy";
import HomeSlider from "./Component/HomeSlider";
import RoadMap from "./Component/RoadMap";

const HomeModule = () => {
  const dispatch = useDispatch();
  const [buildings, setBuildings] = useState<IBuilding[]>([]);
  const [featuredBuilding, setFeaturedBuilding] = useState<IBuilding | null>(
    null
  );
  // const query = useRouter().query
  
  // useEffect(()=>{
  //   if( query.success === "true" ) {
      
  //   }
  // },[query])
 
  const fetchBuildings = async (page: number = 1) => {
    try {
      const response = await dispatch(getMarketplaceFeaturedBuildingsAction());
      if (response.meta && response.meta.requestStatus === "fulfilled") {
        setBuildings(response.payload);
      }
    } catch (err: any) {
      console.log(err.request.statusCode);
    }
  };

  const fetchBuilding = async (page: number = 1) => {
    try {
      const response = await dispatch(getMostFeaturedBuildingAction());
      if (response.meta && response.meta.requestStatus === "fulfilled") {
        setFeaturedBuilding(response.payload);
      }
    } catch (err: any) {
      console.log(err.request.statusCode);
    }
  };

  useEffect(() => {
    fetchBuildings();
    fetchBuilding();
  }, []);

  const removeItemFromCurrentList = async (index: number) => {
    const newArr = [...buildings];
    newArr.splice(index, 1);
    setBuildings(newArr);
  };
  return (
    <div>
      <Banner building={featuredBuilding} />
      <AwaitSection />
      <HomeSlider
        buildings={buildings}
        removeItemFromCurrentList={removeItemFromCurrentList}
      />
      <Benefits />
      <RoadMap />
      <GamreeAcademy />
      <CommingSoon />
      <Faqs />
      <Community />
    </div>
  );
};

export default HomeModule;
