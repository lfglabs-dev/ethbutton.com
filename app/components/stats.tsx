"use client";

import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "../styles/components/stats.module.css";
import { ethers } from "ethers";
import { minifyAddress, shortenDomain } from "@/utils/stringService";
import { StarknetIdNavigator } from "starknetid.js";
import ClaimXTicket from "./claimXTicket";

type StatsProps = {
  isConnected: boolean;
  remainingClicks: number;
  totalClicks: number;
  totalPlayers: number;
  isFinished: boolean;
  currentWinner?: string;
  isLoaded: boolean;
  starknetIdNavigator: StarknetIdNavigator;
  address?: string;
  hasClaimedX?: boolean;
};

const Stats: FunctionComponent<StatsProps> = ({
  isConnected,
  remainingClicks,
  totalClicks,
  totalPlayers,
  isFinished,
  currentWinner,
  isLoaded,
  starknetIdNavigator,
  address,
  hasClaimedX,
}) => {
  const [lastWinner, setLastWinner] = useState<string | undefined>(undefined);

  useEffect(() => {
    getAddrOrName(currentWinner as string).then((name) => {
      setLastWinner(name);
    });
  }, [currentWinner]);

  const getExplorerLink = (address: string) => {
    ethers.isAddress(address)
      ? `https://etherscan.io/address/${address}`
      : `https://starkscan.co/contract/${address}`;
  };

  const getAddrOrName = (addr: string): Promise<string> => {
    if (ethers.isAddress(addr)) {
      // It's a eth addr
      return fetch(`https://enstate.rs/n/${addr}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.name) return shortenDomain(data.name);
          else return minifyAddress(addr, true);
        })
        .catch(() => {
          return minifyAddress(addr, true);
        });
    } else {
      // It's a starknet addr
      return starknetIdNavigator
        .getStarkName(addr)
        .then((name) => {
          if (name) return shortenDomain(name);
          else return minifyAddress(addr, true);
        })
        .catch(() => {
          return minifyAddress(addr, true);
        });
    }
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
          <p>Available clicks</p>
          <p>{isLoaded ? remainingClicks.toLocaleString("en-US") : "--"}</p>
        </div>
      ) : null}
      <ClaimXTicket
        isConnected={isConnected}
        isFinished={isFinished}
        hasClaimedX={hasClaimedX}
        address={address}
      />
      {!isFinished && lastWinner ? (
        <div className={styles.statsSection}>
          <p>Current winner</p>
          <div className={styles.winnerWrapper}>
            <div className={styles.winnerSection} style={{ margin: "auto" }}>
              {lastWinner}
            </div>
          </div>
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
