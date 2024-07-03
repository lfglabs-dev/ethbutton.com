"use client";

import React from "next";
import Leaderboard from "../components/leaderboard/leaderboard";

export default function LeaderboardPage() {
  const data = [
    {
      address:
        "0x061790c262d20a77a4f5b3b10d4dd83b73e0b071be4f13c00dddbe61d708b221",
      rank: 1,
      timesClicked: 183,
    },
    {
      address:
        "0x02a9c0015e9b0d0ad7cf6edf250582f9c517215270f485de3831b920f91ded3d",
      rank: 2,
      timesClicked: 1,
    },
  ];

  return <Leaderboard data={data} loading={false} />;
}
