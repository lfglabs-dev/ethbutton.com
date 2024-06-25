import { GetDeploymentDataResult, NetworkType } from "@/constants/types";
import { useConnect, useProvider } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { wallet } from "starknet";
import getStarknet, { StarknetWindowObject } from "get-starknet-core";

export default function isStarknetDeployed(
  network?: NetworkType,
  address?: string
) {
  const { provider } = useProvider();
  const { connector } = useConnect();
  const [isDeployed, setIsDeployed] = useState<boolean>(false);
  const [deploymentData, setDeploymentData] =
    useState<GetDeploymentDataResult>();

  useEffect(() => {
    if (!network || network === NetworkType.EVM || !address) {
      setDeploymentData(undefined);
      return;
    }

    const checkIsDeployed = async () => {
      try {
        provider
          .getClassHashAt(address)
          .then((classHash) => {
            console.log("Class hash", classHash);
            setIsDeployed(true);
            setDeploymentData(undefined);
            return;
          })
          .catch((error) => {
            console.error("Error getting class hash", error);
            setIsDeployed(false);
          });

        const availableWallets = await getStarknet.getAvailableWallets();
        if (!availableWallets) {
          setDeploymentData(undefined);
          return;
        }

        availableWallets.forEach(async (connectedWallet) => {
          if (
            connectedWallet.id === connector?.id &&
            connectedWallet.isConnected &&
            connectedWallet.id !== "braavos" // we cannot deploye braavos account for the user for now
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

  return { isDeployed, deploymentData };
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
