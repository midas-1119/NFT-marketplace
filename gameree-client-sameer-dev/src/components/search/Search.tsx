import React from "react";
import { RiSearchLine } from "react-icons/ri";

interface IProps {
  placeholder: string;
  inputClass?: string;
  parentClass?: string;
  iconClass?: string;
  hide?: any;
  onChange?: any;
  value?: any;
  setSearchTerm?: any;
}
const Search = ({
  placeholder,
  inputClass,
  parentClass,
  iconClass,
  onChange,
  value,
  setSearchTerm
}: IProps) => {
  return (
    <div className={`relative  ${parentClass}`}>
      <input
        value={value}
        onChange={(e)=>{setSearchTerm(e.target.value)}}
        id="search"
        name="search"
        className={`text-primary  pl-8  py-6 pr-16 bg-transparent  w-full rounded-full focus:outline-none text-lg font-Montserrat-SemiBold border border-[#965D9D] ${inputClass}`}
        placeholder={placeholder}
        type="text"
      />
      <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
        <RiSearchLine className={` text-[#965D9D] text-2xl ${iconClass}`} />
      </div>
    </div>
  );
};
export default Search;
