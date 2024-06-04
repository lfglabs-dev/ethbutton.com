"use client";

import React, { FunctionComponent } from "react";
import Button from "./button";
import { useSignMessage } from "wagmi";
import { ethers, hashMessage } from "ethers";
import { Signature } from "ethers";

const ResetEvm: FunctionComponent = () => {
  const { signMessageAsync } = useSignMessage();
  const evmAddress = "0x9524F1f9F002a7FE810d47C940Eb7D34668023d7";

  const generateSignature = async () => {
    let signature = await signMessageAsync({
      message: `I press the Ethereum button with my address ${evmAddress}`,
    });
    console.log("signature", signature);
    // 0xc0d8e63414aeb68f972c5efb75cbd2cb377466054a464469981513c275c12bd719ccca0ba5df9afb3667e10f1547655f0c4df707febfbadf8d4bb2a0650bd2921c
    // @ts-ignore
    console.log("signature", Signature.from(signature));

    // let test = toUint256(signature);
    let msgHash = hashMessage(
      `I press the Ethereum button with my address ${evmAddress}`
    );
    console.log("msgHash", msgHash);
    // 0x55d6e394742bb56facfc870cc6cce1b5e24630d92f2a136c97d2c0211b380ccb
  };

  return (
    <>
      <Button onClick={generateSignature}>Reset evm</Button>
    </>
  );
};

export default ResetEvm;
