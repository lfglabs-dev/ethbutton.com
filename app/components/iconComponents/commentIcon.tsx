import { IconProps } from "@/constants/types";
import React, { FunctionComponent } from "react";

const CommentIcon: FunctionComponent<IconProps> = ({ color, width }) => {
  return (
    <svg
      width={width}
      height={width}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.6654 2.66634C14.6654 2.31272 14.5249 1.97358 14.2748 1.72353C14.0248 1.47348 13.6857 1.33301 13.332 1.33301H2.66536C2.31174 1.33301 1.9726 1.47348 1.72256 1.72353C1.47251 1.97358 1.33203 2.31272 1.33203 2.66634V10.6663C1.33203 11.02 1.47251 11.3591 1.72256 11.6091C1.9726 11.8592 2.31174 11.9997 2.66536 11.9997H11.9987L14.6654 14.6663V2.66634Z"
        fill={color}
      />
    </svg>
  );
};

export default CommentIcon;
