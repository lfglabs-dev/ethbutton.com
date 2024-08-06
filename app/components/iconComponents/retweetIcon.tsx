import { IconProps } from "@/constants/types";
import React, { FunctionComponent } from "react";

const RetweetIcon: FunctionComponent<IconProps> = ({ color, width }) => {
  return (
    <svg
      width={width}
      height={width}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.99935 3.83301L6.83268 6.66634H4.66602V10.6663H8.99935L10.3327 11.9997H4.66602C4.31239 11.9997 3.97326 11.8592 3.72321 11.6091C3.47316 11.3591 3.33268 11.02 3.33268 10.6663V6.66634H1.16602L3.99935 3.83301ZM11.9993 12.1663L9.16602 9.33301H11.3327V5.33301H6.99935L5.66602 3.99967H11.3327C11.6863 3.99967 12.0254 4.14015 12.2755 4.3902C12.5255 4.64025 12.666 4.97939 12.666 5.33301V9.33301H14.8327L11.9993 12.1663Z"
        fill={color}
      />
    </svg>
  );
};

export default RetweetIcon;
