"use client";

import React, { FunctionComponent } from "react";
import { Modal, useMediaQuery } from "@mui/material";
import { Connector } from "starknetkit";
import styles from "../styles/components/walletConnect.module.css";
import {
  getConnectorDiscovery,
  getConnectorIcon,
  getConnectorName,
  sortConnectors,
} from "@/utils/starknetConnectorsWrapper";
import Button from "./button";

type StarknetWalletConnectProps = {
  closeModal: () => void;
  open: boolean;
  connectors: Connector[];
  connectWallet: (connector: Connector) => void;
};

const StarknetWalletConnect: FunctionComponent<StarknetWalletConnectProps> = ({
  closeModal,
  open,
  connectors,
  connectWallet,
}) => {
  const connect = (connector: Connector) => {
    connectWallet(connector);
    closeModal();
  };
  const isMobile = useMediaQuery("(max-width: 768px)");

  const filterConnectors = (connectors: Connector[]) => {
    if (!isMobile) return connectors;
    return connectors.filter((connector) => connector.id !== "argentMobile");
  };

  const getWalletName = (connectorId: string, isAvailable: boolean): string => {
    return `${!isAvailable ? "Install " : ""}${
      connectorId === "argentX" && isMobile
        ? "Argent"
        : getConnectorName(connectorId)
    }`;
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
      <div className={styles.menu_wrapper}>
        <div className={styles.menu}>
          <div className={styles.modalContent}>
            <div className={styles.modalTitle}>
              Connect <span>to</span>
            </div>
            {sortConnectors(filterConnectors(connectors)).map(
              (connector: Connector) => {
                const isAvailable = connector.available();
                return (
                  <div
                    key={connector.id}
                    className={styles.wallet}
                    onClick={
                      isAvailable
                        ? () => connect(connector)
                        : () => window.open(getConnectorDiscovery(connector.id))
                    }
                  >
                    <Button
                      onClick={() => console.log("Open connect wallet modal")}
                      icon={
                        <img
                          src={getConnectorIcon(connector.id)}
                          className={styles.walletIcon}
                        />
                      }
                      width={300}
                    >
                      {getWalletName(connector.id, isAvailable)}
                    </Button>
                  </div>
                );
              }
            )}
            <div onClick={closeModal} className={styles.menu_close}>
              Close
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default StarknetWalletConnect;
