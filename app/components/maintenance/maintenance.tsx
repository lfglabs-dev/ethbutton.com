"use client";

import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "../../styles/home.module.css";
import statsStyle from "../../styles/components/stats.module.css";
import VideoBackground from "../videoBackground";
import { Skeleton } from "@mui/material";
import Button from "../button";
import { minifyAddress } from "@/utils/stringService";
import { ethers } from "ethers";
import CountdownWithHours from "../countdownWithHours";
import { useContractRead } from "@starknet-react/core";
import ethbutton_abi from "../../../abi/ethbutton.json";
import { Abi } from "starknet";
import { decimalToHex } from "@/utils/feltService";

type MaintenanceProps = {
  isLoaded: boolean;
  isMobile: boolean;
  priceValue: string | undefined;
};

const Maintenance: FunctionComponent<MaintenanceProps> = ({
  isLoaded,
  isMobile,
  priceValue,
}) => {
  const [currentWinner, setCurrentWinner] = useState<string | undefined>();
  const { data: winnerData, error } = useContractRead({
    address: process.env.NEXT_PUBLIC_ETH_BUTTON_CONTRACT,
    abi: ethbutton_abi.abi as Abi,
    functionName: "get_last_clicker",
    args: [],
  });

  useEffect(() => {
    if (!winnerData || error) return;
    setCurrentWinner(decimalToHex(winnerData as string));
  }, [winnerData, error]);

  const getExplorerLink = (address: string) => {
    ethers.isAddress(address)
      ? `https://etherscan.io/address/${address}`
      : `https://starkscan.co/contract/${address}`;
  };

  return (
    <main className={styles.main}>
      <VideoBackground />
      <div className={styles.leftContainer}>
        <>
          {!isLoaded ? (
            <Skeleton
              variant="rectangular"
              width={120}
              height={25}
              className="mx-auto"
            />
          ) : priceValue ? (
            isMobile ? (
              <div className={styles.ethPrice}>
                <img src="/visuals/eth.svg" width={14} />
                {priceValue}
              </div>
            ) : (
              <Button
                icon={<img src="/visuals/eth.svg" width={14} />}
                enableHover={false}
              >
                {priceValue}
              </Button>
            )
          ) : null}
        </>
      </div>
      <div className={styles.centralSection}>
        <div className={styles.backgroundWrapper}>
          <h1 className={styles.maintenanceTitle}>
            MAINTENANCE <span className={styles.pinkTitle}>IN</span>
            <br />
            <span className={styles.blueTitle}>PROGRESS</span>
          </h1>
          <div className={styles.countdownContainer}>
            <CountdownWithHours
              timestamp={
                parseInt(
                  process.env.NEXT_PUBLIC_MAINTENANCE_END_MS as string
                ) ?? 0
              }
              isLoaded={isLoaded}
            />
          </div>
        </div>
      </div>
      <div className={statsStyle.statsSections}>
        {currentWinner ? (
          <>
            <div className={styles.statsSection}>
              <p>Last click</p>
            </div>
            <div className={statsStyle.winnerWrapper}>
              <div className={statsStyle.winnerSection}>
                <div
                  className="cursor-pointer flex flex-row items-center gap-3"
                  onClick={() => getExplorerLink(currentWinner as string)}
                >
                  <p>{minifyAddress(currentWinner, true)}</p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
};

export default Maintenance;
