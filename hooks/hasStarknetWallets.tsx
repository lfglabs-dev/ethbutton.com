import { useEffect, useState } from "react";
import getStarknet from "get-starknet-core";
import { WalletState } from "@/constants/types";
import {
  getArgentIcon,
  getArgentWebsite,
  getBraavosIcon,
  getBraavosWebsite,
} from "@/utils/starknetConnectorsWrapper";

export default function hasStarknetWallets() {
  const defaultState = [
    {
      id: "argentX",
      isInstalled: false,
      label: "Argent",
      website: getArgentWebsite(),
      icon: getArgentIcon(),
    },
    {
      id: "braavos",
      isInstalled: false,
      label: "Braavos",
      website: getBraavosWebsite(),
      icon: getBraavosIcon(),
    },
  ];
  const [wallets, setWallets] = useState<WalletState[]>(defaultState);
  useEffect(() => {
    const checkWallets = async () => {
      try {
        const availableWallets = await getStarknet.getAvailableWallets();
        if (!availableWallets) {
          setWallets(defaultState);
          return;
        }

        const updatedWallets = defaultState.map((wallet) => ({
          ...wallet,
          isInstalled: availableWallets.some(
            (item) => item.id === `${wallet.id}`
          ),
        }));

        // Sort so installed wallets are first
        updatedWallets.sort(
          (a, b) => Number(b.isInstalled) - Number(a.isInstalled)
        );

        setWallets(updatedWallets);
      } catch (error) {
        setWallets(defaultState);
      }
    };

    checkWallets();
  }, []);

  return wallets;
}
