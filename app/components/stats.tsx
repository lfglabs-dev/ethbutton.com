"use client";

import React, { FunctionComponent } from "react";
import styles from "../styles/components/stats.module.css";
import { ethers } from "ethers";
import { minifyAddress } from "@/utils/stringService";

type StatsProps = {
  isConnected: boolean;
  remainingClicks: number;
  totalClicks: number;
  totalPlayers: number;
  isFinished: boolean;
  currentWinner?: string;
};

const Stats: FunctionComponent<StatsProps> = ({
  isConnected,
  remainingClicks,
  totalClicks,
  totalPlayers,
  isFinished,
  currentWinner,
}) => {
  const getExplorerLink = (address: string) => {
    ethers.isAddress(address)
      ? `https://etherscan.io/address/${address}`
      : `https://starkscan.co/contract/${address}`;
  };
  return (
    <div className={styles.statsSections}>
      <div className={styles.statsSection}>
        <p>Time clicked</p>
        <p>{totalClicks !== 0 ? totalClicks.toLocaleString("en-US") : "--"}</p>
      </div>
      <div className={styles.statsSection}>
        <p>Total participants</p>
        <p>{totalPlayers.toLocaleString("en-US")}</p>
      </div>
      {isConnected && !isFinished ? (
        <div className={styles.statsSection}>
          <p>Click number</p>
          <p>
            {remainingClicks !== 0
              ? remainingClicks.toLocaleString("en-US")
              : "--"}
          </p>
        </div>
      ) : null}
      {isFinished ? (
        <div className={styles.statsSection}>
          <p>Reward</p>
          <p>5 ETH</p>
        </div>
      ) : null}

      {isFinished ? (
        <div className={styles.winnerWrapper}>
          <div className={styles.winnerSection}>
            <p>
              Congratulations! The winner will receive their funds at this
              address
            </p>
            <div
              className="cursor-pointer flex flex-row items-center gap-3"
              onClick={() => getExplorerLink(currentWinner as string)}
            >
              <p>{minifyAddress(currentWinner)}</p>
              <img alt="arrow icon" src="/visuals/arrowIcon.svg" width={15} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Stats;
