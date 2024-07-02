"use client";

import React, { FunctionComponent } from "react";
import styles from "../styles/components/button.module.css";
import { CircularProgress, useMediaQuery } from "@mui/material";

type ButtonProps = {
  onClick?: () => void;
  children: string;
  icon?: React.ReactNode;
  width?: number;
  height?: number;
  loading?: boolean;
  variation?: string;
};

const Button: FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  icon,
  width,
  height,
  loading = false,
  variation = "default",
}) => {
  const iconColor = variation === "default" ? "#4C6449" : "#1E2A3B";
  const isSmall = useMediaQuery("(max-width: 1280px and min-width: 491px)");
  const isXtraSmall = useMediaQuery("(max-width: 490px)");

  return (
    <div
      className={`${styles.btnContainer} ${styles[variation]} ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
      style={{
        width: `${
          width
            ? width + "px"
            : isSmall
            ? "200px"
            : isXtraSmall
            ? "150px"
            : "230px"
        } `,
        height: `${height ? height + "px" : isXtraSmall ? "30px" : "42px"} `,
      }}
    >
      <div className={styles.content}>
        {loading || icon ? (
          <div className={styles.btnIcon}>
            {loading ? (
              <CircularProgress size={24} sx={{ color: iconColor }} />
            ) : (
              icon
            )}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
};

export default Button;
