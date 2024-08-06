"use client";

import React, { FunctionComponent, useMemo } from "react";
import { Modal } from "@mui/material";
import styles from "../styles/components/welcomeModal.module.css";
import modalStyles from "../styles/components/modal.module.css";
import Button from "./button";
import {
  EthToken,
  NetworkType,
  RemainingClicks,
  WalletType,
} from "@/constants/types";
import WalletIcon from "./iconComponents/walletIcon";
import { numberToWords } from "@/utils/stringService";
import { getTotalClicks, hasAStarknetClick } from "@/utils/dataService";
import {
  getArgentIcon,
  getArgentWebsite,
} from "@/utils/starknetConnectorsWrapper";
import hasArgent from "@/hooks/hasArgent";

type WelcomeModalProps = {
  closeModal: () => void;
  open: boolean;
  remainingClicks: RemainingClicks;
  network?: NetworkType;
  addrOrName?: string;
  openWalletModal?: () => void;
  hasEthTokens: boolean;
  ethTokens?: EthToken[];
  walletType?: WalletType;
  hasClaimed2FA?: boolean;
  claim2FATicket: () => void;
};

const WelcomeModal: FunctionComponent<WelcomeModalProps> = ({
  closeModal,
  open,
  remainingClicks,
  network,
  addrOrName,
  openWalletModal,
  hasEthTokens,
  ethTokens,
  walletType,
  hasClaimed2FA,
  claim2FATicket,
}) => {
  const totalClicks = getTotalClicks(remainingClicks, network, ethTokens);
  const isWhitelisted = remainingClicks.whitelisted;
  const isInstalled = hasArgent();

  const hasStarknetClicks = useMemo(() => {
    if (typeof window !== "undefined") return hasAStarknetClick();
  }, []);

  const btnIcon =
    network === NetworkType.STARKNET ? (
      <img src="/visuals/starknetIcon.svg" />
    ) : (
      <img src="/visuals/ethFilledIcon.svg" />
    );

  const modalTitle =
    isWhitelisted || hasEthTokens ? (
      <>
        You are connected <span className="secondary">with</span>
      </>
    ) : (
      <>
        This address is not <span className="secondary">eligible</span>
      </>
    );

  const get2FAText = () => {
    if (walletType && !hasClaimed2FA) {
      return "Enable 2FA on your wallet and claim a free ticket. ";
    } else return "";
  };

  const modalDescription =
    totalClicks > 0 ? (
      <>
        You only get{" "}
        <span className="primary airstrike text-2xl">
          {numberToWords(totalClicks)}
        </span>{" "}
        {totalClicks > 1 ? "clicks" : "click"} with this address. Make sure to
        choose the right moment to win the prize!
      </>
    ) : hasStarknetClicks ? (
      <>Get a free ticket for downloading a Starknet wallet!</>
    ) : isWhitelisted ? (
      <>
        You don&apos;t have any clicks left. {get2FAText()}You get another click
        for each Starknet domain purchased.
      </>
    ) : (
      <>
        Your address is not eligible for the game. You get one click for each
        Starknet domain purchased.
      </>
    );

  return (
    <Modal
      disableAutoFocus
      open={open}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      componentsProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      }}
    >
      <div className={modalStyles.menu_wrapper}>
        <div className={modalStyles.menu}>
          <div className={modalStyles.modal_content}>
            <div className={`${modalStyles.menu_title} primary`}>
              {modalTitle}
            </div>

            {addrOrName ? (
              <Button icon={btnIcon} width={260} variation="white">
                {addrOrName}
              </Button>
            ) : null}

            <div className={styles.description}>{modalDescription}</div>

            {hasStarknetClicks && network === NetworkType.EVM ? (
              <div className="gap-3 flex flex-col">
                {!isInstalled ? (
                  <Button
                    icon={<img src={getArgentIcon()} width={22} />}
                    width={260}
                    onClick={() => window.open(getArgentWebsite())}
                  >
                    Install Argent
                  </Button>
                ) : (
                  <Button
                    icon={<img src={getArgentIcon()} width={22} />}
                    width={260}
                    onClick={openWalletModal}
                  >
                    Connect with Argent
                  </Button>
                )}
              </div>
            ) : totalClicks == 0 ? (
              <div className=" flex flex-col gap-3">
                {isWhitelisted && walletType && !hasClaimed2FA ? (
                  <Button
                    icon={<img src="/visuals/2FA.svg" width={22} />}
                    width={260}
                    onClick={claim2FATicket}
                  >
                    Claim 2FA ticket
                  </Button>
                ) : null}
                <Button
                  icon={<img src="/visuals/starknetIdIcon.svg" />}
                  width={260}
                  onClick={() =>
                    window.open(process.env.NEXT_PUBLIC_STARKNET_ID_URL)
                  }
                >
                  Buy Starknet Domain
                </Button>
                <Button
                  icon={<WalletIcon width="21" color="#C8CCD3" />}
                  width={260}
                  onClick={openWalletModal}
                >
                  Select another wallet
                </Button>
              </div>
            ) : (
              <></>
            )}

            <div onClick={closeModal} className={modalStyles.menu_close}>
              Close
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WelcomeModal;
