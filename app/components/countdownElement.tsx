"use client";
import React, { FunctionComponent } from "react";
import styles from "../styles/components/countdownWithDays.module.css";

type CountDownElementProps = {
  time: string;
  legend: string;
  legendPlacement?: "top" | "bottom";
};

const CountDownElement: FunctionComponent<CountDownElementProps> = ({
  legend,
  time,
  legendPlacement = "top",
}) => {
  return (
    <div className="flex-col">
      {legendPlacement === "top" ? (
        <p className="text-center mb-1 text-base">{legend}</p>
      ) : null}
      <div className="flex gap-1">
        <div className={styles.countdownWrapper}>
          <div className={styles.countdown}>{time[0]}</div>
        </div>
        <div className={styles.countdownWrapper}>
          <div className={styles.countdown}>{time[1]}</div>
        </div>
      </div>
      {legendPlacement === "bottom" ? (
        <p className="text-center mt-1 text-base">{legend}</p>
      ) : null}
    </div>
  );
};

export default CountDownElement;
