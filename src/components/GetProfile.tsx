import React from "react";
import { RandomAvatar } from "react-random-avatar";

const GetProfile = ({ seed, size }: { seed: string; size: number }) => {
  return <RandomAvatar seed={seed} size={size} />;
};

export default GetProfile;
