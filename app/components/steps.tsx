import React, { FunctionComponent } from "react";
import styles from "../styles/components/steps.module.css";
import Step from "./step";

type Step = {
  title: string;
  description: string;
  icon: string;
  disabled?: boolean;
  completed?: boolean;
};

type StepsProps = {
  steps: Step[];
};

const Steps: FunctionComponent<StepsProps> = ({ steps }) => {
  return (
    <div className={styles.steps}>
      {steps.map((step, index) => (
        <Step key={index} {...step} />
      ))}
    </div>
  );
};

export default Steps;
