import React from "react";
import styles from "../styles/components/modal.module.css";
import { FunctionComponent, ReactNode } from "react";
import { Modal } from "@mui/material";

type ModalMessageProps = {
  title: string;
  message: ReactNode;
  closeModal: () => void;
  open: boolean;
};

const ModalMessage: FunctionComponent<ModalMessageProps> = ({
  title,
  message,
  closeModal,
  open,
}) => {
  return (
    <Modal
      disableAutoFocus
      open={open}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={styles.menu_wrapper}>
        <div className={styles.menu}>
          <p className={styles.menu_title}>{title}</p>
          {message}
          <div onClick={closeModal} className={styles.menu_close}>
            Close
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default ModalMessage;
