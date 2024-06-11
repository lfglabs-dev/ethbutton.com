import { EthToken, NetworkType } from "@/constants/types";
import { getEthTokens } from "@/services/localStorageService";
import { useEffect, useState } from "react";

export default function canPlayOnStarknet(network?: NetworkType) {
  const [hasEthTokens, setHasEthTokens] = useState<boolean>(false);
  const [ethTokens, setEthTokens] = useState<EthToken[]>([]);

  useEffect(() => {
    const checkTokens = () => {
      if (!network) {
        setHasEthTokens(false);
        setEthTokens([]);
        return;
      }

      const data = getEthTokens();
      setHasEthTokens(data && data.length > 0);
      setEthTokens(data);
    };

    const interval = setInterval(checkTokens, 5000);

    checkTokens();

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [network]);

  return { hasEthTokens, ethTokens };
}
