"use client";

import React from "next";
import styles from "./styles/home.module.css";
import Button from "./components/button";
import EthButton from "./components/ethButton";
import Stats from "./components/stats";
import Countdown from "./components/countdown";
import ResetStarknet from "./components/resetStarknet";
import { useEffect, useState } from "react";
import { useAccount, useDisconnect, useStarkName } from "@starknet-react/core";
import ResetEvm from "./components/resetEvm";
import { NetworkType } from "@/constants/types";
import SelectNetwork from "./components/connection/selectNetwork";
import { minifyAddress } from "@/utils/stringService";
import WalletIcon from "./components/iconComponents/walletIcon";
import { useEnsName, useAccount as useWagmiAccount } from "wagmi";

export default function Home() {
  // Starknet hooks
  const { disconnectAsync } = useDisconnect();
  const { account } = useAccount();
  const { data: starkNameData } = useStarkName({ address: account?.address });
  // EVM hooks
  const { address: evmAddress, isConnected: evmConnected } = useWagmiAccount();
  const { disconnect: disconnectEvm } = useDisconnect();
  const ens = useEnsName({
    address: evmAddress,
  });
  console.log("ens", ens.data);
  console.log("evmAccount", evmAddress);
  // state variables
  const [openConnectModal, setOpenConnectModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState<NetworkType>();

  useEffect(() => {
    if (evmConnected) {
      setOpenConnectModal(false);
      setIsConnected(true);
      setNetwork(NetworkType.evm);
    }
  }, [evmConnected]);

  const onWalletConnected = (network: NetworkType) => {
    setNetwork(network);
    setOpenConnectModal(false);
    setIsConnected(true);
  };

  console.log("network", network, isConnected);

  const getConnectionBtnText = () => {
    if (!isConnected || !network) return "Connect wallet";
    switch (network) {
      case NetworkType.starknet:
        return starkNameData ? starkNameData : minifyAddress(account?.address);
      case NetworkType.evm:
        return ens && ens.data ? ens.data : minifyAddress(evmAddress);
      default:
        return "Connect wallet";
    }
  };

  const disconnectUser = async () => {
    switch (network) {
      case NetworkType.starknet:
        await disconnectAsync();
        setIsConnected(false);
        setNetwork(undefined);
      case NetworkType.evm:
        console.log("disconnecting evm");
        disconnectEvm();
        setIsConnected(false);
        setNetwork(undefined);
      default:
        return;
    }
  };

  const connectBtnAction = () => {
    if (isConnected) {
      disconnectUser();
    } else {
      setOpenConnectModal(true);
    }
  };

  return (
    <>
      <main className={styles.main}>
        <div className={styles.leftContainer}>
          <Button
            onClick={connectBtnAction}
            icon={
              <WalletIcon
                width="21"
                color={isConnected ? "#1E2A3B" : "#C8CCD3"}
              />
            }
            variation={isConnected ? "white" : "default"}
          >
            {getConnectionBtnText()}
          </Button>
          <Button
            onClick={() => console.log("clicked")}
            icon={<img src="/visuals/eth.svg" width={14} />}
          >
            $3,103
          </Button>
          <ResetStarknet />
          <ResetEvm />
        </div>
        <div className={styles.centralSection}>
          <div className={styles.backgroundWrapper}>
            <img
              alt="background"
              src="/visuals/background.svg"
              className={styles.background}
            />
            <img
              alt="background lines"
              src="/visuals/backgroundLines.svg"
              className={styles.backgroundLines}
            />
            <img
              alt="left squares"
              src="/visuals/leftSquares.svg"
              className={styles.leftSquares}
            />
            <img
              alt="right squares"
              src="/visuals/rightSquares.svg"
              className={styles.rightSquares}
            />
            <img
              alt="bottom squares"
              src="/visuals/bottomSquares.svg"
              className={styles.bottomSquares}
            />
            <img
              alt="vertical group"
              src="/visuals/verticalGroup.svg"
              className={styles.verticalGroupLeft}
            />
            <img
              alt="vertical group"
              src="/visuals/verticalGroup.svg"
              className={styles.verticalGroupRight}
            />
            <div className={styles.radialGradient} />
            <div className={styles.radialGradientLeft} />
            <div className={styles.radialGradientRight} />
            <div className={styles.coloredTrapeze}>
              <div className={styles.darkTrapeze}>
                <h1 className={styles.title}>
                  WIN <span className={styles.pinkTitle}>Five</span>{" "}
                  <span className={styles.blueTitle}>ETH</span> !
                </h1>
              </div>
            </div>
            <div className={styles.countdownContainer}>
              <Countdown />
            </div>
            <div className={styles.ethBtnContainer}>
              <EthButton onClick={() => console.log("eth button clicked")} />
            </div>
          </div>
        </div>
        <Stats isConnected={isConnected} />
      </main>
      <SelectNetwork
        closeModal={() => setOpenConnectModal(false)}
        open={openConnectModal}
        onWalletConnected={onWalletConnected}
      />
    </>
  );
}
