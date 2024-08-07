import { NetworkType, WalletType } from "@/constants/types";
import { useConnect } from "@starknet-react/core";
import { useEffect, useState } from "react";
import getStarknet from "get-starknet-core";

export default function getWalletType(network?: NetworkType, address?: string) {
  const { connector } = useConnect();
  const [walletType, setWalletType] = useState<WalletType>();

  useEffect(() => {
    if (!network || network === NetworkType.EVM || !address) {
      setWalletType(undefined);
      return;
    }

    const checkIsDeployed = async () => {
      try {
        const availableWallets = await getStarknet.getAvailableWallets();
        if (!availableWallets) {
          setWalletType(undefined);
          return;
        }

        availableWallets.forEach(async (connectedWallet) => {
          if (
            connectedWallet.id === connector?.id &&
            connectedWallet.isConnected
          ) {
            if (connectedWallet.id.includes("argent")) {
              setWalletType("argent");
            } else if (connectedWallet.id === "braavos") {
              setWalletType("braavos");
            }
          }
        });
      } catch (error) {
        setWalletType(undefined);
      }
    };

    checkIsDeployed();
  }, [network, address]);

  return walletType;
}
