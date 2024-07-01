"use client";

import React, { FunctionComponent } from "react";
import { Modal } from "@mui/material";
import styles from "../styles/components/welcomeModal.module.css";
import modalStyles from "../styles/components/modal.module.css";
import Button from "./button";
import { EthToken, NetworkType, RemainingClicks } from "@/constants/types";
import WalletIcon from "./iconComponents/walletIcon";
import { numberToWords } from "@/utils/stringService";
import { getTotalClicks } from "@/utils/dataService";

type WelcomeModalProps = {
  closeModal: () => void;
  open: boolean;
  remainingClicks: RemainingClicks;
  network?: NetworkType;
  addrOrName?: string;
  openWalletModal?: () => void;
  hasEthTokens: boolean;
  ethTokens?: EthToken[];
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
}) => {
  const totalClicks = getTotalClicks(remainingClicks, network, ethTokens);
  const isWhitelisted = remainingClicks.whitelisted;
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
    ) : isWhitelisted ? (
      <>
        You don&apos;t have any clicks left. You get another click for each
        Starknet domain purchased.
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
              <Button icon={btnIcon} width={300} variation="white">
                {addrOrName}
              </Button>
            ) : null}

            <div className={styles.description}>{modalDescription}</div>

            {!remainingClicks.whitelisted || totalClicks == 0 ? (
              <div>
                <Button
                  icon={<img src="/visuals/starknetIdIcon.svg" />}
                  width={300}
                  onClick={() =>
                    window.open(process.env.NEXT_PUBLIC_STARKNET_ID_URL)
                  }
                >
                  Buy Starknet Domain
                </Button>
                <Button
                  icon={<WalletIcon width="21" color="#C8CCD3" />}
                  width={300}
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
