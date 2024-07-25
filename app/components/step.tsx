import React, { FunctionComponent } from "react";
import styles from "../styles/components/steps.module.css";

type StepProps = {
  title: string;
  description: string;
  icon: string;
  disabled?: boolean;
};

const Step: FunctionComponent<StepProps> = ({
  title,
  description,
  icon,
  disabled,
}) => {
  return (
    <div className={styles.step}>
      <div className={styles.iconContainer} aria-disabled={disabled}>
        <h1 className={styles.stepIcon}>{icon}</h1>
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
