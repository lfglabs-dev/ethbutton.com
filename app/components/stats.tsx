"use client";

import React, { FunctionComponent } from "react";
import styles from "../styles/components/stats.module.css";

type StatsProps = {};

const Stats: FunctionComponent<StatsProps> = ({}) => {
  const clickNumber: number = 0;
  const timeClicked: number = 0;
  const totalParticipants = 126702;

  return (
    <div className={styles.statsSections}>
      <div className={styles.statsSection}>
        <p>Click number</p>
        <p>{clickNumber !== 0 ? clickNumber.toLocaleString("en-US") : "--"}</p>
      </div>
      <div className={styles.statsSection}>
        <p>Time clicked</p>
        <p>{timeClicked !== 0 ? timeClicked.toLocaleString("en-US") : "--"}</p>
      </div>
      <div className={styles.statsSection}>
        <p>Total participants</p>
        <p>{totalParticipants.toLocaleString("en-US")}</p>
      </div>
    </div>
  );
};

export default Stats;
