import React from "react";
import Footer from "./Components/footer/Footer";
import Header from "../Header/Header";
import { useRouter } from "next/router";

const Layout = ({ children }: any) => {
  const router = useRouter()

  return (
    <div>
      {!router.pathname.includes('mapview') &&<Header />}
      {children}
      {!router.pathname.includes('mapview') && <Footer />}
    </div>
  );
};

export default Layout;
