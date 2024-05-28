"use client";

import React from "next";
import styles from "./styles/home.module.css";
import Button from "./components/button";
import EthButton from "./components/ethButton";
import Stats from "./components/stats";
import Countdown from "./components/countdown";
import EthereumConnect from "./components/ethereumConnect";

export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <div className={styles.leftContainer}>
          <Button
            onClick={() => console.log("Open connect wallet modal")}
            icon={<img src="/visuals/wallet.svg" width={25} />}
          >
            Connect wallet
          </Button>
          <EthereumConnect
            title="Connect with Ethereum"
            updateEthStatus={() => console.log("update status")}
          />
          <Button
            onClick={() => console.log("clicked")}
            icon={<img src="/visuals/eth.svg" width={14} />}
          >
            $3,103
          </Button>
        </div>
        <div className={styles.centralSection}>
          <div className={styles.backgroundWrapper}>
            <img
              alt="background"
              src="/visuals/background.svg"
              className={styles.background}
            />
            <img
              alt="background lines"
              src="/visuals/backgroundLines.svg"
              className={styles.backgroundLines}
            />
            <img
              alt="left squares"
              src="/visuals/leftSquares.svg"
              className={styles.leftSquares}
            />
            <img
              alt="right squares"
              src="/visuals/rightSquares.svg"
              className={styles.rightSquares}
            />
            <img
              alt="bottom squares"
              src="/visuals/bottomSquares.svg"
              className={styles.bottomSquares}
            />
            <img
              alt="vertical group"
              src="/visuals/verticalGroup.svg"
              className={styles.verticalGroupLeft}
            />
            <img
              alt="vertical group"
              src="/visuals/verticalGroup.svg"
              className={styles.verticalGroupRight}
            />
            <div className={styles.radialGradient} />
            <div className={styles.radialGradientLeft} />
            <div className={styles.radialGradientRight} />
            <div className={styles.coloredTrapeze}>
              <div className={styles.darkTrapeze}>
                <h1 className={styles.title}>
                  WIN <span className={styles.pinkTitle}>Five</span>{" "}
                  <span className={styles.blueTitle}>ETH</span> !
                </h1>
              </div>
            </div>
            <div className={styles.countdownContainer}>
              <Countdown />
            </div>
            <div className={styles.ethBtnContainer}>
              <EthButton onClick={() => console.log("eth button clicked")} />
            </div>
          </div>
        </div>
        <Stats />
      </main>
    </>
  );
}
