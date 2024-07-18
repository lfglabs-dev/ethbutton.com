import { useEffect, useState } from "react";
import getStarknet from "get-starknet-core";

export default function hasArgent() {
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  useEffect(() => {
    const checkHasArgent = async () => {
      try {
        const availableWallets = await getStarknet.getAvailableWallets();
        if (!availableWallets) {
          setIsInstalled(false);
          return;
        }

        const argent = availableWallets.find((item) => item.id === "argentX");
        if (argent) setIsInstalled(true);
        else setIsInstalled(false);
      } catch (error) {
        setIsInstalled(false);
      }
    };

    checkHasArgent();
  }, []);

  return isInstalled;
}
