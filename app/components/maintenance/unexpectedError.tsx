"use client";

import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "../../styles/home.module.css";
import statsStyle from "../../styles/components/stats.module.css";
import VideoBackground from "../videoBackground";
import { Skeleton } from "@mui/material";
import Button from "../button";
import { minifyAddress } from "@/utils/stringService";
import { ethers } from "ethers";
import { useContractRead } from "@starknet-react/core";
import { Abi } from "starknet";
import ethbutton_abi from "../../../abi/ethbutton.json";
import { decimalToHex } from "@/utils/feltService";

type unexpectedErrorProps = {
  isLoaded: boolean;
  isMobile: boolean;
  priceValue: string | undefined;
};

const UnexpectedError: FunctionComponent<unexpectedErrorProps> = ({
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
            UNEXPECTED <span className={styles.pinkTitle}>ERROR</span>
            <br />
            <span className={styles.blueTitle}>OCCURRED</span>
          </h1>
          <div className={styles.unexpectedErrorContainer}>
            <div className={styles.unexpectedError}>
              An unexpected error has occurred. Your clicks have been recorded.
              Our team is working on a fix.
            </div>
            <div className={statsStyle.msgWrapper}>
              <div className={statsStyle.msgWrapperSection}>
                <div>More updates on our Twitter</div>
                <Button
                  onClick={() => window.open("https://x.com/Starknet_id")}
                  icon={<img src="/visuals/twitterIcon.svg" />}
                >
                  Go on Twitter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={statsStyle.statsSections}>
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
      </div>
    </main>
  );
};

export default UnexpectedError;
