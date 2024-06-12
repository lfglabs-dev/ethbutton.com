import BN from "bn.js";
import { isHexString } from "./stringService";

export const UINT_128_MAX = (BigInt(1) << BigInt(128)) - BigInt(1);

export function toUint256(n: string): { low: string; high: string } {
  const b = BigInt(n);
  return {
    low: (b & UINT_128_MAX).toString(),
    high: (b >> BigInt(128)).toString(),
  };
}

export function hexToDecimal(hex: string | undefined): string {
  if (hex === undefined) return "";
  else if (!isHexString(hex)) {
    throw new Error("Invalid hex string");
  }

  return new BN(hex.slice(2), 16).toString(10);
}
