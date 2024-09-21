import React from "react";

const Button = ({
  name,
  className,
  onClick,
}: {
  name: string;
  className: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return <button name={name} className={className} onClick={onClick}>{name}</button>;
};

export default Button;
