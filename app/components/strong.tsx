import styles from "../styles/components/strong.module.css";
import React, { FunctionComponent } from "react";

type StrongProps = {
  children: React.ReactNode;
};

const Strong: FunctionComponent<StrongProps> = ({ children }) => (
  <strong className={styles.strong}>{children}</strong>
);

export default Strong;
