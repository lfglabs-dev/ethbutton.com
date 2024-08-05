import React, { FunctionComponent, ReactNode } from "react";
import Button from "./button";
import styles from "../styles/components/card.module.css";
import CircledCheckMarkIcon from "./iconComponents/circledCheckMarkIcon";
import Loader from "./loader";
import ErrorIcon from "./iconComponents/errorIcon";
import { useMediaQuery } from "@mui/material";

type CardProps = {
  title?: string;
  children: ReactNode;
  completed: boolean;
  failed?: boolean;
  loading: boolean;
  buttonText?: string;
  buttonIcon?: ReactNode;
  showButtonDone: boolean;
  onClick?: () => void;
};

const Card: FunctionComponent<CardProps> = ({
  title,
  children,
  completed,
  failed,
  loading,
  buttonText,
  buttonIcon,
  showButtonDone,
  onClick,
}) => {
  const isMobile = useMediaQuery("(max-width: 1280px)");
  return (
    <div className={styles.card}>
      <div className="mr-auto">
        <p className={styles.content}>{children}</p>
      </div>
      {loading ? (
        <Loader />
      ) : failed ? (
        <ErrorIcon color="#D32F2F" width={isMobile ? "24" : "16"} />
      ) : completed ? (
        <div className="flex items-center gap-2">
          {title ? <h1 className={styles.title}>{title}</h1> : null}
          {showButtonDone ? "Done" : null}
          <CircledCheckMarkIcon
            className={styles.checkMark}
            color="#C8CCD3"
            width={isMobile ? "24" : "16"}
          />
        </div>
      ) : buttonText ? (
        <Button width={180} height={30} icon={buttonIcon} onClick={onClick}>
          {buttonText}
        </Button>
      ) : null}
    </div>
  );
};

export default Card;
