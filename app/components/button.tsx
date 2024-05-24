"use client";

import React, { FunctionComponent } from "react";
import styles from "../styles/components/button.module.css";
import { CircularProgress } from "@mui/material";

type ButtonProps = {
  onClick: () => void;
  children: string;
  icon?: React.ReactNode;
  width?: number;
  loading?: boolean;
};

const Button: FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  icon,
  width = 0,
  loading = false,
}) => {
  return (
    <div
      className={styles.svgBorder}
      onClick={onClick}
      style={{ width: `${width ? width + "px" : "auto"} ` }}
    >
      <div className={styles.btnContainer}>
        {loading || icon ? (
          <div className={styles.btnIcon}>
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#4C6449" }} />
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
