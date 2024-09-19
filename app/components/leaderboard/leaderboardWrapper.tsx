"use client";

import React from "next";
import { FunctionComponent } from "react";
import { LeaderboardData } from "@/constants/types";
import Leaderboard from "./leaderboard";

const LeaderboardWrapper: FunctionComponent = () => {
  // const [isLoaded, setIsLoaded] = useState(false);
  // const [data, setData] = useState<LeaderboardData[]>();
  // const [participants, setParticipants] = useState<number>(3607);
  const participants = 3607;
  const winners: LeaderboardData[] = [
    {
      address:
        "0x075f829bfd061ea938d7f8e399db70ac410b719cb1f0a321ce1d80dca44fbbd0",
      rank: 1,
      times_clicked: 1,
      reward: "5",
    },
    {
      address: "0xcd61a050a000af3093cdbbf536717356b709683b",
      rank: 2,
      times_clicked: 1,
    },
    {
      address: "0x27674c788249dbe99e8e5f12cafe1f1c8b9e7a12",
      rank: 3,
      times_clicked: 1,
    },
    {
      address:
        "0x0625eb7e2a2b279eeaff6edd753abfd82f5e2fd0f69af0b2ab6528f8e517d9df",
      rank: 4,
      times_clicked: 1,
    },
    {
      address: "0x84ef5a8fcfd2873d053dbc76276a98801ed081e1",
      rank: 5,
      times_clicked: 1,
    },
    {
      address:
        "0x04e1ec4b3f6c8658f4e2adc0237fac75cf9b20aecb0638597e3cb8d26c0d9519",
      rank: 6,
      times_clicked: 1,
    },
    {
      address: "0x611f08e009a02b77d1ce331e01b616b93ee5738c",
      rank: 7,
      times_clicked: 1,
    },
    {
      address:
        "0x07fbe54431c250c3560ffa44b1d7d57b056e320dade627ff6123466dc081b0b7",
      rank: 8,
      times_clicked: 1,
    },
    {
      address:
        "0x04d25fa97c8080069ba27839f12691bb13ea74ccdb89a55b576fa3d2d8b39d48",
      rank: 9,
      times_clicked: 10,
    },
    {
      address: "0xf6400fe683ab896001caca296e6940c819b68449",
      rank: 10,
      times_clicked: 1,
    },
  ];

  // useEffect(() => {
  //   if (isLoaded) return;
  //   getWinners()
  //     .then((res) => {
  //       setData(res.winners);
  //       setParticipants(res.nb_players);
  //       setIsLoaded(true);
  //     })
  //     .catch((err) => {
  //       console.log("Error while fetching tracking virtualTxId", err);
  //     });
  // });

  return (
    <Leaderboard data={winners} isLoaded={true} participants={participants} />
  );
};

export default LeaderboardWrapper;
