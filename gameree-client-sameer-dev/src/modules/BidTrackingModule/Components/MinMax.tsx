import Input from "../../../components/input/Input";

const MinMax = ({ placeholder, value, onChange,id }: any) => {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      id={id}
      onChange={onChange}
      type="number"
      className="w-full border border-[#384E69] !py-4 bg-transparent !rounded-xl text-sm font-Montserrat-Medium placeholder-[#557C9A]"
    />
  );
};
export default MinMax;
