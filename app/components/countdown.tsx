"use client";

import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "../styles/components/countdown.module.css";
import { formatTime } from "@/utils/stringService";

// type CountdownProps = {};

const Countdown: FunctionComponent = () => {
  const [timeRemaining, setTimeRemaining] = useState(120); // in seconds
  const formattedTime = formatTime(timeRemaining);
  const [minutes, seconds] = formattedTime.split(":");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className={styles.countdownWrapper}>
        <div className={styles.countdown}>{minutes[0]}</div>
      </div>
      <div className={styles.countdownWrapper}>
        <div className={styles.countdown}>{minutes[1]}</div>
      </div>
      <div>:</div>
      <div className={styles.countdownWrapper}>
        <div className={styles.countdown}>{seconds[0]}</div>
      </div>
      <div className={styles.countdownWrapper}>
        <div className={styles.countdown}>{seconds[1]}</div>
      </div>
    </>
  );
};

export default Countdown;
