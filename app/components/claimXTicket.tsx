"use client";

import React, { FunctionComponent, useEffect, useState } from "react";
import Button from "./button";
import { getExtraTicket } from "@/utils/codeChallenge";
import styles from "../styles/components/stats.module.css";
import { useSearchParams } from "next/navigation";
import { storeHasClaimedXTicket } from "@/services/localStorageService";
import Notification from "./notification";

type ClaimXTicketProps = {
  address?: string;
  isConnected: boolean;
  isFinished: boolean;
  hasClaimedX?: boolean;
  showClaimed?: boolean;
  width?: number;
  setHasClaimedX: (hasClaimedX: boolean) => void;
};

const ClaimXTicket: FunctionComponent<ClaimXTicketProps> = ({
  address,
  isConnected,
  isFinished,
  hasClaimedX,
  showClaimed = true,
  width = 200,
  setHasClaimedX,
}) => {
  const searchParams = useSearchParams();
  const claimXStatus = searchParams.get("success");
  const claimXError = searchParams.get("error_msg");
  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (!claimXStatus) return;
    if (claimXStatus === "true") {
      if (!hasClaimedX) {
        storeHasClaimedXTicket();
        setHasClaimedX(true);
      }
    } else if (claimXStatus === "false" && claimXError) {
      // show error message
      if ((claimXError as string).includes("already claimed")) {
        setHasClaimedX(true);
      }
      setErrorMsg(claimXError);
      setShowErrorMsg(true);
    }
  }, [claimXStatus, claimXError]);

  const closeErrorMsg = () => {
    setShowErrorMsg(false);
    setErrorMsg("");
  };

  return (
    <>
      {isConnected && !isFinished && hasClaimedX !== undefined && address ? (
        <div className={styles.statsSection} style={{ marginTop: "10px" }}>
          <p>Retweet to get an extra ticket !</p>
          {!hasClaimedX ? (
            <Button
              onClick={() => getExtraTicket(address)}
              // icon={
              //   <img
              //     src="/visuals/twitterIcon.svg"
              //     alt="Twitter Icon"
              //     width={20}
              //   />
              // }
              width={width}
              variation="white"
            >
              Claim now
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
      <Notification visible={showErrorMsg} onClose={closeErrorMsg}>
        <>{errorMsg}</>
      </Notification>
    </>
  );
};

export default ClaimXTicket;
