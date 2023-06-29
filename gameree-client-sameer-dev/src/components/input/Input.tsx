import InputError from "./InputError";

interface Iprops {
  placeholder: string;
  className?: string;
  type?: string;
  spanClass?: string;
  name?: string;
  rest?: any;
  register?: any;
  value?: any;
  onChange?: Function;
  max?: any;
  min?: any;
  step?: any;
  prefix?: any;
  pattern?: any;
  title?: string;
  disabled?: boolean;
  error?: any;
  autoFocus?: boolean;
  onBlur?: any;
  maxLength?: any;
  readOnly?: boolean;
  required?: boolean;
  id?: string;
}

const Input = ({
  placeholder,
  className,
  value,
  onChange,
  type,
  register,
  max,
  min,
  step,
  prefix,
  pattern,
  title,
  disabled,
  error,
  autoFocus,
  required,
  ...rest
}: Iprops) => {
  return (
    <>
      <input
        required={required}
        type={type ? type : "text"}
        className={`input-text text-[#A7A7A7] w-full  outline-none bg-transparent py-7 px-6 border-2 border-black1 !rounded-2xl  text-xl placeholder:text-[#A7A7A7] placeholder:pt-3  ${className}`}
        pattern={pattern}
        max={max}
        step={step && step}
        title={title}
        min={min}
        value={value}
        onChange={onChange}
        {...(register !== undefined && { ...register(rest.name) })}
        placeholder={placeholder}
        prefix={prefix ? prefix : ""}
        disabled={disabled}
        {...rest}
      />
      {error && <InputError error={error} />}
    </>
  );
};

export default Input;
