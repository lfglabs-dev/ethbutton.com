import { EthToken, GetDeploymentDataResult } from "@/constants/types";
import { Signature, stark } from "starknet";

const baseurl = process.env.NEXT_PUBLIC_ETH_BUTTON_API;
const starknetIdBaseUrl = process.env.NEXT_PUBLIC_STARKNET_ID_API;

// todo: Test function to remove
export const resetTimer = async () => {
  try {
    const response = await fetch(`${baseurl}/test_reset`);
    return await response.json();
  } catch (err) {
    console.log("Error while reseting timer", err);
  }
};

export const trackId = async (virtualTxId: string) => {
  try {
    const response = await fetch(
      `${baseurl}/track?virtual_tx_id=${virtualTxId}`
    );
    return await response.json();
  } catch (err) {
    console.log("Error while fetching tracking virtualTxId", err);
  }
};

// Starknet related functions
export const getStarknetEligibility = async (address: string) => {
  try {
    const response = await fetch(
      `${baseurl}/get_starknet_eligibility?addr=${address}`
    );
    return await response.json();
  } catch (err) {
    console.log("Error while fetching starknet eligibility", err);
  }
};

export const getDomainClaimedStatus = async (domains: string[]) => {
  try {
    const response = await fetch(`${baseurl}/domains_claimed_status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ domains }),
    });
    return await response.json();
  } catch (err) {
    console.log("Error while checking domains claim status", err);
  }
};

export const getUserDomains = async (address: string) => {
  try {
    const response = await fetch(
      `${starknetIdBaseUrl}/addr_to_full_ids?addr=${address}`
    );
    return await response.json();
  } catch (err) {
    console.log("Error while fetching user domains", err);
  }
};

export const starknetResetButton = async (
  address: string,
  sig: Signature,
  nonce: number,
  executeBefore: number
) => {
  try {
    const response = await fetch(`${baseurl}/starknet_reset_button`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        addr: address,
        sig: stark.signatureToHexArray(sig),
        nonce,
        execute_before: executeBefore,
      }),
    });
    return await response.json();
  } catch (err) {
    console.log("Error while calling starknet_reset_button", err);
  }
};

export const starknetDomainResetButton = async (
  sig: Signature,
  nonce: number,
  executeBefore: number,
  domain: string
) => {
  try {
    const response = await fetch(`${baseurl}/starknet_domain_reset_button`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        domain: domain,
        sig: stark.signatureToHexArray(sig),
        nonce,
        execute_before: executeBefore,
      }),
    });
    return await response.json();
  } catch (err) {
    console.log("Error while calling starknet_domain_reset_button", err);
  }
};

export const starknetResetButtonFromEth = async (
  starknet_addr: string,
  sig: Signature,
  tokens: EthToken[],
  nonce: number,
  executeBefore: number,
  deploymentData?: GetDeploymentDataResult
) => {
  try {
    const response = await fetch(`${baseurl}/starknet_reset_button_from_eth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        starknet_addr,
        sig: stark.signatureToHexArray(sig),
        tokens,
        nonce,
        execute_before: executeBefore,
        class_hash: deploymentData?.class_hash,
        salt: deploymentData?.salt,
        deployment_calldata: deploymentData?.calldata,
      }),
    });
    return await response.json();
  } catch (err) {
    console.log("Error while calling starknet_reset_button_from_eth", err);
  }
};

// Ethereum related functions
export const getEthEligibility = async (address: string) => {
  try {
    const response = await fetch(
      `${baseurl}/get_eth_eligibility?addr=${address}`
    );
    return await response.json();
  } catch (err) {
    console.log("Error while fetching ethereum eligibility", err);
  }
};

export const ethResetButton = async (addr: string, sig: string) => {
  try {
    const response = await fetch(`${baseurl}/eth_reset_button`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ addr, sig }),
    });
    return await response.json();
  } catch (err) {
    console.log("Error while calling eth_reset_button", err);
  }
};