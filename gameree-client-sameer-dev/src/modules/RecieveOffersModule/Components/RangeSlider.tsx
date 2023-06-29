import React, { useEffect, useState } from "react";
import Slider from "react-rangeslider";
import { useDispatch, useSelector } from "react-redux";
import { marketplaceActions } from "../../../store/marketplace/marketplace";

const RangeSlider = () => {
  const [value, setValue] = useState(0);

  const dispatch = useDispatch()
  const debouncedSearchTerm: any = useDebounce(value, 500);

  useEffect(
    () => {
      if (debouncedSearchTerm) {
        dispatch(marketplaceActions.priceRange(debouncedSearchTerm));
      }
    },
    [debouncedSearchTerm] // Only call effect if debounced search term changes
  );


  const handleChange = (value: any) => {
    setValue(value);
  };
  return (
    <div className="slider">
      <Slider
        min={0}
        max={10}
        tooltip={true}
        value={value}
        step={1}
        onChange={handleChange}
      />
      <div className="flex justify-between gap-4 -mt-2 text-sm  ">
        <p className="text-white text-sm font-Montserrat-SemiBold">0 BNB</p>
        <p className="text-white text-sm font-Montserrat-SemiBold">
          {value} BNB
        </p>
      </div>
    </div>
  );
};

export default RangeSlider;
// Hook
function useDebounce(value: any, delay: any) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}