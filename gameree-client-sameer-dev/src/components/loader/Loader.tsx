import React from "react";
import { Rings } from "react-loader-spinner";

const Loader = ({ width, height }: any) => {
  return (
    <div className="inline-block">
      <Rings
        height={height ? height : "70"}
        width={width ? width : "70"}
        color="grey"
        ariaLabel="loading"
      />
    </div>
  );
};

export default Loader;
