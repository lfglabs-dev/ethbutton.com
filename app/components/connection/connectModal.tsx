"use client";

import React, { FunctionComponent, useState } from "react";
import { Modal } from "@mui/material";
import modalStyles from "../../styles/components/modal.module.css";
import styles from "../../styles/components/walletConnect.module.css";
import { NetworkType } from "@/constants/types";
import StarknetWalletConnect from "./starknetConnect";
import { getConnectors } from "@/utils/starknetConnectorsWrapper";
import { Connector } from "starknetkit";
import Button from "../button";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount as useWagmiAccount } from "wagmi";

type StarknetWalletConnectProps = {
  closeModal: () => void;
  open: boolean;
  onWalletConnected: (network: NetworkType) => void;
};

const ConnectModal: FunctionComponent<StarknetWalletConnectProps> = ({
  closeModal,
  open,
  onWalletConnected,
}) => {
  const [openStarknetModal, setOpenStarknetModal] = useState(false);
  const { openConnectModal } = useConnectModal();
  const { isDisconnected } = useWagmiAccount();

  const connectEvm = () => {
    // openConnectModal is sometimes undefined because user is already connected
    if (isDisconnected) {
      openConnectModal && openConnectModal();
    } else {
      onWalletConnected(NetworkType.EVM);
    }
  };

  return (
    <>
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
              <div className={styles.selectNetworkTitle}>
                <span>Choose</span> your{" "}
                <span className={styles.titleBlue}>network</span>
              </div>
              <div className={styles.selectNetwork}>
                <Button
                  onClick={connectEvm}
                  icon={<img src="/visuals/ethFilledIcon.svg" />}
                  width={300}
                  variation="default"
                >
                  EVM wallet
                </Button>
                <Button
                  onClick={() => setOpenStarknetModal(true)}
                  icon={<img src="/visuals/starknetIcon.svg" />}
                  width={300}
                  variation="default"
                >
                  Starknet wallet
                </Button>
              </div>
              <div onClick={closeModal} className={styles.menu_close}>
                Close
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <StarknetWalletConnect
        closeModal={() => setOpenStarknetModal(false)}
        open={openStarknetModal}
        connectors={getConnectors() as Connector[]}
        onWalletConnected={onWalletConnected}
      />
    </>
  );
};

export default ConnectModal;
