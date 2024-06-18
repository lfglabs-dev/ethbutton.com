import { GetDeploymentDataResult, NetworkType } from "@/constants/types";
import { useConnect } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { wallet } from "starknet";
import getStarknet, { StarknetWindowObject } from "get-starknet-core";

export default function isStarknetDeployed(
  network?: NetworkType,
  address?: string
) {
  const { connector } = useConnect();
  const [deploymentData, setDeploymentData] =
    useState<GetDeploymentDataResult>();

  useEffect(() => {
    if (!network || network === NetworkType.EVM || !address) {
      setDeploymentData(undefined);
      return;
    }

    const checkIsDeployed = async () => {
      try {
        const availableWallets = await getStarknet.getAvailableWallets();

        if (!availableWallets) {
          setDeploymentData(undefined);
          return;
        }

        availableWallets.forEach(async (connectedWallet) => {
          if (
            connectedWallet.id === connector?.id &&
            connectedWallet.isConnected
          ) {
            const data = await wallet.deploymentData(
              // @ts-ignore
              connectedWallet as StarknetWindowObject
            );
            console.log("Starknet data for deployment", data);
            if (isGetDeploymentDataResult(data)) {
              setDeploymentData(data);
            } else {
              console.error(
                "Received data is not in the expected format:",
                data
              );
              setDeploymentData(undefined);
            }
          }
        });
      } catch (error) {
        setDeploymentData(undefined);
      }
    };

    checkIsDeployed();
  }, [network, address]);

  return deploymentData;
}

function isGetDeploymentDataResult(obj: any): obj is GetDeploymentDataResult {
  return (
    obj &&
    typeof obj.address === "string" &&
    typeof obj.class_hash === "string" &&
    typeof obj.salt === "string" &&
    Array.isArray(obj.calldata) &&
    obj.calldata.every((c: any) => typeof c === "string")
  );
}
