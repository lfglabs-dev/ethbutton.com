"use client";

import React, { FunctionComponent } from "react";
import { Modal } from "@mui/material";
import styles from "../styles/components/welcomeModal.module.css";
import modalStyles from "../styles/components/modal.module.css";
import Button from "./button";
import { NetworkType, WalletType } from "@/constants/types";
import WalletIcon from "./iconComponents/walletIcon";
import hasStarknetWallets from "@/hooks/hasStarknetWallets";

type TryAgainModalProps = {
  closeModal: () => void;
  open: boolean;
  network?: NetworkType;
  hasEthTokens: boolean;
  openWalletModal?: () => void;
  walletType?: WalletType;
  hasClaimed2FA?: boolean;
  claim2FATicket?: () => void;
};

const TryAgainModal: FunctionComponent<TryAgainModalProps> = ({
  closeModal,
  open,
  network,
  hasEthTokens,
  openWalletModal,
  walletType,
  hasClaimed2FA,
  claim2FATicket,
}) => {
  const wallets = hasStarknetWallets();
  const canClaim2FA =
    walletType && !hasClaimed2FA && network === NetworkType.STARKNET;

  const get2FAText = () => {
    if (canClaim2FA) {
      return "Enable 2FA on your wallet and claim a free ticket. ";
    } else return "";
  };

  const modalDescription =
    network === NetworkType.EVM && hasEthTokens ? (
      <>
        You are eligible to play again with a starknet wallet. You can install
        one of our partner wallets to get an additional click!
      </>
    ) : (
      <>
        Unfortunately, you don&apos;t have clicks left. {get2FAText}You get
        another click for each Starknet domain purchased.
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
              Try <span className="secondary">again !</span>
            </div>

            <div className={styles.description}>{modalDescription}</div>

            {network === NetworkType.EVM && hasEthTokens ? (
              <div className="gap-3 flex flex-col">
                {wallets.map((wallet) => (
                  <Button
                    key={wallet.id}
                    width={260}
                    onClick={
                      wallet.isInstalled
                        ? openWalletModal
                        : () => window.open(`${wallet.label}Website()`)
                    }
                    icon={<img src={wallet.icon} width={22} />}
                  >
                    {wallet.isInstalled
                      ? `Connect with ${wallet.label}`
                      : `Install ${wallet.label}`}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="gap-3 flex flex-col">
                {canClaim2FA && claim2FATicket ? (
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

export default TryAgainModal;
