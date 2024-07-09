import { EthToken, NetworkType, RemainingClicks } from "@/constants/types";
import { getEthTokens } from "@/services/localStorageService";

export const getTotalClicks = (
  remaining: RemainingClicks,
  network?: NetworkType,
  ethTokens?: EthToken[]
): number => {
  const tokensRelatedClicks =
    network === NetworkType.EVM ? 0 : ethTokens?.length ?? 0;
  return (
    (remaining?.eligibilityAmt ?? 0) +
    (remaining?.domainClicks ?? 0) +
    tokensRelatedClicks
  );
};

export const getNonBlacklistedDomain = (
  domains: Record<string, boolean>
): string | null => {
  if (!domains) return null;

  for (const [key, value] of Object.entries(domains)) {
    if (value === false) {
      return key;
    }
  }

  return null;
};

export function isOver5mn(timestamp: number) {
  const currentTime = Date.now(); // Gets the current time in milliseconds
  const fiveMinutesInMilliseconds =
    parseInt(process.env.NEXT_PUBLIC_GAME_DURATION as string) * 1000; // 5 minutes * 60 seconds * 1000 milliseconds

  return currentTime - timestamp > fiveMinutesInMilliseconds;
}

export function needToRecoverToken(
  remainingClicks: RemainingClicks,
  ethTokens: EthToken[]
): boolean {
  if (
    remainingClicks.eligibilityAmt === 0 &&
    !remainingClicks.evmBlacklisted &&
    remainingClicks.whitelisted &&
    (!ethTokens || ethTokens.length === 0)
  )
    return true;
  else return false;
}

export function hasAStarknetClick(): boolean {
  const tokens = getEthTokens();
  if (tokens.length === 0) return false;
  return true;
}
