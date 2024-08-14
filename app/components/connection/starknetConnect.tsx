"use client";

import React, { FunctionComponent } from "react";
import { Modal, useMediaQuery } from "@mui/material";
import { Connector } from "starknetkit";
import styles from "../../styles/components/walletConnect.module.css";
import modalStyles from "../../styles/components/modal.module.css";
import {
  getConnectorDiscovery,
  getConnectorIcon,
  getConnectorName,
  sortConnectors,
} from "@/utils/starknetConnectorsWrapper";
import Button from "../button";
import { useConnect } from "@starknet-react/core";
import { NetworkType } from "@/constants/types";

type StarknetWalletConnectProps = {
  closeModal: () => void;
  open: boolean;
  connectors: Connector[];
  onWalletConnected: (network: NetworkType) => void;
};

const StarknetWalletConnect: FunctionComponent<StarknetWalletConnectProps> = ({
  closeModal,
  open,
  connectors,
  onWalletConnected,
}) => {
  const { connectAsync } = useConnect();

  const connect = async (connector: Connector) => {
    await connectAsync({ connector });
    onWalletConnected(NetworkType.STARKNET);
    closeModal();
  };
  const isMobile = useMediaQuery("(max-width: 768px)");

  const filterConnectors = (connectors: Connector[]) => {
    if (!isMobile) return connectors;
    return connectors.filter((connector) => connector.id !== "argentX");
  };

  const openBraavosMobile = () => {
    window.open(`braavos://dapp/ethbutton.com`);
  };

  const needInstall = (connectorId: string, isAvailable: boolean) => {
    if (connectorId === "braavos" && isMobile) {
      return false;
    }
    return !isAvailable;
  };

  const getWalletName = (connectorId: string, isAvailable: boolean): string => {
    return `${needInstall(connectorId, isAvailable) ? "Install " : ""}${
      connectorId === "argentX" && isMobile
        ? "Argent"
        : getConnectorName(connectorId)
    }`;
  };

  const tryConnect = (connector: Connector, isAvailable: boolean) => {
    if (isAvailable) {
      connect(connector);
    } else if (isMobile && connector.id === "braavos") {
      openBraavosMobile();
    } else {
      window.open(getConnectorDiscovery(connector.id));
    }
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
                    onClick={() => tryConnect(connector, isAvailable)}
                  >
                    <Button
                      onClick={() => console.log("Connecting to starknet")}
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
              Back
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default StarknetWalletConnect;
