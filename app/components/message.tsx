import React, { FunctionComponent, ReactNode } from "react";
import styles from "../styles/components/message.module.css";

type MessageProps = {
  message: ReactNode;
};

const Message: FunctionComponent<MessageProps> = ({ message }) => {
  return <div className={styles.messageContainer}>{message}</div>;
};

export default Message;
