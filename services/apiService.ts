import {
  EthToken,
  GetDeploymentDataResult,
  WalletType,
} from "@/constants/types";
import { Signature, stark } from "starknet";

const baseurl = process.env.NEXT_PUBLIC_ETH_BUTTON_API;
const starknetIdBaseUrl = process.env.NEXT_PUBLIC_STARKNET_ID_API;

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
  executeBefore: number,
  version: number
) => {
  let sigHex = stark.signatureToHexArray(sig);
  try {
    const response = await fetch(`${baseurl}/starknet_reset_button`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        addr: address,
        sig: sigHex,
        nonce,
        execute_before: executeBefore,
        version,
      }),
    });
    return await response.json();
  } catch (err: any) {
    console.log("Error while calling starknet_reset_button", err);
    throw new Error(err.message);
  }
};

export const starknetDomainResetButton = async (
  sig: Signature,
  nonce: number,
  executeBefore: number,
  domain: string,
  version: number
) => {
  const sigHex = stark.signatureToHexArray(sig);
  try {
    const response = await fetch(`${baseurl}/starknet_domain_reset_button`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        domain: domain,
        sig: sigHex,
        nonce,
        execute_before: executeBefore,
        version,
      }),
    });
    return await response.json();
  } catch (err: any) {
    console.log("Error while calling starknet_reset_button_from_eth", err);
    throw new Error(err.message);
  }
};

export const starknetResetButtonFromEth = async (
  starknet_addr: string,
  sig: Signature,
  tokens: EthToken[],
  nonce: number,
  executeBefore: number,
  version: number,
  deploymentData?: GetDeploymentDataResult
) => {
  const sigHex = stark.signatureToHexArray(sig);
  try {
    const response = await fetch(`${baseurl}/starknet_reset_button_from_eth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        starknet_addr,
        sig: sigHex,
        tokens,
        nonce,
        execute_before: executeBefore,
        class_hash: deploymentData?.class_hash,
        salt: deploymentData?.salt,
        deployment_calldata: deploymentData?.calldata,
        version,
      }),
    });
    return await response.json();
  } catch (err: any) {
    console.log("Error while calling starknet_reset_button_from_eth", err);
    throw new Error(err.message);
  }
};

export const altStarknetNewAccount = async (
  starknet_addr: string,
  sig: Signature,
  eth_addr: string,
  eth_sig: String,
  nonce: number,
  executeBefore: number,
  version: number,
  deploymentData?: GetDeploymentDataResult
) => {
  const sigHex = stark.signatureToHexArray(sig);
  try {
    const response = await fetch(`${baseurl}/alt_starknet_new_account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eth_addr,
        starknet_addr,
        eth_sig,
        sig: sigHex,
        nonce,
        execute_before: executeBefore,
        class_hash: deploymentData?.class_hash,
        salt: deploymentData?.salt,
        deployment_calldata: deploymentData?.calldata,
        version,
      }),
    });
    return await response.json();
  } catch (err: any) {
    console.log("Error while calling starknet_reset_button_from_eth", err);
    throw new Error(err.message);
  }
};

// Ethereum related functions
export const getEthEligibility = async (address: string) => {
  try {
    const response = await fetch(
      `${baseurl}/get_eth_eligibility?addr=${address}`
    );
    return await response.json();
  } catch (err: any) {
    console.log("Error while fetching ethereum eligibility", err);
    throw new Error(err.message);
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
  } catch (err: any) {
    console.log("Error while calling eth_reset_button", err);
    throw new Error(err.message);
  }
};

export const claim2FATicketQuery = async (
  address: string,
  walletType: WalletType
) => {
  try {
    const response = await fetch(`${baseurl}/claim_2fa_ticket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        addr: address,
        wallet_type: walletType,
      }),
    });

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      // If the content type is not JSON, read the response as text
      const errorMessage = await response.text();
      return { error: errorMessage }; // Return a custom object containing the error message
    }
  } catch (error: any) {
    console.error("Error fetching data: ", error.message);
    throw new Error(error.message);
  }
};
