"use client";

import React, { FunctionComponent } from "react";
import styles from "../styles/components/button.module.css";
import { CircularProgress } from "@mui/material";

type ButtonProps = {
  onClick?: () => void;
  children: string;
  icon?: React.ReactNode;
  width?: number;
  loading?: boolean;
  variation?: string;
};

const Button: FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  icon,
  width = 0,
  loading = false,
  variation = "default",
}) => {
  const iconColor = variation === "default" ? "#4C6449" : "#1E2A3B";
  return (
    <div
      className={`${styles.svgBorder} ${styles[variation]} ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
      style={{ width: `${width ? width + "px" : "auto"} ` }}
    >
      <div className={styles.btnContainer}>
        {loading || icon ? (
          <div className={styles.btnIcon}>
            {loading ? (
              <CircularProgress size={24} sx={{ color: iconColor }} />
            ) : (
              icon
            )}
          </div>
        ) : null}
        <div className={styles.btnText}>{children}</div>
      </div>
    </div>
  );
};

export default Button;
