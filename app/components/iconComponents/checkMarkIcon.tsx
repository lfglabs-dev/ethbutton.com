import { IconProps } from "@/constants/types";
import React, { FunctionComponent } from "react";

const CheckMarkIcon: FunctionComponent<IconProps> = ({ color, width }) => {
  return (
    <svg
      width={width}
      height={width}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.00091 10.8001L3.20091 8.00007L2.26758 8.9334L6.00091 12.6667L14.0009 4.66673L13.0676 3.7334L6.00091 10.8001Z"
        fill={color}
      />
    </svg>
  );
};

export default CheckMarkIcon;
