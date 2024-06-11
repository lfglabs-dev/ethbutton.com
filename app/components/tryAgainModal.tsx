"use client";

import React, { FunctionComponent } from "react";
import { Modal } from "@mui/material";
import styles from "../styles/components/welcomeModal.module.css";
import modalStyles from "../styles/components/modal.module.css";
import Button from "./button";
import { NetworkType } from "@/constants/types";
import WalletIcon from "./iconComponents/walletIcon";
import {
  getArgentIcon,
  getArgentWebsite,
  getBraavosIcon,
  getBraavosWebsite,
} from "@/utils/starknetConnectorsWrapper";

type TryAgainModalProps = {
  closeModal: () => void;
  open: boolean;
  network?: NetworkType;
  hasEthTokens: boolean;
  openWalletModal?: () => void;
};

const TryAgainModal: FunctionComponent<TryAgainModalProps> = ({
  closeModal,
  open,
  network,
  hasEthTokens,
  openWalletModal,
}) => {
  const modalDescription =
    network === NetworkType.evm && hasEthTokens ? (
      <>
        You are eligible to play again with a starknet wallet. You can install
        one of our partner wallets to get an additional click!
      </>
    ) : (
      <>
        Unfortunately, you don&apos;t have clicks left. You get another click
        for each Starknet domain purchased.
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

            {network === NetworkType.evm && hasEthTokens ? (
              <div>
                <Button
                  icon={<img src={getArgentIcon()} width={22} />}
                  width={300}
                  onClick={() => window.open(getArgentWebsite())}
                >
                  Argent
                </Button>
                <Button
                  icon={<img src={getBraavosIcon()} width={22} />}
                  width={300}
                  onClick={() => window.open(getBraavosWebsite())}
                >
                  Braavos
                </Button>
              </div>
            ) : (
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
