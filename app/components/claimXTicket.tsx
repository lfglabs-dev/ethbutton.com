"use client";

import React, { FunctionComponent } from "react";
import Button from "./button";
import { getExtraTicket } from "@/utils/codeChallenge";
import styles from "../styles/components/stats.module.css";

type ClaimXTicketProps = {
  address?: string;
  isConnected: boolean;
  isFinished: boolean;
  hasClaimedX?: boolean;
  showClaimed?: boolean;
  width?: number;
};

const ClaimXTicket: FunctionComponent<ClaimXTicketProps> = ({
  address,
  isConnected,
  isFinished,
  hasClaimedX,
  showClaimed = true,
  width = 200,
}) => {
  return (
    <>
      {isConnected && !isFinished && hasClaimedX !== undefined && address ? (
        <div className={styles.statsSection}>
          <p>Get your extra ticket</p>
          {!hasClaimedX ? (
            <Button
              onClick={() => getExtraTicket(address)}
              icon={
                <img
                  src="/visuals/twitterIcon.svg"
                  alt="Twitter Icon"
                  width={20}
                />
              }
              width={width}
            >
              Retweet
            </Button>
          ) : showClaimed ? (
            <div className={styles.winnerWrapper}>
              <div className={styles.winnerSection} style={{ margin: "auto" }}>
                Already claimed
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default ClaimXTicket;
