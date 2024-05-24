"use client";

import React from "react";
import { mainnet, sepolia } from "@starknet-react/chains";
import {
  Connector,
  StarknetConfig,
  jsonRpcProvider,
} from "@starknet-react/core";
import { getConnectors } from "@/utils/starknetConnectorsWrapper";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Providers({ children }: any) {
  const chains = [
    process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? sepolia : mainnet,
  ];
  const provider = jsonRpcProvider({
    rpc: () => ({
      nodeUrl: process.env.NEXT_PUBLIC_RPC_URL as string,
    }),
  });
  return (
    <StarknetConfig
      chains={chains}
      provider={provider}
      connectors={getConnectors() as Connector[]}
    >
      {children}
    </StarknetConfig>
  );
}
