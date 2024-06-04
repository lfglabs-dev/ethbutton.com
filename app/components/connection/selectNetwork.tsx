"use client";

import React, { FunctionComponent, useState } from "react";
import { Modal } from "@mui/material";
import styles from "../../styles/components/walletConnect.module.css";
import { NetworkType } from "@/constants/types";
import StarknetWalletConnect from "./starknetConnect";
import { getConnectors } from "@/utils/starknetConnectorsWrapper";
import { Connector } from "starknetkit";
import Button from "../button";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "@starknet-react/core";

type StarknetWalletConnectProps = {
  closeModal: () => void;
  open: boolean;
  onWalletConnected: (network: NetworkType) => void;
};

const SelectNetwork: FunctionComponent<StarknetWalletConnectProps> = ({
  closeModal,
  open,
  onWalletConnected,
}) => {
  const [openStarknetModal, setOpenStarknetModal] = useState(false);
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const { address, isDisconnected, isConnected } = useAccount();

  const connectEvm = () => {
    // console.log(
    //   "connectEvm",
    //   address,
    //   isConnected,
    //   "disconnected",
    //   isDisconnected
    // );
    // openConnectModal is sometimes undefined with MetaMask
    // need to investigate this further
    console.log("openConnectModal", openConnectModal);
    if (isDisconnected) {
      openConnectModal && openConnectModal();
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
        <div className={styles.menu_wrapper}>
          <div className={styles.menu}>
            <div className={styles.modalContent}>
              <div className={styles.selectNetworkTitle}>
                <span>Choose</span> your{" "}
                <span className={styles.titleBlue}>network</span>
              </div>
              <div className={styles.selectNetwork}>
                {/* <EthereumConnect
                  title="EVM wallet"
                  onWalletConnected={onWalletConnected}
                /> */}
                <Button
                  onClick={connectEvm}
                  icon={<img src="/visuals/ethFilledIcon.svg" />}
                  width={300}
                >
                  EVM wallet
                </Button>
                <Button
                  onClick={() => setOpenStarknetModal(true)}
                  icon={<img src="/visuals/starknetIcon.svg" />}
                  width={300}
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

export default SelectNetwork;
