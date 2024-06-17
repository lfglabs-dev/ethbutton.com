import { NetworkType } from "@/constants/types";
import { useAccount } from "@starknet-react/core";
import { useEffect, useState } from "react";

export default function getTxVersion(network?: NetworkType, address?: string) {
  const { account } = useAccount();
  const [txVersion, setVersion] = useState<number | undefined>();

  useEffect(() => {
    if (!network || network === NetworkType.EVM || !account) {
      setVersion(undefined);
      return;
    }

    const checkIsDeployed = async () => {
      try {
        const supports_v1 = await account.callContract({
          contractAddress: account.address,
          entrypoint: "supports_interface",
          calldata: [
            "0x68cfd18b92d1907b8ba3cc324900277f5a3622099431ea85dd8089255e4181",
          ],
        });

        const supports_v2 = await account.callContract({
          contractAddress: account.address,
          entrypoint: "supports_interface",
          calldata: [
            "0x1d1144bb2138366ff28d8e9ab57456b1d332ac42196230c3a602003c89872",
          ],
        });
        console.log("supports results", supports_v1, supports_v2);

        // @ts-ignore
        if (Number(supports_v1.result[0])) setVersion(1);
        // @ts-ignore
        else if (Number(supports_v2.result[0])) setVersion(2);
        else setVersion(undefined);
      } catch (error) {
        setVersion(undefined);
      }
    };

    checkIsDeployed();
  }, [network, address]);

  return txVersion;
}
