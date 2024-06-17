import { GetDeploymentDataResult, NetworkType } from "@/constants/types";
import { useEffect, useState } from "react";

export default function isStarknetDeployed(
  network?: NetworkType,
  address?: string
) {
  const [deploymentData, setDeploymentData] =
    useState<GetDeploymentDataResult>();

  useEffect(() => {
    if (!network || network === NetworkType.EVM || !address) {
      setDeploymentData(undefined);
      return;
    }

    const checkIsDeployed = async () => {
      try {
        if (!window.starknet || !window.starknet.isConnected) {
          setDeploymentData(undefined);
          return;
        }

        const data = await window.starknet?.request({
          // @ts-ignore
          type: "wallet_deploymentData",
        });
        console.log("Starknet data for deployment", data);
        if (isGetDeploymentDataResult(data)) {
          setDeploymentData(data);
        } else {
          console.error("Received data is not in the expected format:", data);
          setDeploymentData(undefined);
        }
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
