import { SearchResult } from "@/constants/types";
import { ethers } from "ethers";
import { validateAndParseAddress } from "starknet";
import { StarknetIdNavigator } from "starknetid.js";
import { parse } from "tldts";

const basicAlphabet = "abcdefghijklmnopqrstuvwxyz0123456789-";

export function useIsValid(
  domainOrAddr: string | undefined
): boolean | undefined {
  if (!domainOrAddr) return undefined;
  if (
    ethers.isAddress(domainOrAddr) ||
    isValidStarkAddr(domainOrAddr) ||
    isValidEns(domainOrAddr) ||
    isValidStrkName(domainOrAddr)
  ) {
    return true;
  } else {
    return false;
  }
}

export async function getStatus(
  starknetIdNavigator: StarknetIdNavigator,
  domainOrAddr: string | undefined,
  signal?: AbortSignal
): Promise<SearchResult> {
  if (!domainOrAddr) return { isValid: true };
  if (ethers.isAddress(domainOrAddr)) {
    // it's an ETH address
    return { isValid: true, addr: domainOrAddr.toLowerCase() };
  } else if (isValidStrkName(domainOrAddr)) {
    // It's a valid starkname
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        return reject("Aborted");
      }
      starknetIdNavigator.getAddressFromStarkName(domainOrAddr).then((data) => {
        if (data && data !== "0x0") {
          resolve({ isValid: true, addr: data });
        } else {
          resolve({
            isValid: false,
            error: "No address found for this Stark name",
          });
        }
      });
    });
  } else if (isValidEns(domainOrAddr)) {
    // it's a valid ENS name, we fetch the address from the ENS name
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        return reject("Aborted");
      }
      fetch(`https://enstate.rs/n/${domainOrAddr}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.address) {
            resolve({ isValid: true, addr: data.address });
          } else {
            resolve({
              isValid: false,
              error: "No address found for this ENS name",
            });
          }
        });
    });
  } else if (isValidStarkAddr(domainOrAddr)) {
    // it's a STRK Addr
    return { isValid: true, addr: domainOrAddr };
  } else {
    return { isValid: false, error: "Invalid input" };
  }
}

export function isValidEns(domain: string): boolean {
  if (domain.endsWith(".eth")) return true;
  const parsed = parse(domain);
  return parsed.isIcann ?? false;
}

export function isValidStrkName(domain: string | undefined): boolean | string {
  if (!domain) domain = "";
  if (!domain.endsWith(".stark")) return false;

  for (const char of domain.replace(".stark", ""))
    if (!basicAlphabet.includes(char)) return char;
  return true;
}

export function isValidStarkAddr(addr: string): string | undefined {
  if (!addr.startsWith("0x")) return undefined;
  try {
    const isValid = validateAndParseAddress(addr);
    console.log("isValid strk addr", isValid);
    return isValid;
  } catch (e) {
    console.log("error while validating strk addr", e);
    return "";
  }
}
