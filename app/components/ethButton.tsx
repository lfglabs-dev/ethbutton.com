"use client";

import React, { FunctionComponent } from "react";
import styles from "../styles/components/ethButton.module.css";

type EthButtonProps = {
  onClick: () => void;
};

const EthButton: FunctionComponent<EthButtonProps> = ({ onClick }) => {
  return (
    <div className={styles.base} onClick={onClick}>
      <div className={styles.innerCircle}>
        <div className={styles.content}>
          <img src="/visuals/ethereumIcon.svg" alt="ethereum icon" />
          <p>PRESS</p>
        </div>
      </div>
    </div>
  );
};

export default EthButton;
