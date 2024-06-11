"use client";

import React, { FunctionComponent } from "react";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import styles from "../../styles/components/ethereumConnect.module.css";
import Button from "../button";

type EthereumConnectProps = {
  title: string;
};

const EthereumConnect: FunctionComponent<EthereumConnectProps> = ({
  title,
}) => {
  const { openConnectModal } = useConnectModal();
  return (
    <ConnectButton.Custom>
      {({
        // account,
        // chain,
        // openAccountModal,
        // openChainModal,
        // openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        // const connected =
        //   ready &&
        //   account &&
        //   chain &&
        //   (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            className={styles.connectButton}
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              return (
                <Button
                  onClick={() => openConnectModal && openConnectModal()}
                  icon={<img src="/visuals/ethFilledIcon.svg" />}
                  width={300}
                >
                  {title ? title : "Connect Wallet"}
                </Button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default EthereumConnect;
