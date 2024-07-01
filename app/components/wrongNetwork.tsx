"use client";

import React, { FunctionComponent } from "react";
import { Modal } from "@mui/material";
import styles from "../styles/components/welcomeModal.module.css";
import modalStyles from "../styles/components/modal.module.css";
import Button from "./button";

type WrongNetworkProps = {
  closeModal: () => void;
  open: boolean;
  disconnectUser: () => void;
};

const WrongNetworkModal: FunctionComponent<WrongNetworkProps> = ({
  closeModal,
  open,
  disconnectUser,
}) => {
  const starknetNetwork =
    process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? "Testnet" : "Mainnet";

  const disconnectAndClose = () => {
    disconnectUser();
    closeModal();
  };

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
              Wrong <span className="secondary">network !</span>
            </div>

            <div className={styles.description}>
              This dapp only support starknet {starknetNetwork}
            </div>

            <Button width={300} onClick={disconnectAndClose}>
              Disconnect
            </Button>

            <div onClick={closeModal} className={modalStyles.menu_close}>
              Close
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WrongNetworkModal;
