import { IconProps } from "@/constants/types";
import React, { FunctionComponent } from "react";

const CloseIcon: FunctionComponent<IconProps> = ({ color, width }) => {
  return (
    <svg
      width={width}
      height={width}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.20917 10.5754L6.2485 7.61472L3.06007 10.8031C2.83233 11.0309 1.9669 11.9874 1.23812 11.2586C0.554887 10.5754 1.23812 9.43667 1.46586 9.20893L4.65429 6.02051L1.69361 3.05983C1.38995 2.75617 0.281594 1.73891 1.01038 1.01013C1.92135 0.0991549 2.98416 1.16196 3.28782 1.46562L6.2485 4.4263L9.20917 1.46562C9.66466 1.01013 10.5301 0.509094 11.2589 1.23788C11.9877 1.96666 11.0311 2.83209 10.8034 3.05983L7.84271 6.02051L10.8034 8.98118C11.107 9.28484 12.1698 10.3477 11.2589 11.2586C10.5301 11.9874 9.51283 10.8791 9.20917 10.5754Z"
        fill={color}
      />
    </svg>
  );
};

export default CloseIcon;
