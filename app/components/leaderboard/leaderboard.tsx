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
import { LeaderboardData, SearchResult } from "@/constants/types";
import SearchBar from "./searchBar";
import { getUserData } from "@/services/leaderboardService";
import LeaderboardSkeleton from "./leaderboardSkeleton";

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
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchResult, setSearchResult] = useState<LeaderboardData | undefined>(
    undefined
  );
  const [error, setError] = useState<string | undefined>(undefined);
  const [currentResult, setCurrentResult] = useState<SearchResult | null>();

  useEffect(() => {
    if (!isLoaded || isInit) return;
    data.forEach((row) => {
      getAddrOrName(row.address).then((name) => {
        setNames((prev) => ({ ...prev, [row.address]: name }));
      });
    });
    setIsInit(true);
  }, [data, isLoaded, isInit]);

  useEffect(() => {
    if (!currentResult) {
      if (isSearchMode) setIsSearchMode(false);
      return;
    }
  }, [currentResult]);

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

  const onSearch = (result: SearchResult) => {
    setIsSearchMode(true);
    if (result.isValid) {
      setError(undefined);
      // fetch api
      getUserData(result?.addr as string)
        .then((data) => {
          if (data) {
            setSearchResult(data);
          } else {
            setError("No data found for this address");
            setSearchResult(undefined);
          }
        })
        .catch((err) => {
          setError(err as string);
          setSearchResult(undefined);
        });
    } else {
      if (result.error) setError(result.error as string);
      setSearchResult(undefined);
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.searchSection}>
        <SearchBar
          starknetIdNavigator={starknetIdNavigator}
          setCurrentResult={setCurrentResult}
          onSearch={onSearch}
        />
      </div>
      <div className={styles.tableSection}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Leaderboard</h1>
          <p className={styles.desc}>
            Thank your for participating! Check back soon for more exciting
            challenges and opportunities
          </p>
        </div>
        {isLoaded ? (
          <>
            <div className={styles.tableWrapper}>
              <div className={styles.table}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ranking</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Total clicks</TableHead>
                      <TableHead>Reward</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!isSearchMode ? (
                      data &&
                      data.map((row) => (
                        <TableRow
                          key={row.address}
                          onClick={() =>
                            window.open(getExternalLink(row.address))
                          }
                        >
                          <TableCell>{row.rank}</TableCell>
                          <TableCell>
                            <div className="cursor-pointer">
                              {names[row.address]}
                            </div>
                          </TableCell>
                          <TableCell>{row.times_clicked}</TableCell>
                          <TableCell>
                            <div className="flex flex-row gap-1">
                              {row?.reward ? (
                                <img
                                  src="/visuals/ethereumIcon.svg"
                                  width={18}
                                />
                              ) : (
                                <div></div>
                              )}
                              ${row?.reward ?? 0}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : error ? (
                      <div className="text-center m-5">{error}</div>
                    ) : searchResult ? (
                      <TableRow
                        key={searchResult?.address}
                        onClick={() =>
                          window.open(
                            getExternalLink(searchResult?.address as string)
                          )
                        }
                      >
                        <TableCell>{searchResult?.rank}</TableCell>
                        <TableCell>
                          <div className="cursor-pointer">
                            {minifyAddress(searchResult?.address, true)}
                          </div>
                        </TableCell>
                        <TableCell>{searchResult?.times_clicked}</TableCell>
                        <TableCell>
                          <div className="flex flex-row gap-1">
                            {searchResult?.reward ? (
                              <img src="/visuals/ethereumIcon.svg" width={18} />
                            ) : (
                              <div></div>
                            )}
                            ${searchResult?.reward ?? 0}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className={styles.participants}>
              Total participants {participants.toLocaleString("en-US")}
            </div>
          </>
        ) : (
          <LeaderboardSkeleton />
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
