"use client";

import React, { FunctionComponent, ReactNode } from "react";
import { Snackbar } from "@mui/material";
import styles from "../styles/components/notification.module.css";
import CloseIcon from "./iconComponents/closeIcon";

type NotificationProps = {
  children: ReactNode;
  onClose?: () => void;
  severity?: "error" | "warning" | "info" | "success";
  visible?: boolean;
};

const Notification: FunctionComponent<NotificationProps> = ({
  children,
  onClose,
  severity = "info",
  visible = false,
}) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={visible}
    >
      <div className={styles[severity]}>
        <div>{children}</div>
        <div onClick={onClose} className="cursor-pointer">
          <CloseIcon width="15" color="#C7CBD3" />
        </div>
      </div>
    </Snackbar>
  );
};

export default Notification;
