import React from "react";

const Input = ({
  placeholder,
  className,
  onChange,
  value,
  type,
}: {
  placeholder: string;
  className: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value: string | number | readonly string[] | undefined;
  type?: string;
}) => {
  return (
    <input
      placeholder={placeholder}
      className={className}
      type={type}
      onChange={onChange}
      value={value}
    ></input>
  );
};

export default Input;
