"use client";

import React from "next";
import Leaderboard from "../components/leaderboard/leaderboard";
import { useEffect, useState } from "react";
import { LeaderboardData } from "@/constants/types";
import { getWinners } from "@/services/leaderboardService";

export default function LeaderboardPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState<LeaderboardData[]>();
  const [participants, setParticipants] = useState<number>(0);

  useEffect(() => {
    if (isLoaded) return;
    getWinners()
      .then((res) => {
        setData(res.winners);
        setParticipants(res.nb_players);
        setIsLoaded(true);
      })
      .catch((err) => {
        console.log("Error while fetching tracking virtualTxId", err);
      });
  });

  return isLoaded ? (
    <Leaderboard
      data={data as LeaderboardData[]}
      isLoaded={isLoaded}
      participants={participants}
    />
  ) : (
    <>Skeleton</>
  );
}
