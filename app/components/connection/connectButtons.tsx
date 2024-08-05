import Button from "../button";
import styles from "../../styles/components/walletConnect.module.css";
import React, { FunctionComponent } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount as useWagmiAccount } from "wagmi";
import { NetworkType } from "@/constants/types";

type ConnectButtonsProps = {
  setOpenStarknetModal: (open: boolean) => void;
  onWalletConnected: (network: NetworkType) => void;
};

const ConnectButtons: FunctionComponent<ConnectButtonsProps> = ({
  setOpenStarknetModal,
  onWalletConnected,
}) => {
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
    <div className={styles.selectNetwork}>
      <Button
        onClick={connectEvm}
        icon={<img src="/visuals/ethFilledIcon.svg" />}
        width={260}
        variation="default"
      >
        EVM wallet
      </Button>
      <Button
        onClick={() => setOpenStarknetModal(true)}
        icon={<img src="/visuals/starknetIcon.svg" />}
        width={260}
        variation="default"
      >
        Starknet wallet
      </Button>
    </div>
  );
};

export default ConnectButtons;
