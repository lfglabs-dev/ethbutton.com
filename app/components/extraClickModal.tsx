"use client";

import React, { FunctionComponent, useState } from "react";
import { Modal } from "@mui/material";
import styles from "../styles/components/welcomeModal.module.css";
import modalStyles from "../styles/components/modal.module.css";
import Button from "./button";
import { NetworkType } from "@/constants/types";
import ClaimXTicket from "./claimXTicket";

type ExtraClickModalProps = {
  closeModal: () => void;
  open: boolean;
  network?: NetworkType;
  openWalletModal?: () => void;
  addrOrName?: string;
  address?: string;
  hasClaimed2FA?: boolean;
  claim2FATicket: () => void;
  hasClaimedX?: boolean;
  isFinished: boolean;
  setHasClaimedX: (hasClaimedX: boolean) => void;
};

const ExtraClickModal: FunctionComponent<ExtraClickModalProps> = ({
  closeModal,
  open,
  network,
  openWalletModal,
  addrOrName,
  address,
  hasClaimed2FA,
  claim2FATicket,
  hasClaimedX,
  isFinished,
  setHasClaimedX,
}) => {
  const [hasClicked, setHasClicked] = useState(false);
  const btnIcon = <img src="/visuals/starknetIcon.svg" />;

  const modalTitle =
    hasClaimed2FA && hasClaimedX ? (
      <>
        Get extra <span className="secondary">tickets</span>
      </>
    ) : (
      <>
        Get an extra <span className="secondary">ticket</span>
      </>
    );

  const retweet = () => {
    window.open(process.env.NEXT_PUBLIC_RETWEET_URL);
    setHasClicked(true);
  };

  if (network !== NetworkType.STARKNET) return null;

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

            {!hasClaimed2FA ? (
              <>
                <div className={styles.description}>
                  Enable 2FA on your wallet and claim a free ticket !
                </div>
                <Button
                  icon={<img src="/visuals/2FA.svg" width={22} />}
                  width={260}
                  onClick={claim2FATicket}
                >
                  Claim 2FA ticket
                </Button>
              </>
            ) : null}

            {!hasClaimedX ? (
              <>
                {hasClicked ? (
                  <ClaimXTicket
                    isConnected={true}
                    isFinished={isFinished}
                    hasClaimedX={hasClaimedX}
                    address={address}
                    showClaimed={false}
                    width={230}
                    setHasClaimedX={setHasClaimedX}
                  />
                ) : (
                  <>
                    <div className={styles.description}>
                      Retweet to get an extra ticket !
                    </div>
                    <Button
                      icon={<img src="/visuals/twitterIcon.svg" width={22} />}
                      width={260}
                      onClick={retweet}
                    >
                      Retweet
                    </Button>
                  </>
                )}
              </>
            ) : null}
            <div onClick={closeModal} className={modalStyles.menu_close}>
              Close
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ExtraClickModal;
