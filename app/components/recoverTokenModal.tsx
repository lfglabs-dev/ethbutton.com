"use client";

import React, { FunctionComponent, useState } from "react";
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
import { storeEthSig } from "@/services/localStorageService";
import { useSignMessage } from "wagmi";

type RecoverTokenModalProps = {
  closeModal: () => void;
  open: boolean;
  addr?: string;
};

const RecoverTokenModal: FunctionComponent<RecoverTokenModalProps> = ({
  closeModal,
  open,
  addr,
}) => {
  const [step, setStep] = useState(0);
  const { signMessageAsync } = useSignMessage();

  const generateSignature = async () => {
    if (!addr) return;
    try {
      const signature = await signMessageAsync({
        message: `I press the Ethereum button with my address`,
      });
      storeEthSig(signature, addr);
      setStep(1);
    } catch (error) {
      console.error("Error while signing message:", error);
    }
  };
  const modalDescription =
    step === 0 ? (
      <>
        You are eligible to play again with a starknet wallet, but first you'll
        need to regenerate a signature with your ethereum wallet.
      </>
    ) : (
      <>
        You can now install one of our partner wallets to get your additional
        click!
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
              No clicks <span className="secondary">left !</span>
            </div>

            <div className={styles.description}>{modalDescription}</div>

            {step == 0 ? (
              <div>
                <Button
                  icon={<img src="/visuals/ethFilledIcon.svg" />}
                  width={300}
                  onClick={generateSignature}
                >
                  Sign message
                </Button>
              </div>
            ) : (
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

export default RecoverTokenModal;
