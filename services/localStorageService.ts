import { EthToken } from "@/constants/types";

export const storeVirtualTxId = (txId: string) => {
  const existingDataStr = localStorage.getItem("ethbutton-virtualTxIds");
  let existingData = existingDataStr ? JSON.parse(existingDataStr) : [];

  if (!Array.isArray(existingData)) {
    console.warn("Existing data is not an array. Initializing as a new array.");
    existingData = [];
  }

  existingData.push(txId);
  localStorage.setItem("ethbutton-virtualTxIds", JSON.stringify(existingData));
};

export const getVirtualTxIds = (): string[] => {
  const existingDataStr = localStorage.getItem("ethbutton-virtualTxIds");

  if (!existingDataStr) {
    return [];
  }

  try {
    const existingData = JSON.parse(existingDataStr);
    if (Array.isArray(existingData)) {
      return existingData;
    } else {
      console.warn("Stored data is not an array. Returning an empty array.");
      return [];
    }
  } catch (error) {
    console.error("Error parsing JSON from local storage:", error);
    return [];
  }
};

export const addEthToken = (newToken: EthToken) => {
  const existingTokensStr = localStorage.getItem("ethbutton-ethTokens");
  let existingTokens: EthToken[] = existingTokensStr
    ? JSON.parse(existingTokensStr)
    : [];

  if (!Array.isArray(existingTokens)) {
    console.warn("Existing data is not an array. Initializing as a new array.");
    existingTokens = [];
  }
  if (!existingTokens.some((token) => token.eth_addr === newToken.eth_addr)) {
    existingTokens.push(newToken);
  }

  try {
    const updatedTokensStr = JSON.stringify(existingTokens);
    localStorage.setItem("ethbutton-ethTokens", updatedTokensStr);
  } catch (error) {
    console.error("Error storing EthToken array in local storage:", error);
  }
};

export const getEthTokens = (): EthToken[] => {
  const tokensStr = localStorage.getItem("ethbutton-ethTokens");

  if (!tokensStr) {
    return [];
  }

  try {
    const tokens = JSON.parse(tokensStr);
    if (Array.isArray(tokens)) {
      const uniqueTokens = tokens.reduce((acc: EthToken[], token: EthToken) => {
        // Change 'id' to whatever property uniquely identifies each token
        if (
          !acc.some(
            (accToken) =>
              accToken.token === token.token &&
              accToken.eth_addr === token.eth_addr
          )
        ) {
          acc.push(token);
        }
        return acc;
      }, []);
      return uniqueTokens;
    } else {
      console.warn("Stored data is not an array. Returning an empty array.");
      return [];
    }
  } catch (error) {
    console.error("Error parsing JSON from local storage:", error);
    return [];
  }
};

export const clearEthTokens = () => {
  try {
    localStorage.removeItem("ethbutton-ethTokens");
    console.log("Eth tokens successfully cleared from local storage.");
  } catch (error) {
    console.error("Error clearing Eth tokens from local storage:", error);
  }
};

export const storeEthSig = (ethAddr: string, sig: string): void => {
  if (typeof ethAddr !== "string" || typeof sig !== "string") {
    throw new Error("Both ethAddr and sig must be strings");
  }

  const ethSigObject = { eth_addr: ethAddr, sig: sig };
  localStorage.setItem("ethbutton-ethSig", JSON.stringify(ethSigObject));
};

export const getEthSig = (): { eth_addr: string; sig: string } | null => {
  const ethSigString = localStorage.getItem("ethbutton-ethSig");
  if (!ethSigString) {
    return null;
  }

  try {
    return JSON.parse(ethSigString);
  } catch (error) {
    console.error("Error parsing JSON from local storage", error);
    return null;
  }
};

export const clearEthSig = (): void => {
  localStorage.removeItem("ethbutton-ethSig");
};
