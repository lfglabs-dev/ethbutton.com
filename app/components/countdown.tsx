"use client";

import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "../styles/components/countdown.module.css";
import { formatTime } from "@/utils/stringService";

type CountdownProps = {
  timestamp: number;
};

const Countdown: FunctionComponent<CountdownProps> = ({ timestamp }) => {
  const countdownDuration = 300; // todo: 5mn, move this into env variables ?
  const [timeRemaining, setTimeRemaining] = useState(120); // in seconds
  const formattedTime = formatTime(timeRemaining);
  const [minutes, seconds] = formattedTime.split(":");

  useEffect(() => {
    // any time the timestamp is updated we update the timeRemaining
    const now = new Date().getTime(); // Current time in milliseconds
    const timestampExpiration = timestamp + countdownDuration * 1000; // Expiration time based on the received timestamp
    const secondsUntilExpiration = Math.floor(
      (timestampExpiration - now) / 1000
    );

    setTimeRemaining(secondsUntilExpiration > 0 ? secondsUntilExpiration : 0);
  }, [timestamp]);

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
