import { RemainingClicks } from "@/constants/types";

export const getTotalClicks = (remaining: RemainingClicks): number => {
  return (remaining?.eligibilityAmt ?? 0) + (remaining?.domainClicks ?? 0);
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
  const fiveMinutesInMilliseconds = 300000; // 5 minutes * 60 seconds * 1000 milliseconds

  return currentTime - timestamp > fiveMinutesInMilliseconds;
}
