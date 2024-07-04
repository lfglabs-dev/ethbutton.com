"use client";
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import styles from "../../styles/leaderboard.module.css";
import { minifyAddress } from "@/utils/stringService";
import { ethers } from "ethers";
import { StarknetIdNavigator } from "starknetid.js";
import { Provider, constants } from "starknet";
import { LeaderboardData } from "@/constants/types";

type DataTableProps = {
  data: LeaderboardData[];
  isLoaded: boolean;
  participants: number;
};

const Leaderboard: FunctionComponent<DataTableProps> = ({
  data,
  participants,
  isLoaded,
}) => {
  const [names, setNames] = useState<Record<string, string>>({});
  const [isInit, setIsInit] = useState(false);
  const borderColor =
    "[border-image:linear-gradient(77.5deg,_#109AE4_-31.33%,_#27ABF1_-19.3%,_#2BAAEE_-4.45%,_#3BB1F0_11.89%,_#7581F7_29.28%,_#EF30A2_47.54%,_#F276C0_66.2%,_#FFADDE_81.84%)_30]";

  useEffect(() => {
    if (!isLoaded || isInit) return;
    data.forEach((row) => {
      getAddrOrName(row.address).then((name) => {
        setNames((prev) => ({ ...prev, [row.address]: name }));
      });
    });
    setIsInit(true);
  }, [data, isLoaded, isInit]);

  const starknetIdNavigator = useMemo(() => {
    return new StarknetIdNavigator(
      new Provider({
        nodeUrl: process.env.NEXT_PUBLIC_RPC_URL,
      }),
      process.env.NEXT_PUBLIC_IS_TESTNET === "true"
        ? constants.StarknetChainId.SN_SEPOLIA
        : constants.StarknetChainId.SN_MAIN
    );
  }, []);

  const getAddrOrName = (addr: string): Promise<string> => {
    if (ethers.isAddress(addr)) {
      // It's a eth addr
      return fetch(`https://enstate.rs/n/${addr}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.name) return data.name;
          else return minifyAddress(addr, true);
        })
        .catch(() => {
          return minifyAddress(addr, true);
        });
    } else {
      // It's a starknet addr
      return starknetIdNavigator
        .getStarkName(addr)
        .then((name) => {
          if (name) return name;
          else return minifyAddress(addr, true);
        })
        .catch(() => {
          return minifyAddress(addr, true);
        });
    }
  };

  const getExternalLink = (addr: string): string => {
    if (ethers.isAddress(addr)) {
      return `https://etherscan.io/address/${addr}`;
    } else {
      return `https://starkscan.co/contract/${addr}`;
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.searchSection}></div>
      <div className={styles.tableSection}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Leaderboard</h1>
          <p className={styles.desc}>
            Thank your for participating! Check back soon for more exciting
            challenges and opportunities
          </p>
        </div>
        <div className={styles.tableWrapper}>
          <div className={styles.table}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ranking</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Time clicked</TableHead>
                  <TableHead>Reward</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row) => (
                  <TableRow
                    key={row.address}
                    onClick={() => window.open(getExternalLink(row.address))}
                  >
                    <TableCell>{row.rank}</TableCell>
                    <TableCell>
                      <div className="cursor-pointer">{names[row.address]}</div>
                    </TableCell>
                    <TableCell>{row.times_clicked}</TableCell>
                    <TableCell>$0</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className={styles.participants}>
          Total participants {participants.toLocaleString("en-US")}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
