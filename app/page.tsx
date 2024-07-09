"use client";

import React from "next";
import styles from "./styles/home.module.css";
import Button from "./components/button";
import EthButton from "./components/ethButton";
import Stats from "./components/stats";
import Countdown from "./components/countdown";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { NetworkType, RemainingClicks } from "@/constants/types";
import ConnectModal from "./components/connection/connectModal";
import { minifyAddress } from "@/utils/stringService";
import WalletIcon from "./components/iconComponents/walletIcon";
import {
  useEnsName,
  useSignMessage as useWagmiSignMessage,
  useAccount as useWagmiAccount,
} from "wagmi";
import getRemainingClicks from "@/hooks/getRemainingClicks";
import {
  getNonBlacklistedDomain,
  getTotalClicks,
  isOver5mn,
  needToRecoverToken,
} from "@/utils/dataService";
import WelcomeModal from "./components/welcomeModal";
import { getOutsideExecution } from "@/services/clickService";
import { getTypedData, getTypedDataV2 } from "@/utils/callData/typedData";
import {
  altStarknetNewAccount,
  ethResetButton,
  resetTimer,
  starknetDomainResetButton,
  starknetResetButton,
  starknetResetButtonFromEth,
  trackId,
} from "@/services/apiService";
import {
  Provider,
  Signature,
  TypedData,
  WeierstrassSignatureType,
  constants,
} from "starknet";
import {
  addEthToken,
  clearEthTokens,
  getEthSig,
  storeVirtualTxId,
} from "@/services/localStorageService";
import canPlayOnStarknet from "@/hooks/canPlayOnStarknet";
import isStarknetDeployed from "@/hooks/isDeployed";
import TryAgainModal from "./components/tryAgainModal";
import Notification from "./components/notification";
import { hexToDecimal } from "@/utils/feltService";
import getPriceValue from "@/hooks/getEthQuote";
import RecoverTokenModal from "./components/recoverTokenModal";
import getTxVersion from "@/hooks/getTxVersion";
import WrongNetworkModal from "./components/wrongNetwork";
import { Skeleton, useMediaQuery } from "@mui/material";
import { StarknetIdNavigator } from "starknetid.js";
import LeaderboardWrapper from "./components/leaderboard/leaderboardWrapper";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  // Starknet hooks
  const { disconnectAsync } = useDisconnect();
  const { account: starknetAccount } = useAccount();
  const [starkNameData, setStarkNameData] = useState<string>();
  const { connector } = useConnect();
  // EVM hooks
  const { address: evmAddress, isConnected: evmConnected } = useWagmiAccount();
  const { disconnect: disconnectEvm } = useDisconnect();
  const ens = useEnsName({
    address: evmAddress,
  });
  const { signMessageAsync } = useWagmiSignMessage();
  // state variables
  const [openConnectModal, setOpenConnectModal] = useState(false);
  const [welcomeModal, setWelcomeModal] = useState(false);
  const [tryAgainModal, setTryAgainModal] = useState(false);
  const [wrongNetworkModal, setWrongNetworkModal] = useState(false);
  const [recoverTokenModal, setRecoverTokenModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState<NetworkType>();
  const address =
    network === NetworkType.STARKNET ? starknetAccount?.address : evmAddress;
  const starknetNetwork =
    process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? "testnet" : "mainnet";
  const [isWrongStarknetNetwork, setIsWrongStarknetNetwork] = useState(false);
  const [countdownTimestamp, setCountdownTimestamp] = useState<number>(0);
  const [currentWinner, setCurrentWinner] = useState<string>("");
  const [totalClicks, setTotalClicks] = useState<number>(0);
  const [totalPlayers, setTotalPlayers] = useState<number>(0);
  const [trackingList, setTrackingList] = useState<string[]>([]);
  const [showNotif, setShowNotif] = useState<boolean>(false);
  const [showNotifPlayed, setShowNotifPlayed] = useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<boolean>(false);

  const priceValue = getPriceValue();
  const { isFirstLoad, remainingClicks } = getRemainingClicks(network, address);
  const { hasEthTokens, ethTokens } = canPlayOnStarknet(network);
  const { isDeployed, deploymentData } = isStarknetDeployed(network, address);
  const isFinished = isOver5mn(countdownTimestamp);
  const txVersion = getTxVersion(network, address);
  const isMobile = useMediaQuery("(max-width: 1024px)");

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
    if (network && isConnected && !isFirstLoad) {
      if (
        network === NetworkType.EVM &&
        needToRecoverToken(remainingClicks, ethTokens)
      ) {
        setRecoverTokenModal(true);
      } else {
        if (network === NetworkType.STARKNET && isWrongStarknetNetwork)
          setWrongNetworkModal(true);
        else setWelcomeModal(true);
      }
    }
  }, [isFirstLoad]);

  useEffect(() => {
    if (!isLoaded && process.env.NEXT_PUBLIC_ENABLE_LEADERBOARD === "true") {
      setLeaderboard(true);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded && countdownTimestamp !== 0) {
      setIsLoaded(true);
    }
  }, [countdownTimestamp]);

  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL as string);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCountdownTimestamp(parseInt(data.last_reset_info[0]));
      setCurrentWinner(data.last_reset_info[1]);
      setTotalClicks(parseInt(data.click_counter));
      setTotalPlayers(parseInt(data.players));
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (trackingList && trackingList.length > 0) {
      trackingList.forEach((txId: string) => {
        trackId(txId).then((res) => {
          const decimalAddr = hexToDecimal(
            starknetAccount
              ? (starknetAccount?.address as string)
              : (evmAddress as string)
          );
          if (hexToDecimal(res.winner_addr) !== decimalAddr) {
            if (getTotalClicks(remainingClicks, network, ethTokens) > 0) {
              // user has some remaining clicks with this wallet
              setShowNotif(true);
            } else {
              // user has no more clicks on this wallet but needs to recover a click token
              if (needToRecoverToken(remainingClicks, ethTokens))
                setRecoverTokenModal(true);
              // show try again modal
              else setTryAgainModal(true);
            }
            // remove txId from trackingList
            setTrackingList((prev) => prev.filter((id) => id !== txId));
          }
        });
      });
    }
  }, [trackingList, currentWinner]);

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
    setWelcomeModal(false);
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

  const needSkipDeploy = (): boolean => {
    return !isDeployed && connector?.id && connector.id.includes("argent")
      ? true
      : false;
  };

  const connectBtnAction = () => {
    if (isConnected) {
      disconnectUser();
    } else {
      setOpenConnectModal(true);
    }
  };

  const openConnectionModalIfNeeded = (condition: boolean) => {
    if (condition) {
      setOpenConnectModal(true);
      return true;
    }
    return false;
  };

  const handleEligibleStarknetReset = async (
    typedData: TypedData,
    nonce: number,
    executeBefore: number
  ) => {
    try {
      if (!starknetAccount) return;
      const signature = (await starknetAccount.signMessage(
        typedData
      )) as WeierstrassSignatureType;
      const virtualTxId = await starknetResetButton(
        starknetAccount?.address as string,
        signature,
        nonce,
        executeBefore,
        txVersion as number
      );
      storeVirtualTxId(virtualTxId.virtual_tx_id);
      setTrackingList([...trackingList, virtualTxId.virtual_tx_id]);
      setShowNotifPlayed(true);
    } catch (error) {
      console.error("Error during starkner reset:", error);
    }
  };

  const handleDomainStarknetReset = async (
    typedData: TypedData,
    nonce: number,
    executeBefore: number
  ) => {
    try {
      const signature = await starknetAccount?.signMessage(typedData);
      const availableDomain = getNonBlacklistedDomain(
        remainingClicks?.domainStatus as Record<string, boolean>
      );
      if (!availableDomain) {
        setTryAgainModal(true);
        return;
      }
      const virtualTxId = await starknetDomainResetButton(
        signature as Signature,
        nonce,
        executeBefore,
        availableDomain,
        txVersion as number
      );
      storeVirtualTxId(virtualTxId.virtual_tx_id);
      setTrackingList([...trackingList, virtualTxId.virtual_tx_id]);
      setShowNotifPlayed(true);
    } catch (error) {
      console.error("Error during starknet domain reset:", error);
    }
  };

  const handleEthResetFromStarknet = async (
    typedData: TypedData,
    nonce: number,
    executeBefore: number
  ) => {
    if (hasEthTokens && ethTokens.length > 0) {
      try {
        const signature = await starknetAccount?.signMessage(
          typedData,
          // @ts-expect-error we should skip deploy
          { skipDeploy: needSkipDeploy() }
        );
        const virtualTxId = await starknetResetButtonFromEth(
          starknetAccount?.address as string,
          signature as Signature,
          ethTokens,
          nonce,
          executeBefore,
          txVersion as number,
          deploymentData
        );
        console.log("virtualTxId", virtualTxId);
        storeVirtualTxId(virtualTxId.virtual_tx_id);
        clearEthTokens();
        setTrackingList([...trackingList, virtualTxId.virtual_tx_id]);
        setShowNotifPlayed(true);
      } catch (error) {
        console.error("Error during eth reset from starknet:", error);
      }
    } else {
      const ethSig = getEthSig();
      if (ethSig) {
        // we have eth signature in local storage, so we can call alt_starknet_new_account
        // with eth_addr and signature
        try {
          const signature = await starknetAccount?.signMessage(
            typedData,
            // @ts-expect-error we should skip deploy
            { skipDeploy: needSkipDeploy() }
          );
          const virtualTxId = await altStarknetNewAccount(
            starknetAccount?.address as string,
            signature as Signature,
            ethSig.eth_addr,
            ethSig.sig,
            nonce,
            executeBefore,
            txVersion as number,
            deploymentData
          );
          console.log("virtualTxId", virtualTxId);
          storeVirtualTxId(virtualTxId.virtual_tx_id);
          clearEthTokens();
          setTrackingList([...trackingList, virtualTxId.virtual_tx_id]);
          setShowNotifPlayed(true);
        } catch (error) {
          console.error("Error during alt starknet new reset:", error);
        }
      } else {
        setTryAgainModal(true);
      }
    }
  };

  const handleStarknetButtonClick = async () => {
    const nonce = Math.floor(Math.random() * 1000000000000);
    const executeBefore = Math.floor(Date.now() / 1000) + 3600 * 48; // + 48h for testing
    const outsideExecution = getOutsideExecution(nonce, executeBefore);
    if (!txVersion) console.log("txVersion is undefined");
    const typedData =
      txVersion === 1
        ? getTypedData(outsideExecution)
        : getTypedDataV2(outsideExecution);

    if (remainingClicks.eligibilityAmt && remainingClicks.eligibilityAmt > 0) {
      await handleEligibleStarknetReset(typedData, nonce, executeBefore);
    } else if (
      remainingClicks.domainClicks &&
      remainingClicks.domainClicks > 0
    ) {
      await handleDomainStarknetReset(typedData, nonce, executeBefore);
    } else {
      await handleEthResetFromStarknet(typedData, nonce, executeBefore);
    }
  };

  const handleEvmButtonClick = async () => {
    if (remainingClicks.eligibilityAmt && remainingClicks.eligibilityAmt > 0) {
      try {
        const signature = await signMessageAsync({
          message: `I press the Ethereum button with my address`,
        });
        const res = await ethResetButton(evmAddress as string, signature);
        storeVirtualTxId(res.virtual_tx_id);
        addEthToken({
          token: res.token,
          eth_addr: res.eth_addr,
        });
        setTrackingList([...trackingList, res.virtual_tx_id]);
        setShowNotifPlayed(true);
      } catch (error) {
        console.error("Error during eth reset:", error);
      }
    } else {
      if (
        remainingClicks.eligibilityAmt === 0 &&
        !remainingClicks.evmBlacklisted
      ) {
        console.log("User can play on starknet");
        if (!hasEthTokens) {
          console.log(
            "User has no tokens in local storage but his eth addr is not blacklisted"
          );
          setRecoverTokenModal(true);
        } else {
          console.log("User has tokens in local storage");
          setTryAgainModal(true);
        }
      } else {
        console.log(
          "he can't play on starknet, he has to buy domains or try another address"
        );
        setTryAgainModal(true);
      }
    }
  };

  const clickEthButton = async () => {
    if (openConnectionModalIfNeeded(!isConnected)) return;

    switch (network) {
      case NetworkType.STARKNET:
        if (isWrongStarknetNetwork) {
          setWrongNetworkModal(true);
          return;
        }
        if (openConnectionModalIfNeeded(!starknetAccount)) return;
        await handleStarknetButtonClick();
        break;
      case NetworkType.EVM:
        if (openConnectionModalIfNeeded(!evmAddress)) return;
        await handleEvmButtonClick();
        break;
      default:
        return;
    }
  };

  return (
    <>
      {leaderboard ? (
        <LeaderboardWrapper />
      ) : (
        <>
          <main className={styles.main}>
            <div className={styles.leftContainer}>
              {isFinished && isLoaded ? (
                <>
                  <div className={styles.endText}>
                    <p>
                      Thank you for participating! Check back soon for more
                      exciting challenges and opportunities.
                    </p>
                    <p>Stay connected with us for updates and future events!</p>
                    <div className={styles.socialIcons}>
                      <img
                        src="/visuals/discordIcon.svg"
                        alt="Discord Icon"
                        width={20}
                        onClick={() => window.open("https://twitter.com/")}
                      />
                      <img
                        src="/visuals/twitterIcon.svg"
                        alt="Twitter Icon"
                        width={20}
                        onClick={() => window.open("https://twitter.com/")}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
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
                  {isConnected && !isFinished ? (
                    <div className={styles.remainingClicksMobile}>
                      Remaining clicks :{" "}
                      {getTotalClicks(remainingClicks, network, ethTokens)}
                    </div>
                  ) : null}
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
                      <Button icon={<img src="/visuals/eth.svg" width={14} />}>
                        {priceValue}
                      </Button>
                    )
                  ) : null}
                </>
              )}

              {/* // todo: remove after testing is over */}
              {isFinished && isLoaded ? (
                <Button onClick={resetTimer}>TEST: start timer</Button>
              ) : null}
            </div>
            <div className={styles.centralSection}>
              <div className={styles.backgroundWrapper}>
                <h1 className={styles.title}>
                  {!isLoaded || !isFinished ? (
                    <>
                      WIN <span className={styles.pinkTitle}>Five</span>{" "}
                      <span className={styles.blueTitle}>ETH</span> !
                    </>
                  ) : (
                    <>
                      GAME <span className={styles.pinkTitle}>ENDED</span> !
                    </>
                  )}
                </h1>
                <div className={styles.countdownContainer}>
                  <Countdown
                    timestamp={countdownTimestamp}
                    isLoaded={isLoaded}
                  />
                </div>
                <div className={styles.ethBtnContainer}>
                  <EthButton onClick={clickEthButton} isFinished={isFinished} />
                </div>
              </div>
            </div>
            <Stats
              isConnected={isConnected}
              remainingClicks={getTotalClicks(
                remainingClicks as RemainingClicks,
                network,
                ethTokens
              )}
              totalClicks={totalClicks}
              totalPlayers={totalPlayers}
              isFinished={!isLoaded ? false : isFinished}
              currentWinner={currentWinner}
              isLoaded={isLoaded}
            />
          </main>
          <ConnectModal
            closeModal={() => setOpenConnectModal(false)}
            open={openConnectModal}
            onWalletConnected={onWalletConnected}
          />
          <WelcomeModal
            closeModal={() => setWelcomeModal(false)}
            open={welcomeModal}
            remainingClicks={remainingClicks as RemainingClicks}
            network={network}
            addrOrName={getConnectionBtnText()}
            openWalletModal={openWalletModal}
            hasEthTokens={hasEthTokens}
            ethTokens={ethTokens}
          />
          <TryAgainModal
            closeModal={() => setTryAgainModal(false)}
            open={tryAgainModal}
            network={network}
            hasEthTokens={hasEthTokens}
            openWalletModal={openWalletModal}
          />
          <RecoverTokenModal
            closeModal={() => setRecoverTokenModal(false)}
            open={recoverTokenModal}
            addr={evmAddress}
          />
          <WrongNetworkModal
            closeModal={() => setWrongNetworkModal(false)}
            open={wrongNetworkModal}
            disconnectUser={disconnectUser}
          />
          <Notification visible={showNotif} onClose={() => setShowNotif(false)}>
            <>
              Try again! You still have{" "}
              {getTotalClicks(remainingClicks, network, ethTokens)} chance to
              press the button.
            </>
          </Notification>
          <Notification
            visible={showNotifPlayed}
            onClose={() => setShowNotifPlayed(false)}
          >
            <>
              Counter successfully reset, if it reaches zero before someone
              resets it again, you will win 5 eth
            </>
          </Notification>
        </>
      )}
    </>
  );
}
