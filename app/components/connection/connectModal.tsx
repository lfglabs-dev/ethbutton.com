"use client";

import React, { FunctionComponent, useState } from "react";
import { Modal } from "@mui/material";
import modalStyles from "../../styles/components/modal.module.css";
import styles from "../../styles/components/walletConnect.module.css";
import { NetworkType } from "@/constants/types";
import StarknetWalletConnect from "./starknetConnect";
import { getConnectors } from "@/utils/starknetConnectorsWrapper";
import { Connector } from "starknetkit";
import ConnectButtons from "./connectButtons";

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
              <ConnectButtons
                setOpenStarknetModal={setOpenStarknetModal}
                onWalletConnected={onWalletConnected}
              />
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
