"use client";

import React from "react";
import { mainnet, sepolia } from "@starknet-react/chains";
import {
  Connector,
  StarknetConfig,
  jsonRpcProvider,
} from "@starknet-react/core";
import { getConnectors } from "@/utils/starknetConnectorsWrapper";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import {
  mainnet as EthMainnet,
  sepolia as EthSepolia,
  // arbitrum,
  // base,
  // blast,
  // optimism,
  // polygon,
  // zkSync,
  // scroll,
  // gnosis,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

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

  // ethereum connection
  const config = getDefaultConfig({
    appName: "Eth Button",
    // projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_APP_ID as string,
    projectId: "a570f8b4f3efe77edb1bf47f2be11495",
    chains: [
      process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? EthSepolia : EthMainnet,
      // arbitrum,
      // optimism,
      // polygon,
      // base,
      // blast,
      // zkSync,
      // scroll,
      // gnosis,
    ],
  });
  const queryClient = new QueryClient();

  return (
    <StarknetConfig
      chains={chains}
      provider={provider}
      connectors={getConnectors() as Connector[]}
    >
      <WagmiProvider config={config} reconnectOnMount={false}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </StarknetConfig>
  );
}
