"use client";

import React, { FunctionComponent } from "react";
import styles from "../styles/components/ethButton.module.css";

type EthButtonProps = {
  onClick: () => void;
  isFinished?: boolean;
};

const EthButton: FunctionComponent<EthButtonProps> = ({
  onClick,
  isFinished,
}) => {
  const click = () => {
    if (isFinished) return;
    onClick();
  };
  return (
    <div className={styles.base} onClick={click}>
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
