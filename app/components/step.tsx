import React, { FunctionComponent } from "react";
import styles from "../styles/components/steps.module.css";
import CheckMarkIcon from "./iconComponents/checkMarkIcon";

type StepProps = {
  title: string;
  description: string;
  icon: string;
  disabled?: boolean;
  completed?: boolean;
};

const Step: FunctionComponent<StepProps> = ({
  title,
  description,
  icon,
  disabled,
  completed,
}) => {
  return (
    <div className={`${styles.step} ${completed ? styles.completed : null}`}>
      <div className={styles.iconContainer} aria-disabled={disabled}>
        {completed ? (
          <CheckMarkIcon color="#C8CCD3" width="16" />
        ) : (
          <h1 className={styles.stepIcon}>{icon}</h1>
        )}
      </div>
      <div>
        <h3 className={styles.stepTitle} aria-disabled={disabled}>
          {title}
        </h3>
        <p className={styles.stepDescription} aria-disabled={disabled}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default Step;
