import { NetworkType } from "@/constants/types";
import { useAccount, useConnect } from "@starknet-react/core";
import { useEffect, useState } from "react";

export default function getTxVersion(network?: NetworkType, address?: string) {
  const { account } = useAccount();
  const { connector } = useConnect();
  const [txVersion, setVersion] = useState<number | undefined>();

  useEffect(() => {
    if (!network || network === NetworkType.EVM || !account) {
      setVersion(undefined);
      return;
    }

    const checkTxVersion = async () => {
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

        // @ts-ignore
        if (Number(supports_v1.result[0])) setVersion(1);
        // @ts-ignore
        else if (Number(supports_v2.result[0])) setVersion(2);
        else {
          if (connector?.id.includes("argent") || connector?.id === "bitkeep")
            setVersion(1);
          else if (connector?.id === "braavos") setVersion(2);
          else setVersion(undefined);
        }
      } catch (error) {
        console.log("Error while checking tx version", error);
        if (connector?.id.includes("argent")) setVersion(1);
        else if (connector?.id === "braavos") setVersion(2);
        else setVersion(undefined);
      }
    };

    checkTxVersion();
  }, [network, address, account?.address, connector]);

  return txVersion;
}
