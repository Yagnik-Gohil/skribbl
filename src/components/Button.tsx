import React from "react";

const Button = ({
  name,
  className,
  onClick,
  style,
  disabled = false,
}: {
  name: string;
  className: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  style?: React.CSSProperties;
  disabled?: boolean;
}) => {
  return (
    <button name={name} className={className} onClick={onClick} style={style} disabled={disabled}>
      {name}
    </button>
  );
};

export default Button;
