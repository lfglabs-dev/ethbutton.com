"use client";

import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "../styles/components/countdown.module.css";
import { formatTime } from "@/utils/stringService";
import { Skeleton } from "@mui/material";

type CountdownProps = {
  timestamp: number;
  isLoaded: boolean;
};

const Countdown: FunctionComponent<CountdownProps> = ({
  timestamp,
  isLoaded,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const formattedTime = formatTime(timeRemaining);
  const [minutes, seconds] = formattedTime.split(":");
  const skeleton = (
    <>
      <Skeleton
        variant="rectangular"
        width={50}
        height={50}
        className="mx-auto"
      />
    </>
  );

  useEffect(() => {
    // any time the timestamp is updated we update the timeRemaining
    const now = new Date().getTime(); // Current time in milliseconds
    const timestampExpiration =
      timestamp +
      parseInt(process.env.NEXT_PUBLIC_GAME_DURATION as string) * 1000; // Expiration time based on the received timestamp
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
        <div className={styles.countdown}>
          {isLoaded ? minutes[0] : skeleton}
        </div>
      </div>
      <div className={styles.countdownWrapper}>
        <div className={styles.countdown}>
          {isLoaded ? minutes[1] : skeleton}
        </div>
      </div>
      <div className={styles.separator}>:</div>
      <div className={styles.countdownWrapper}>
        <div className={styles.countdown}>
          {isLoaded ? seconds[0] : skeleton}
        </div>
      </div>
      <div className={styles.countdownWrapper}>
        <div className={styles.countdown}>
          {isLoaded ? seconds[1] : skeleton}
        </div>
      </div>
    </>
  );
};

export default Countdown;
