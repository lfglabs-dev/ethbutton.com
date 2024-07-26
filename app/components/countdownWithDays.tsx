"use client";

import React, { FunctionComponent, useEffect, useState } from "react";
import { formatTime } from "@/utils/stringService";
import CountDownElement from "./countdownElement";
import { useMediaQuery } from "@mui/material";

type CountdownWithDaysProps = {
  timestamp: number;
};

const CountdownWithDays: FunctionComponent<CountdownWithDaysProps> = ({
  timestamp,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const formattedTime = formatTime(timeRemaining);
  const [days, hours, minutes, seconds] = formattedTime.split(":");
  const isSmall = useMediaQuery("(max-width: 1024px)");
  useEffect(() => {
    // any time the timestamp is updated we update the timeRemaining
    const now = new Date().getTime(); // Current time in milliseconds
    const secondsUntilExpiration = Math.floor((timestamp - now) / 1000);

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
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-3 lg:flex-row">
        <CountDownElement legend="days" time={days} />
        <CountDownElement legend="hours" time={hours} />
      </div>
      {isSmall ? null : (
        <div className="flex gap-3">
          <CountDownElement
            legendPlacement="bottom"
            legend="minutes"
            time={minutes}
          />
          <CountDownElement
            legendPlacement="bottom"
            legend="seconds"
            time={seconds}
          />
        </div>
      )}
    </div>
  );
};

export default CountdownWithDays;
