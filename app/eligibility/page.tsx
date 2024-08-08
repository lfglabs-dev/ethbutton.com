"use client";

import React from "next";
import homeStyles from "../styles/home.module.css";
import styles from "../styles/eligibility.module.css";
import Button from "../components/button";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useAccount, useDisconnect } from "@starknet-react/core";
import { NetworkType } from "@/constants/types";
import ConnectModal from "../components/connection/connectModal";
import { minifyAddress } from "@/utils/stringService";
import WalletIcon from "../components/iconComponents/walletIcon";
import { useEnsName, useAccount as useWagmiAccount } from "wagmi";
import { Provider, constants } from "starknet";
import WrongNetworkModal from "../components/wrongNetwork";
import { StarknetIdNavigator } from "starknetid.js";
import VideoBackground from "../components/videoBackground";
import RightArrowIcon from "../components/iconComponents/rightArrowIcon";
import Link from "next/link";
import Steps from "../components/steps";
import ConnectButtons from "../components/connection/connectButtons";
import StarknetWalletConnect from "../components/connection/starknetConnect";
import { getConnectors } from "@/utils/starknetConnectorsWrapper";
import { Connector } from "starknetkit";
import VerificationSteps from "../components/eligibility/verificationSteps";
import EligibilitySteps from "../components/eligibility/eligibilitySteps";
import Message from "../components/message";

