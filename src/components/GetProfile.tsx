import React from "react";

const GetProfile = ({
  emoji,
  className,
}: {
  emoji: string;
  className: string;
}) => {
  return <div className={className + " select-none"}>{emoji}</div>;
};

export default GetProfile;
