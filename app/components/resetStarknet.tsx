"use client";

import React, { FunctionComponent } from "react";
import Button from "./button";
import {
  Call,
  CallData,
  Signature,
  shortString,
  typedData as StarknetTypedData,
  StarkNetDomain,
  hash,
} from "starknet";
import {
  OutsideExecution,
  getDomain,
  getOutsideCall,
  getTypedData,
} from "@/utils/callData/typedData";
import { useAccount } from "@starknet-react/core";
import { exec } from "child_process";

// type ResetStarknetProps = {};

const ResetStarknet: FunctionComponent = () => {
  const { account } = useAccount();

  const generateSignature = async () => {
    if (!account) return;
    // const nonce: number = Math.floor(Math.random() * 1000000000000);
    // const execute_before: number = Math.floor(Date.now() / 1000) + 3600 * 24; // + 24h for testing
    const nonce = 516547739500;
    const execute_before = 1749022023;
    const calls: Call[] = [
      {
        contractAddress:
          "0x3697660a0981d734780731949ecb2b4a38d6a58fc41629ed611e8defda",
        entrypoint: "reset_btn_from_starknet",
        calldata: [],
      },
    ];
    const outsideExecution: OutsideExecution = {
      caller:
        "0x0220756d68C9B120Fcfc539510Fc474359BeA9F8bc73e8af3A23A8276d571faf", // todo: update by account address from the server (the one that will execute the transaction)
      nonce,
      execute_after: 0,
      execute_before,
      calls: calls.map((call) => getOutsideCall(call)),
    };
    const typedData = getTypedData(outsideExecution);
    console.log("typedData", typedData);
    // const signature = await account.signer.signMessage(
    //   typedData,
    //   account.address
    // );
    const signature = await account.signMessage(typedData);
    console.log("userSig", signature);

    console.log("account.address", account.address);

    let messageHash = StarknetTypedData.getMessageHash(
      typedData,
      account.address
    );
    console.log("messageHash", messageHash);

    const typeTest = {
      types: {
        StarkNetDomain: [
          { name: "name", type: "felt" },
          { name: "version", type: "felt" },
          { name: "chainId", type: "felt" },
        ],
        OutsideExecution: [
          { name: "caller", type: "felt" },
          { name: "nonce", type: "felt" },
          { name: "execute_after", type: "felt" },
          { name: "execute_before", type: "felt" },
          { name: "calls_len", type: "felt" },
          { name: "calls", type: "OutsideCall*" },
        ],
        OutsideCall: [
          { name: "to", type: "felt" },
          { name: "selector", type: "felt" },
          { name: "calldata_len", type: "felt" },
          { name: "calldata", type: "felt*" },
        ],
      },
      primaryType: "OutsideExecution",
      domain: {
        name: "Account.execute_from_outside",
        version: "1",
        chainId: shortString.encodeShortString("SN_SEPOLIA"),
      },
      message: {
        caller:
          "0x0220756d68C9B120Fcfc539510Fc474359BeA9F8bc73e8af3A23A8276d571faf",
        execute_before: 1717519918,
        execute_after: 0,
        nonce: 516547739599,
        calls_len: 1,
        calls: [
          {
            calldata: [],
            calldata_len: 0,
            selector: hash.getSelectorFromName("reset_btn_from_starknet"),
            to: "0x3697660a0981d734780731949ecb2b4a38d6a58fc41629ed611e8defda",
          },
        ],
      },
    };

    let test = StarknetTypedData.getStructHash(
      typeTest.types,
      "OutsideExecution",
      typeTest.message
    );
    console.log("test", test);
    // 0x1bfc207425a47a5dfa1a50a4f5241203f50624ca5fdf5e18755765416b8e288
    // const callToTest = {
    //   contractAddress: account.address,
    //   entrypoint: "execute_from_outside",
    //   calldata: CallData.compile({ ...outsideExecution, signature }),
    // };

    // let test = await account.execute(callToTest);
    // console.log("test", test);
  };

  return (
    <>
      <Button
        onClick={generateSignature}
        // icon={<img src="/visuals/wallet.svg" width={25} />}
      >
        Reset starknet
      </Button>
    </>
  );
};

export default ResetStarknet;