export default function Eligibility() {
  // Starknet hooks
  const { disconnectAsync } = useDisconnect();
  const { account: starknetAccount } = useAccount();
  const [starkNameData, setStarkNameData] = useState<string>();
  // EVM hooks
  const { address: evmAddress, isConnected: evmConnected } = useWagmiAccount();
  const { disconnect: disconnectEvm } = useDisconnect();
  const ens = useEnsName({
    address: evmAddress,
  });
  const [message, setMessage] = useState<ReactNode>();
  // state variables
  const [openConnectModal, setOpenConnectModal] = useState(false);
  const [openStarknetModal, setOpenStarknetModal] = useState(false);
  const [wrongNetworkModal, setWrongNetworkModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState<NetworkType>();
  const [progress, setProgress] = useState("verification");
  const address =
    network === NetworkType.STARKNET ? starknetAccount?.address : evmAddress;
  const starknetNetwork =
    process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? "testnet" : "mainnet";
  const [isWrongStarknetNetwork, setIsWrongStarknetNetwork] = useState(false);

  const starknetIdNavigator = useMemo(() => {
    return new StarknetIdNavigator(
      new Provider({
        nodeUrl: process.env.NEXT_PUBLIC_RPC_URL,
      }),
      starknetNetwork === "testnet"
        ? constants.StarknetChainId.SN_SEPOLIA
        : constants.StarknetChainId.SN_MAIN
    );
  }, [starknetNetwork]);

  useEffect(() => {
    if (network === NetworkType.STARKNET && starknetAccount) {
      starknetIdNavigator
        .getStarkName(starknetAccount?.address)
        .then((name) => {
          setStarkNameData(name);
        })
        .catch(() => {
          setStarkNameData(undefined);
        });
    } else {
      setStarkNameData(undefined);
    }
  }, [starknetAccount, network, starknetIdNavigator]);

  useEffect(() => {
    if (evmConnected) {
      setOpenConnectModal(false);
      setIsConnected(true);
      setNetwork(NetworkType.EVM);
    }
  }, [evmConnected]);

  useEffect(() => {
    if (network && isConnected) {
      if (network === NetworkType.STARKNET && isWrongStarknetNetwork)
        setWrongNetworkModal(true);
    }
  }, [network, isConnected, isWrongStarknetNetwork]);

  useEffect(() => {
    if (network === NetworkType.EVM || !isConnected || !starknetAccount) return;
    starknetAccount.getChainId().then((chainId) => {
      const isWrongNetwork =
        (chainId === constants.StarknetChainId.SN_SEPOLIA &&
          starknetNetwork === "mainnet") ||
        (chainId === constants.StarknetChainId.SN_MAIN &&
          starknetNetwork === "testnet");
      setIsWrongStarknetNetwork(isWrongNetwork);
    });
  }, [starknetAccount, network, isConnected, starknetNetwork]);

  const onWalletConnected = (network: NetworkType) => {
    console.log("onWalletConnected", network);
    setNetwork(network);
    setOpenConnectModal(false);
    setIsConnected(true);
  };

  const openWalletModal = () => {
    disconnectUser();
    setOpenConnectModal(true);
  };

  const getConnectionBtnText = () => {
    if (!isConnected || !network) return "Connect wallet";
    return getUserNameOrAddress() ?? "Connect wallet";
  };

  const getUserNameOrAddress = () => {
    switch (network) {
      case NetworkType.STARKNET:
        return starkNameData
          ? starkNameData
          : minifyAddress(starknetAccount?.address);
      case NetworkType.EVM:
        return ens && ens.data ? ens.data : minifyAddress(evmAddress);
      default:
        return undefined;
    }
  };

  const disconnectUser = async () => {
    setMessage("");
    switch (network) {
      case NetworkType.STARKNET:
        await disconnectAsync();
        setIsConnected(false);
        setNetwork(undefined);
        return;
      case NetworkType.EVM:
        console.log("disconnecting evm");
        disconnectEvm();
        setIsConnected(false);
        setNetwork(undefined);
        return;
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

  useEffect(() => {
    if (!isConnected && progress === "eligibility") setProgress("verification");
  }, [isConnected, progress]);

  return (
    <>
      <main className={homeStyles.main}>
        <VideoBackground />
        <div className={homeStyles.leftContainer}>
          <div className={styles.sideBar}>
            <Button
              onClick={connectBtnAction}
              icon={
                !isConnected ? (
                  <WalletIcon
                    width="21"
                    color={isConnected ? "#1E2A3B" : "#C8CCD3"}
                  />
                ) : network === NetworkType.STARKNET ? (
                  <img src="/visuals/starknetIcon.svg" width={20} />
                ) : (
                  <img src="/visuals/ethFilledIcon.svg" width={20} />
                )
              }
              variation={isConnected ? "white" : "default"}
            >
              {getConnectionBtnText()}
            </Button>
            <div className={styles.stepsContainer}>
              <Steps
                steps={[
                  {
                    title: "Step 1",
                    description: "Connect your wallet",
                    icon: "1",
                    completed: isConnected,
                  },
                  {
                    title: "Step 2",
                    description: "Verifying",
                    icon: "2",
                    disabled: !isConnected,
                    completed: progress === "eligibility",
                  },
                  {
                    title: "Step 3",
                    description: "Eligibility",
                    icon: "3",
                    disabled: progress !== "eligibility",
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div className={styles.centralSection}>
          <div
            className={`${styles.backgroundWrapper} ${
              progress === "eligibility" ? styles.long : null
            }`}
          >
            <h1 className={styles.title}>
              <>
                CHECK <span className={homeStyles.pinkTitle}>YOUR</span>{" "}
                <span className={homeStyles.blueTitle}>ELIGIBILITY</span>
              </>
            </h1>
            <div className={styles.container}>
              {isConnected ? (
                progress === "eligibility" ? (
                  <VerificationSteps next={() => setProgress("eligibility")} />
                ) : (
                  <EligibilitySteps
                    disconnect={disconnectUser}
                    setMessage={setMessage}
                    address={address}
                    starknetAccount={starknetAccount}
                    network={network}
                  />
                )
              ) : (
                <ConnectButtons
                  onWalletConnected={onWalletConnected}
                  setOpenStarknetModal={setOpenStarknetModal}
                />
              )}
            </div>
          </div>
        </div>
        <div className={homeStyles.leftContainer}>
          <div className={styles.sideBar}>
            <Link href="/" className="hidden md:block">
              <Button icon={<RightArrowIcon width="21" color="#C8CCD3" />}>
                Go to the game
              </Button>
            </Link>
            {message && <Message message={message} />}
          </div>
        </div>
      </main>
      <ConnectModal
        closeModal={() => setOpenConnectModal(false)}
        open={openConnectModal}
        onWalletConnected={onWalletConnected}
      />
      <WrongNetworkModal
        closeModal={() => setWrongNetworkModal(false)}
        open={wrongNetworkModal}
        disconnectUser={disconnectUser}
      />
      <StarknetWalletConnect
        closeModal={() => setOpenStarknetModal(false)}
        open={openStarknetModal}
        connectors={getConnectors() as Connector[]}
        onWalletConnected={onWalletConnected}
      />
    </>
  );
}
