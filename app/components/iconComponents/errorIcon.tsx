import { IconProps } from "@/constants/types";
import React, { FunctionComponent } from "react";

const ErrorIcon: FunctionComponent<IconProps> = ({ color, width }) => {
  return (
    <svg
      width={width}
      height={width}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_219_3679)">
        <path
          d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM12.2 10.8L10.8 12.2L8 9.4L5.2 12.2L3.8 10.8L6.6 8L3.8 5.2L5.2 3.8L8 6.6L10.8 3.8L12.2 5.2L9.4 8L12.2 10.8Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_219_3679">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ErrorIcon;
