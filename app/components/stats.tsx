"use client";

import React, { FunctionComponent } from "react";
import styles from "../styles/components/stats.module.css";

type StatsProps = {
  isConnected: boolean;
};

const Stats: FunctionComponent<StatsProps> = ({ isConnected }) => {
  const remainingClicks: number = 0;
  const timeClicked: number = 0;
  const totalParticipants = 126702;

  //todo: add a function that will get totalParticipants and time clicked

  return (
    <div className={styles.statsSections}>
      <div className={styles.statsSection}>
        <p>Time clicked</p>
        <p>{timeClicked !== 0 ? timeClicked.toLocaleString("en-US") : "--"}</p>
      </div>
      <div className={styles.statsSection}>
        <p>Total participants</p>
        <p>{totalParticipants.toLocaleString("en-US")}</p>
      </div>
      {isConnected ? (
        <div className={styles.statsSection}>
          <p>Click number</p>
          <p>
            {remainingClicks !== 0
              ? remainingClicks.toLocaleString("en-US")
              : "--"}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default Stats;
