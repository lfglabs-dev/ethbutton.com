import { IconProps } from "@/constants/types";
import React, { FunctionComponent } from "react";

const CircledCheckMarkIcon: FunctionComponent<IconProps> = ({
  color,
  width,
}) => {
  return (
    <svg
      width={width}
      height={width}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_218_3084)">
        <g filter="url(#filter0_d_218_3084)">
          <circle
            cx="8"
            cy="8"
            r="7"
            stroke="url(#paint0_linear_218_3084)"
            strokeWidth="0.523359"
            shapeRendering="crispEdges"
          />
        </g>
        <path
          d="M7.10919 9.54938L5.68696 8.12716L5.21289 8.60123L7.10919 10.4975L11.1727 6.43404L10.6986 5.95996L7.10919 9.54938Z"
          fill={color}
        />
      </g>
      <defs>
        <filter
          id="filter0_d_218_3084"
          x="-14.9625"
          y="-13.9158"
          width="45.925"
          height="45.925"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1.04672" />
          <feGaussianBlur stdDeviation="7.85039" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.114484 0 0 0 0 0.368288 0 0 0 0 0.484155 0 0 0 0.24 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_218_3084"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_218_3084"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_218_3084"
          x1="4.68201"
          y1="55.7759"
          x2="23.1311"
          y2="51.6855"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#109AE4" />
          <stop offset="0.1063" stopColor="#27ABF1" />
          <stop offset="0.2375" stopColor="#2BAAEE" />
          <stop offset="0.3819" stopColor="#3BB1F0" />
          <stop offset="0.5356" stopColor="#7581F7" />
          <stop offset="0.6969" stopColor="#EF30A2" />
          <stop offset="0.8618" stopColor="#F276C0" />
          <stop offset="1" stopColor="#FFADDE" />
        </linearGradient>
        <clipPath id="clip0_218_3084">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default CircledCheckMarkIcon;
